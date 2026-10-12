const express = require("express");

const router = express.Router();

const QueueToken = require("../models/queueToken");
const Patient = require("../models/patient");

// ============================================================
// BEST TIME TO VISIT - VERSION 3
// ============================================================
//
// Dynamic recommendation based on:
//
// 1. Historical completed consultations
// 2. Historical activity by time period
// 3. Current active queue
// 4. Patient's queue position
// 5. Current consultation
// 6. Average consultation duration
// 7. Current hospital workload
// 8. Predicted patient activity
// 9. Expected waiting time
// 10. Live queue information
//
// Endpoint:
//
// GET /best-time/:patientId
//
// ============================================================


// ============================================================
// TIME PERIODS
// ============================================================

const TIME_SLOTS = [
  {
    name: "9:00 AM - 11:00 AM",
    startHour: 9,
    endHour: 11,
    baselineFactor: 0.55,
  },
  {
    name: "11:00 AM - 1:00 PM",
    startHour: 11,
    endHour: 13,
    baselineFactor: 0.85,
  },
  {
    name: "1:00 PM - 3:00 PM",
    startHour: 13,
    endHour: 15,
    baselineFactor: 1.0,
  },
  {
    name: "3:00 PM - 5:00 PM",
    startHour: 15,
    endHour: 17,
    baselineFactor: 0.75,
  },
  {
    name: "5:00 PM - 7:00 PM",
    startHour: 17,
    endHour: 19,
    baselineFactor: 0.65,
  },
];


// ============================================================
// HELPER - GET WORKLOAD
// ============================================================

function getWorkload(patientCount) {
  if (patientCount >= 7) {
    return "High";
  }

  if (patientCount >= 4) {
    return "Medium";
  }

  return "Low";
}


// ============================================================
// HELPER - GET WAITING RANGE
// ============================================================

function getWaitingRange(
  patientCount,
  averageConsultationTime
) {
  const minimum = Math.max(
    5,
    Math.round(
      patientCount * averageConsultationTime
    )
  );

  const maximum = Math.max(
    minimum + 5,
    Math.round(minimum * 1.5)
  );

  return `${minimum} - ${maximum} minutes`;
}


// ============================================================
// TEST ROUTE
// IMPORTANT:
// This must come BEFORE /:patientId
// ============================================================

router.get(
  "/test/status",
  (req, res) => {
    res.json({
      success: true,
      message:
        "Best Time to Visit Version 3 route is working",
      version: "Version 3",
    });
  }
);


// ============================================================
// MAIN ROUTE
// ============================================================

router.get(
  "/:patientId",
  async (req, res) => {
    try {
      const { patientId } = req.params;

      console.log(
        "Best Time V3 request:",
        patientId
      );


      // ======================================================
      // 1. VALIDATE PATIENT
      // ======================================================

      const patient =
        await Patient.findById(patientId);

      if (!patient) {
        return res.status(404).json({
          success: false,
          message: "Patient not found",
        });
      }


      // ======================================================
      // 2. GET CURRENT ACTIVE QUEUE
      // ======================================================

      const activeQueue =
        await QueueToken.find({
          status: {
            $in: [
              "Waiting",
              "In Consultation",
            ],
          },
        }).sort({
          queueNumber: 1,
        });


      // ======================================================
      // 3. CURRENT ACTIVE PATIENT COUNT
      // ======================================================

      const totalActivePatients =
        activeQueue.length;


      // ======================================================
      // 4. LIVE QUEUE COUNTS
      // ======================================================

      const waitingPatients =
        activeQueue.filter(
          (token) =>
            token.status === "Waiting"
        ).length;

      const patientsInConsultation =
        activeQueue.filter(
          (token) =>
            token.status === "In Consultation"
        ).length;


      // ======================================================
      // 5. CURRENT WORKLOAD
      // ======================================================

      const currentWorkload =
        getWorkload(
          totalActivePatients
        );


      // ======================================================
      // 6. FIND PATIENT'S ACTIVE TOKEN
      // ======================================================

      const activePatientToken =
        await QueueToken.findOne({
          patientId,
          status: {
            $in: [
              "Waiting",
              "In Consultation",
            ],
          },
        }).sort({
          createdAt: -1,
        });

      const hasActiveToken =
        !!activePatientToken;


      // ======================================================
      // 7. PATIENTS AHEAD
      // ======================================================

      let patientsAhead = 0;

      if (
        activePatientToken &&
        activePatientToken.queueNumber != null
      ) {
        patientsAhead =
          activeQueue.filter(
            (token) =>
              token.status === "Waiting" &&
              token.queueNumber <
                activePatientToken.queueNumber
          ).length;
      }


      // ======================================================
      // 8. CURRENT CONSULTATION
      // ======================================================

      const currentConsultation =
        activeQueue.find(
          (token) =>
            token.status === "In Consultation"
        );


      // ======================================================
      // 9. GET COMPLETED CONSULTATIONS
      // ======================================================

      const completedConsultations =
        await QueueToken.find({
          status: "Completed",

          consultationDuration: {
            $gt: 0,
          },

          consultationEndTime: {
            $exists: true,
            $ne: null,
          },
        })
          .sort({
            consultationEndTime: -1,
          })
          .limit(50);


      // ======================================================
      // 10. HISTORICAL SAMPLE COUNT
      // ======================================================

      const historicalSamples =
        completedConsultations.length;


      // ======================================================
      // 11. AVERAGE CONSULTATION TIME
      // ======================================================

      let averageConsultationTime = 5;

      if (
        completedConsultations.length > 0
      ) {
        const totalDuration =
          completedConsultations.reduce(
            (total, consultation) => {
              return (
                total +
                Number(
                  consultation.consultationDuration || 0
                )
              );
            },
            0
          );

        averageConsultationTime =
          totalDuration /
          completedConsultations.length;
      }

      averageConsultationTime =
        Math.max(
          1,
          Math.round(
            averageConsultationTime
          )
        );


      // ======================================================
      // 12. CURRENT CONSULTATION REMAINING TIME
      // ======================================================

      let currentConsultationRemaining = 0;

      if (
        currentConsultation &&
        currentConsultation.consultationStartTime
      ) {
        const startTime =
          new Date(
            currentConsultation.consultationStartTime
          );

        const elapsedMinutes =
          Math.max(
            0,
            Math.round(
              (
                Date.now() -
                startTime.getTime()
              ) / 60000
            )
          );

        currentConsultationRemaining =
          Math.max(
            0,
            averageConsultationTime -
              elapsedMinutes
          );
      }


      // ======================================================
      // 13. CURRENT LIVE TIME SLOT
      // ======================================================

      const now = new Date();

      const currentHour =
        now.getHours();

      const currentSlotIndex =
        TIME_SLOTS.findIndex(
          (slot) =>
            currentHour >= slot.startHour &&
            currentHour < slot.endHour
        );


      // ======================================================
      // 14. ANALYZE EACH TIME SLOT
      // ======================================================

      const slotAnalysis =
        TIME_SLOTS.map(
          (slot, index) => {

            // ==================================================
            // HISTORICAL CONSULTATIONS FOR THIS TIME SLOT
            // ==================================================

            const historicalForSlot =
              completedConsultations.filter(
                (consultation) => {

                  if (
                    !consultation.consultationEndTime
                  ) {
                    return false;
                  }

                  const date =
                    new Date(
                      consultation.consultationEndTime
                    );

                  const hour =
                    date.getHours();

                  return (
                    hour >= slot.startHour &&
                    hour < slot.endHour
                  );
                }
              );


            // ==================================================
            // HISTORICAL ACTIVITY
            // ==================================================

            const historicalActivity =
              historicalForSlot.length;


            // ==================================================
            // SLOT AVERAGE CONSULTATION
            // ==================================================

            let slotAverageDuration =
              averageConsultationTime;

            if (
              historicalForSlot.length > 0
            ) {
              const totalSlotDuration =
                historicalForSlot.reduce(
                  (total, consultation) => {
                    return (
                      total +
                      Number(
                        consultation.consultationDuration || 0
                      )
                    );
                  },
                  0
                );

              slotAverageDuration =
                Math.max(
                  1,
                  Math.round(
                    totalSlotDuration /
                      historicalForSlot.length
                  )
                );
            }


            // ==================================================
            // HISTORICAL ACTIVITY SCORE
            // ==================================================

            let activityScore = 2;

            if (
              historicalActivity === 0
            ) {
              activityScore = 0;
            } else if (
              historicalActivity <= 2
            ) {
              activityScore = 1;
            } else if (
              historicalActivity <= 5
            ) {
              activityScore = 3;
            } else if (
              historicalActivity <= 8
            ) {
              activityScore = 5;
            } else {
              activityScore = 7;
            }


            // ==================================================
            // BASELINE FUTURE ACTIVITY
            // ==================================================

            const baselinePrediction =
              totalActivePatients *
              slot.baselineFactor;


            // ==================================================
            // PREDICTED PATIENT COUNT
            // ==================================================

            let predictedPatientCount;

            if (
              historicalSamples >= 5
            ) {
              predictedPatientCount =
                Math.round(
                  (
                    historicalActivity *
                    1.5
                  ) +
                  (
                    baselinePrediction *
                    0.35
                  )
                );
            } else {
              predictedPatientCount =
                Math.round(
                  (
                    baselinePrediction *
                    0.75
                  ) +
                  (
                    historicalActivity *
                    0.75
                  )
                );
            }


            // ==================================================
            // MINIMUM PREDICTION
            // ==================================================

            predictedPatientCount =
              Math.max(
                1,
                predictedPatientCount
              );


            // ==================================================
            // PREDICTED WORKLOAD
            // ==================================================

            const predictedWorkload =
              getWorkload(
                predictedPatientCount
              );


            // ==================================================
            // EXPECTED WAITING TIME
            // ==================================================

            const expectedWaitingTime =
              getWaitingRange(
                predictedPatientCount,
                slotAverageDuration
              );


            // ==================================================
            // INITIAL SCORE
            // Lower score = better
            // ==================================================

            let score =
              predictedPatientCount;


            // ==================================================
            // HISTORICAL ACTIVITY INFLUENCE
            // ==================================================

            score +=
              activityScore;


            // ==================================================
            // CONSULTATION DURATION INFLUENCE
            // ==================================================

            if (
              slotAverageDuration >= 10
            ) {
              score += 3;
            } else if (
              slotAverageDuration >= 7
            ) {
              score += 2;
            } else if (
              slotAverageDuration >= 5
            ) {
              score += 1;
            }


            // ==================================================
            // PREDICTED WORKLOAD INFLUENCE
            // ==================================================

            if (
              predictedWorkload === "High"
            ) {
              score += 5;
            } else if (
              predictedWorkload === "Medium"
            ) {
              score += 2;
            }


            // ==================================================
            // LIVE QUEUE INFLUENCE
            // ==================================================

            if (
              totalActivePatients > 0
            ) {
              score +=
                Math.round(
                  totalActivePatients * 0.5
                );
            }


            // ==================================================
            // CURRENT LIVE SLOT INFLUENCE
            // ==================================================

            if (
              index === currentSlotIndex
            ) {
              score +=
                Math.round(
                  waitingPatients * 0.8
                );

              score +=
                Math.round(
                  patientsInConsultation * 1.5
                );

              score +=
                Math.round(
                  currentConsultationRemaining *
                    0.5
                );
            }


            // ==================================================
            // PATIENT-SPECIFIC QUEUE POSITION
            // ==================================================
            //
            // This makes the recommendation different
            // according to the patient's live queue position.
            //
            // ==================================================

            if (
              hasActiveToken &&
              currentSlotIndex >= 0
            ) {

              // -----------------------------------------------
              // PATIENT IS VERY CLOSE TO TURN
              // -----------------------------------------------

              if (
                patientsAhead <= 2
              ) {
                if (
                  index === currentSlotIndex
                ) {
                  score -= 10;
                }
              }


              // -----------------------------------------------
              // PATIENT HAS MODERATE NUMBER AHEAD
              // -----------------------------------------------

              else if (
                patientsAhead <= 5
              ) {
                if (
                  index === currentSlotIndex
                ) {
                  score -= 5;
                }
              }


              // -----------------------------------------------
              // PATIENT HAS MANY PATIENTS AHEAD
              // -----------------------------------------------

              else {

                if (
                  index === currentSlotIndex
                ) {
                  score += 7;
                }

                if (
                  index > currentSlotIndex
                ) {
                  score -= 3;
                }
              }
            }


            // ==================================================
            // LIVE CURRENT CONSULTATION
            // ==================================================

            if (
              currentConsultationRemaining > 0 &&
              index === currentSlotIndex
            ) {
              score +=
                Math.round(
                  currentConsultationRemaining *
                    0.5
                );
            }


            // ==================================================
            // RETURN SLOT DATA
            // IMPORTANT
            // ==================================================

            return {
              time:
                slot.name,

              startHour:
                slot.startHour,

              endHour:
                slot.endHour,

              historicalActivity,

              predictedPatientCount,

              workload:
                predictedWorkload,

              expectedWaitingTime,

              averageConsultationTime:
                slotAverageDuration,

              score,

              isCurrentSlot:
                index === currentSlotIndex,
            };
          }
        );


      // ======================================================
      // 15. SORT TIME SLOTS
      // ======================================================

      const sortedSlots =
        [...slotAnalysis].sort(
          (a, b) => {

            if (
              a.score !== b.score
            ) {
              return (
                a.score -
                b.score
              );
            }

            return (
              a.predictedPatientCount -
              b.predictedPatientCount
            );
          }
        );


      // ======================================================
      // 16. BEST SLOT
      // ======================================================

      const bestSlot =
        sortedSlots[0];


      // ======================================================
      // 17. PREDICTION CONFIDENCE
      // ======================================================

      let confidence = 50;

      if (
        historicalSamples >= 20
      ) {
        confidence = 90;
      } else if (
        historicalSamples >= 15
      ) {
        confidence = 85;
      } else if (
        historicalSamples >= 10
      ) {
        confidence = 80;
      } else if (
        historicalSamples >= 5
      ) {
        confidence = 70;
      } else if (
        historicalSamples >= 3
      ) {
        confidence = 60;
      }


      // ======================================================
      // LIVE QUEUE IMPROVES CONFIDENCE
      // ======================================================

      if (
        totalActivePatients > 0
      ) {
        confidence =
          Math.min(
            95,
            confidence + 5
          );
      }


      // ======================================================
      // 18. PATIENT-SPECIFIC RECOMMENDATION REASON
      // ======================================================

      let recommendationReason =
        `${bestSlot.time} is predicted to have the lowest combined workload and waiting pressure.`;

      if (
        hasActiveToken
      ) {

        if (
          patientsAhead <= 2
        ) {
          recommendationReason =
            `${bestSlot.time} is recommended because only ${patientsAhead} patient(s) are ahead of you in the live queue.`;

        } else if (
          patientsAhead <= 5
        ) {
          recommendationReason =
            `${bestSlot.time} is recommended based on your current queue position with ${patientsAhead} patient(s) ahead of you.`;

        } else {
          recommendationReason =
            `${bestSlot.time} is recommended because your current queue has ${patientsAhead} patient(s) ahead and the system is considering later lower-pressure periods.`;
        }

      } else if (
        bestSlot.workload === "Low"
      ) {

        recommendationReason =
          `${bestSlot.time} is recommended because it is predicted to have low patient activity and shorter waiting time.`;

      } else if (
        bestSlot.workload === "Medium"
      ) {

        recommendationReason =
          `${bestSlot.time} is the best available period based on predicted activity, workload and consultation duration.`;

      } else {

        recommendationReason =
          `${bestSlot.time} has the lowest combined score among the analyzed periods.`;
      }


      // ======================================================
      // 19. PREDICTION EXPLANATION
      // ======================================================

      const predictionExplanation =
        `The prediction analyzes ${historicalSamples} historical consultation record(s), ${totalActivePatients} active patient(s), ${waitingPatients} waiting patient(s), ${patientsInConsultation} patient(s) in consultation, an average consultation time of ${averageConsultationTime} minute(s), and the patient's live queue position.`;

      // ======================================================
      // 20. FINAL RESPONSE
      // ======================================================

      res.json({

        success: true,

        patientId,

        version:
          "Version 3",

        // ----------------------------------------------------
        // RECOMMENDATION
        // ----------------------------------------------------

        recommendedTime:
          bestSlot.time,

        expectedWorkload:
          bestSlot.workload,

        expectedWaitingTime:
          bestSlot.expectedWaitingTime,

        confidence,

        // ----------------------------------------------------
        // LIVE HOSPITAL DATA
        // ----------------------------------------------------

        currentWorkload,

        totalActivePatients,

        waitingPatients,

        patientsInConsultation,

        // ----------------------------------------------------
        // PATIENT-SPECIFIC LIVE DATA
        // ----------------------------------------------------

        patientsAhead,

        currentConsultationRemaining,

        hasActiveToken,

        // ----------------------------------------------------
        // CONSULTATION DATA
        // ----------------------------------------------------

        averageConsultationTime,

        historicalSamples,

        // ----------------------------------------------------
        // EXPLANATION
        // ----------------------------------------------------

        recommendationReason,

        predictionExplanation,

        // ----------------------------------------------------
        // TIME ANALYSIS
        // ----------------------------------------------------

        timeAnalysis:
          slotAnalysis.map(
            (slot) => ({

              time:
                slot.time,

              workload:
                slot.workload,

              expectedWaitingTime:
                slot.expectedWaitingTime,

              predictedPatientCount:
                slot.predictedPatientCount,

              averageConsultationTime:
                slot.averageConsultationTime,

              historicalActivity:
                slot.historicalActivity,

              isCurrentSlot:
                slot.isCurrentSlot,

            })
          ),

        // ----------------------------------------------------
        // TIMESTAMP
        // ----------------------------------------------------

        generatedAt:
          new Date(),
      });

    } catch (error) {

      console.error(
        "Best Time V3 Error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Server error while calculating Best Time to Visit",

        error:
          error.message,
      });
    }
  }
);


// ============================================================
// EXPORT
// ============================================================

module.exports = router;