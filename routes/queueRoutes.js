const express = require("express");

const router = express.Router();

const QueueToken = require("../models/queueToken");
const Patient = require("../models/patient");

// ============================================================
// JOIN QUEUE
// ============================================================

router.post("/join", async (req, res) => {
  try {
    console.log("Join queue request received");

    const { patientId } = req.body;

    if (!patientId) {
      return res.status(400).json({
        message: "Patient ID is required"
      });
    }

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    // Check whether patient already has an active token
    const existingToken = await QueueToken.findOne({
      patientId,
      status: {
        $in: ["Waiting", "In Consultation"]
      }
    });

    if (existingToken) {
      return res.status(400).json({
        message: "Patient already has an active queue token",
        token: existingToken
      });
    }

    // Find latest queue number
    const lastToken = await QueueToken.findOne()
      .sort({ queueNumber: -1 });

    const nextQueueNumber = lastToken
      ? lastToken.queueNumber + 1
      : 1;

    // Generate token
    const tokenNumber =
      `A${String(nextQueueNumber).padStart(3, "0")}`;

    const newToken = new QueueToken({
      patientId,
      tokenNumber,
      queueNumber: nextQueueNumber,
      status: "Waiting"
    });

    await newToken.save();

    console.log("New queue token:", newToken);

    res.status(201).json({
      message: "Successfully joined queue",
      token: newToken
    });

  } catch (error) {

    console.error(
      "Join Queue Error:",
      error
    );

    res.status(500).json({
      message: "Server error while joining queue",
      error: error.message
    });

  }
});

// ============================================================
// GET ACTIVE TOKEN FOR PATIENT
// ============================================================

router.get("/patient/:patientId", async (req, res) => {

  try {

    const { patientId } = req.params;

    const token = await QueueToken.findOne({
      patientId,
      status: {
        $in: ["Waiting", "In Consultation"]
      }
    }).sort({
      createdAt: -1
    });

    if (!token) {

      return res.status(404).json({
        message: "No active queue token found"
      });

    }

    res.json(token);

  } catch (error) {

    console.error(
      "Get Patient Queue Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

});

// ============================================================
// CANCEL TOKEN
// ============================================================

router.put("/cancel/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const token =
      await QueueToken.findById(id);

    if (!token) {

      return res.status(404).json({
        message: "Queue token not found"
      });

    }

    if (
      token.status === "Completed" ||
      token.status === "Cancelled"
    ) {

      return res.status(400).json({
        message: "This token cannot be cancelled"
      });

    }

    token.status = "Cancelled";

    await token.save();

    res.json({
      message:
        "Queue token cancelled successfully",
      token
    });

  } catch (error) {

    console.error(
      "Cancel Token Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

});

// ============================================================
// GET ACTIVE QUEUE
// ============================================================

router.get("/active", async (req, res) => {

  try {

    const activeTokens =
      await QueueToken.find({
        status: {
          $in: ["Waiting", "In Consultation"]
        }
      })
        .populate(
          "patientId",
          "name age phone disease"
        )
        .sort({
          queueNumber: 1
        });

    res.json(activeTokens);

  } catch (error) {

    console.error(
      "Get Active Queue Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

});

// ============================================================
// DOCTOR START CONSULTATION
// ============================================================

router.put("/start/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const token =
      await QueueToken.findById(id);

    if (!token) {

      return res.status(404).json({
        message: "Queue token not found"
      });

    }

    if (token.status !== "Waiting") {

      return res.status(400).json({
        message:
          "Only waiting patients can start consultation"
      });

    }

    token.status = "In Consultation";

    token.consultationStartTime =
      new Date();

    await token.save();

    res.json({
      message: "Consultation started",
      token
    });

  } catch (error) {

    console.error(
      "Start Consultation Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

});

// ============================================================
// DOCTOR COMPLETE CONSULTATION
// ============================================================

router.put("/complete/:id", async (req, res) => {

  try {

    const { id } = req.params;

    const token =
      await QueueToken.findById(id);

    if (!token) {

      return res.status(404).json({
        message: "Queue token not found"
      });

    }

    if (
      token.status !== "In Consultation"
    ) {

      return res.status(400).json({
        message:
          "Consultation must be in progress before completing"
      });

    }

    const endTime = new Date();

    token.consultationEndTime =
      endTime;

    if (token.consultationStartTime) {

      const durationMilliseconds =
        endTime.getTime() -
        token.consultationStartTime.getTime();

      const durationMinutes =
        durationMilliseconds /
        (1000 * 60);

      token.consultationDuration =
        Math.max(
          1,
          Math.round(durationMinutes)
        );

    }

    token.status = "Completed";

    await token.save();

    res.json({
      message:
        "Consultation completed",
      token
    });

  } catch (error) {

    console.error(
      "Complete Consultation Error:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message
    });

  }

});

// ============================================================
// WAITING TIME - VERSION 3
// ============================================================
//
// Uses:
//
// 1. Patients ahead
// 2. Historical consultation durations
// 3. Current consultation remaining time
// 4. Dynamic average consultation time
// 5. Queue load adjustment
// 6. Safety buffer
// 7. Prediction confidence
//
// ============================================================

router.get(
  "/waiting-time/:patientId",
  async (req, res) => {

    try {

      const { patientId } =
        req.params;

      console.log(
        "Version 3 waiting-time request:",
        patientId
      );

      // ======================================================
      // FIND PATIENT ACTIVE TOKEN
      // ======================================================

      const patientToken =
        await QueueToken.findOne({
          patientId,
          status: {
            $in: [
              "Waiting",
              "In Consultation"
            ]
          }
        }).sort({
          createdAt: -1
        });

      if (!patientToken) {

        return res.status(404).json({
          message:
            "No active queue token found"
        });

      }

      // ======================================================
      // GET ACTIVE QUEUE
      // ======================================================

      const activeQueue =
        await QueueToken.find({
          status: {
            $in: [
              "Waiting",
              "In Consultation"
            ]
          }
        }).sort({
          queueNumber: 1
        });

      // ======================================================
      // PATIENTS AHEAD
      // ======================================================

      const patientsAhead =
        activeQueue.filter((token) => {

          return (
            token.queueNumber <
            patientToken.queueNumber
          );

        });

      // ======================================================
      // CURRENT CONSULTATION
      // ======================================================

      const currentConsultation =
        activeQueue.find(
          (token) =>
            token.status ===
            "In Consultation"
        );

      // ======================================================
      // HISTORICAL CONSULTATIONS
      // ======================================================

      const completedConsultations =
        await QueueToken.find({
          status: "Completed",
          consultationDuration: {
            $gt: 0
          }
        })
          .sort({
            consultationEndTime: -1
          })
          .limit(20);

      // ======================================================
      // AVERAGE CONSULTATION TIME
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
                  consultation.consultationDuration ||
                  0
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
      averageConsultationTime * 10
    ) / 10
  );

      // ======================================================
      // CURRENT CONSULTATION REMAINING
      // ======================================================

      let currentConsultationRemaining = 0;

      if (
        currentConsultation &&
        currentConsultation.consultationStartTime
      ) {

        const elapsedMilliseconds =
          new Date().getTime() -
          new Date(
            currentConsultation.consultationStartTime
          ).getTime();

        const elapsedMinutes =
          elapsedMilliseconds /
          (1000 * 60);

        currentConsultationRemaining =
  Math.max(
    0,
    averageConsultationTime -
    elapsedMinutes
  );

      }

      // ======================================================
      // WAITING PATIENTS AHEAD
      // ======================================================

      const waitingPatientsAhead =
        patientsAhead.filter(
          (token) =>
            token.status === "Waiting"
        ).length;
        // ======================================================
// TOTAL ACTIVE WAITING PATIENTS
// ======================================================

const totalActivePatients =
  activeQueue.filter(
    (token) =>
      token.status === "Waiting"
  ).length;

      // ======================================================
      // BASE WAITING TIME
      // ======================================================

      let baseWaitingTime =
        waitingPatientsAhead *
        averageConsultationTime;

      // ======================================================
      // CURRENT CONSULTATION REMAINING
      // ======================================================

      if (
        currentConsultation &&
        patientToken.status !==
          "In Consultation"
      ) {

        baseWaitingTime +=
          currentConsultationRemaining;

      }

      // ======================================================
// FINAL WAITING TIME
// ======================================================

let estimatedWaitingTime = 0;

if (patientToken.status === "In Consultation") {

  estimatedWaitingTime = 0;

} else {

  estimatedWaitingTime =
    baseWaitingTime;

}

estimatedWaitingTime = Math.max(
  0,
  Math.round(estimatedWaitingTime)
);

  // ======================================================
      // CONFIDENCE
  // ======================================================

      let confidence = "Low";

      if (
        completedConsultations.length >= 10
      ) {

        confidence = "High";

      } else if (
        completedConsultations.length >= 5
      ) {

        confidence = "Medium";

      }

      // ======================================================
      // EXPLANATION
      // ======================================================

      let predictionExplanation =
        "Prediction is based on your queue position.";

      if (
        completedConsultations.length > 0
      ) {

        predictionExplanation =
          "Prediction uses recent completed consultation times and your current queue.";

      }

      // ======================================================
      // RESPONSE
      // ======================================================

      res.json({

        success: true,

        patientId,

        tokenNumber:
          patientToken.tokenNumber,

        queueNumber:
          patientToken.queueNumber,

        queuePosition:
          patientToken.queueNumber,

        patientsAhead:
          waitingPatientsAhead,

        status:
          patientToken.status,

        averageConsultationTime,

        currentConsultationRemaining,

        baseWaitingTime,

        estimatedWaitingTime,
        confidence,

        historicalSamples:
          completedConsultations.length,

        totalActivePatients,

        predictionExplanation,

        predictionVersion:
          "Version 3"

      });

    } catch (error) {

      console.error(
        "Version 3 Waiting Time Prediction Error:",
        error
      );

      res.status(500).json({

        message:
          "Server error while calculating Version 3 waiting time",

        error:
          error.message

      });

    }

  }
);
// ============================================================
// SMART QUEUE TURN ALERT - VERSION 1
// ============================================================

router.get("/turn-alert/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    const patientToken = await QueueToken.findOne({
      patientId,
      status: { $in: ["Waiting", "In Consultation"] },
    });

    if (!patientToken) {
      return res.status(404).json({
        success: false,
        message: "No active queue token found",
      });
    }

    const activeQueue = await QueueToken.find({
      status: { $in: ["Waiting", "In Consultation"] },
    }).sort({ queueNumber: 1 });

    const waitingPatientsAhead = activeQueue.filter(
      (token) =>
        token.status === "Waiting" &&
        token.queueNumber < patientToken.queueNumber
    ).length;

    const currentConsultation =
      activeQueue.find(
        (token) => token.status === "In Consultation"
      ) || null;

    let alertLevel;
    let alertMessage;
    let alertIcon;

    if (patientToken.status === "In Consultation") {
      alertLevel = "Your Turn";
      alertMessage = "Your consultation is in progress.";
      alertIcon = "🟢";
    } else if (waitingPatientsAhead === 0) {
      alertLevel = "Your Turn";
      alertMessage =
        "Your turn is next. Please be ready for consultation.";
      alertIcon = "🟢";
    } else if (waitingPatientsAhead <= 2) {
      alertLevel = "Get Ready";
      alertMessage = "Your turn is getting very close.";
      alertIcon = "🟠";
    } else if (waitingPatientsAhead <= 4) {
      alertLevel = "Getting Closer";
      alertMessage = "Your turn is getting closer.";
      alertIcon = "🟡";
    } else {
      alertLevel = "Waiting";
      alertMessage =
        "Please wait. Your turn is not yet close.";
      alertIcon = "🔵";
    }

    return res.json({
      success: true,
      version: "Version 1",
      patientId,
      tokenNumber: patientToken.tokenNumber,
      queueNumber: patientToken.queueNumber,
      patientsAhead: waitingPatientsAhead,
      status: patientToken.status,
      currentConsultation: currentConsultation
        ? currentConsultation.tokenNumber
        : null,
      alertLevel,
      alertMessage,
      alertIcon,
    });
  } catch (error) {
    console.error(
      "Smart Queue Turn Alert V1 Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to calculate smart queue turn alert",
      error: error.message,
    });
  }
});
// ============================================================
// SMART QUEUE TURN ALERT - VERSION 2
// ============================================================

router.get("/turn-alert-v2/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    // --------------------------------------------------------
    // 1. FIND PATIENT'S ACTIVE TOKEN
    // --------------------------------------------------------

    const patientToken = await QueueToken.findOne({
      patientId,
      status: { $in: ["Waiting", "In Consultation"] },
    });

    if (!patientToken) {
      return res.status(404).json({
        success: false,
        message: "No active queue token found",
      });
    }

    // --------------------------------------------------------
    // 2. GET ACTIVE QUEUE
    // --------------------------------------------------------

    const activeQueue = await QueueToken.find({
      status: { $in: ["Waiting", "In Consultation"] },
    }).sort({ queueNumber: 1 });

    // --------------------------------------------------------
    // 3. COUNT PATIENTS AHEAD
    // --------------------------------------------------------

    const waitingPatientsAhead = activeQueue.filter(
      (token) =>
        token.status === "Waiting" &&
        token.queueNumber < patientToken.queueNumber
    ).length;

    // --------------------------------------------------------
    // 4. FIND CURRENT CONSULTATION
    // --------------------------------------------------------

    const currentConsultation =
      activeQueue.find(
        (token) => token.status === "In Consultation"
      ) || null;

    // --------------------------------------------------------
    // 5. CALCULATE AVERAGE CONSULTATION TIME
    // --------------------------------------------------------

    const completedConsultations = await QueueToken.find({
      status: "Completed",
      consultationDuration: { $gt: 0 },
    });

    let averageConsultationTime = 5;

    if (completedConsultations.length > 0) {
      const totalDuration = completedConsultations.reduce(
        (sum, consultation) =>
          sum + consultation.consultationDuration,
        0
      );

      averageConsultationTime =
        totalDuration / completedConsultations.length;
    }

    averageConsultationTime = Math.round(
      averageConsultationTime * 10
    ) / 10;

    // --------------------------------------------------------
    // 6. ESTIMATE WAITING TIME
    // --------------------------------------------------------

    let currentConsultationRemaining = 0;

if (
  currentConsultation &&
  currentConsultation.consultationStartTime
) {
  const elapsedMinutes =
    (Date.now() -
      new Date(
        currentConsultation.consultationStartTime
      ).getTime()) /
    (1000 * 60);

  currentConsultationRemaining =
    Math.max(
      0,
      averageConsultationTime -
      elapsedMinutes
    );
}

let estimatedWaitingTime =
  waitingPatientsAhead *
  averageConsultationTime;

if (currentConsultation) {
  estimatedWaitingTime +=
    currentConsultationRemaining;
}

estimatedWaitingTime = Math.round(
  estimatedWaitingTime
);
    // --------------------------------------------------------
    // 7. DETERMINE ALERT
    // --------------------------------------------------------

    let alertLevel;
    let alertMessage;
    let alertIcon;

    if (patientToken.status === "In Consultation") {
      alertLevel = "Your Turn";
      alertMessage =
        "Your consultation is currently in progress.";
      alertIcon = "🟢";
    } else if (waitingPatientsAhead === 0) {
      alertLevel = "Your Turn";
      alertMessage =
        "Your turn is next. Please be ready.";
      alertIcon = "🟢";
    } else if (estimatedWaitingTime <= 10) {
      alertLevel = "Get Ready";
      alertMessage =
        "Your consultation turn is very close.";
      alertIcon = "🟠";
    } else if (estimatedWaitingTime <= 20) {
      alertLevel = "Getting Closer";
      alertMessage =
        "Your consultation turn is getting closer.";
      alertIcon = "🟡";
    } else {
      alertLevel = "Waiting";
      alertMessage =
        "Please wait. Your consultation turn is not yet close.";
      alertIcon = "🔵";
    }

    // --------------------------------------------------------
    // 8. SEND RESPONSE
    // --------------------------------------------------------

    return res.json({
      success: true,
      version: "Version 2",

      patientId,

      tokenNumber: patientToken.tokenNumber,

      queueNumber: patientToken.queueNumber,

      patientsAhead: waitingPatientsAhead,

      status: patientToken.status,

      currentConsultation: currentConsultation
        ? currentConsultation.tokenNumber
        : null,

      averageConsultationTime,

      estimatedWaitingTime,

      alertLevel,

      alertMessage,

      alertIcon,
    });
  } catch (error) {
    console.error(
      "Smart Queue Turn Alert V2 Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to calculate Smart Queue Turn Alert V2",
      error: error.message,
    });
  }
});
// ============================================================
// SMART QUEUE TURN ALERT - VERSION 3
// AI INTELLIGENT QUEUE ALERT
// ============================================================

router.get("/turn-alert-v3/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    // --------------------------------------------------------
    // 1. FIND PATIENT'S ACTIVE TOKEN
    // --------------------------------------------------------

    const patientToken = await QueueToken.findOne({
      patientId,
      status: {
        $in: ["Waiting", "In Consultation"],
      },
    });

    if (!patientToken) {
      return res.status(404).json({
        success: false,
        message: "No active queue token found",
      });
    }

    // --------------------------------------------------------
    // 2. GET ACTIVE QUEUE
    // --------------------------------------------------------

    const activeQueue = await QueueToken.find({
      status: {
        $in: ["Waiting", "In Consultation"],
      },
    }).sort({
      queueNumber: 1,
    });

    // --------------------------------------------------------
    // 3. COUNT PATIENTS AHEAD
    // --------------------------------------------------------

    const patientsAhead = activeQueue.filter(
      (token) =>
        token.status === "Waiting" &&
        token.queueNumber < patientToken.queueNumber
    ).length;

    // --------------------------------------------------------
    // 4. FIND CURRENT CONSULTATION
    // --------------------------------------------------------

    const currentConsultation =
      activeQueue.find(
        (token) =>
          token.status === "In Consultation"
      ) || null;

    // --------------------------------------------------------
    // 5. GET COMPLETED CONSULTATIONS
    // --------------------------------------------------------

    const completedConsultations =
      await QueueToken.find({
        status: "Completed",
        consultationDuration: {
          $gt: 0,
        },
      });

    // --------------------------------------------------------
    // 6. CALCULATE AVERAGE CONSULTATION TIME
    // --------------------------------------------------------

    let averageConsultationTime = 5;

    if (completedConsultations.length > 0) {
      const totalDuration =
        completedConsultations.reduce(
          (sum, consultation) =>
            sum +
            consultation.consultationDuration,
          0
        );

      averageConsultationTime =
        totalDuration /
        completedConsultations.length;
    }

    averageConsultationTime =
      Math.round(
        averageConsultationTime * 10
      ) / 10;

    // --------------------------------------------------------
    // 7. ESTIMATE WAITING TIME
    // --------------------------------------------------------
    let currentConsultationRemaining = 0;

if (
  currentConsultation &&
  currentConsultation.consultationStartTime
) {
  const elapsedMinutes =
    (Date.now() -
      new Date(
        currentConsultation.consultationStartTime
      ).getTime()) /
    (1000 * 60);

  currentConsultationRemaining =
    Math.max(
      0,
      averageConsultationTime -
      elapsedMinutes
    );
}

let estimatedWaitingTime =
  patientsAhead *
  averageConsultationTime;

if (currentConsultation) {
  estimatedWaitingTime +=
    currentConsultationRemaining;
}

estimatedWaitingTime =
  Math.round(
    estimatedWaitingTime
  );
    
    // --------------------------------------------------------
    // 8. CALCULATE HOSPITAL LOAD
    // --------------------------------------------------------

    const activePatients =
      activeQueue.length;

    let hospitalLoad;

    if (activePatients <= 3) {
      hospitalLoad = "Low";
    } else if (activePatients <= 7) {
      hospitalLoad = "Medium";
    } else {
      hospitalLoad = "High";
    }

    // --------------------------------------------------------
    // 9. CALCULATE PREDICTION CONFIDENCE
    // --------------------------------------------------------

    let confidence = 70;

    if (
      completedConsultations.length >= 5
    ) {
      confidence = 90;
    } else if (
      completedConsultations.length >= 3
    ) {
      confidence = 82;
    } else if (
      completedConsultations.length >= 1
    ) {
      confidence = 75;
    }

    // --------------------------------------------------------
    // 10. AI ALERT DECISION
    // --------------------------------------------------------

    let alertLevel;
    let alertMessage;
    let alertIcon;
    let recommendation;

    if (
      patientToken.status ===
      "In Consultation"
    ) {
      alertLevel = "Your Turn";
      alertIcon = "🟢";

      alertMessage =
        "Your consultation is currently in progress.";

      recommendation =
        "Please continue with your consultation.";
    } else if (
      patientsAhead === 0
    ) {
      alertLevel = "Your Turn";
      alertIcon = "🟢";

      alertMessage =
        "Your turn is next. Please be ready.";

      recommendation =
        "Please remain ready for consultation.";
    } else if (
      estimatedWaitingTime <= 10
    ) {
      alertLevel = "Get Ready";
      alertIcon = "🟠";

      alertMessage =
        "Your consultation turn is expected soon.";

      recommendation =
        "Please stay near the consultation area.";
    } else if (
      estimatedWaitingTime <= 20
    ) {
      alertLevel = "Getting Closer";
      alertIcon = "🟡";

      alertMessage =
        "Your consultation turn is getting closer.";

      recommendation =
        "Please remain available and monitor your queue.";
    } else {
      alertLevel = "Waiting";
      alertIcon = "🔵";

      alertMessage =
        "Your consultation turn is not yet close.";

      recommendation =
        "You can continue waiting comfortably.";
    }

    // --------------------------------------------------------
    // 11. AI EXPLANATION
    // --------------------------------------------------------

    let predictionExplanation;

    if (patientsAhead === 0) {
      predictionExplanation =
        "Your token is next in the active queue.";
    } else if (
      currentConsultation
    ) {
      predictionExplanation =
        `${patientsAhead} patient(s) are ahead of you and one patient is currently in consultation.`;
    } else {
      predictionExplanation =
        `${patientsAhead} patient(s) are ahead of you based on the current queue.`;
    }

    // --------------------------------------------------------
    // 12. RETURN V3 RESPONSE
    // --------------------------------------------------------

    return res.json({
      success: true,

      version: "Version 3",

      predictionType:
        "AI Intelligent Queue Alert",

      patientId,

      tokenNumber:
        patientToken.tokenNumber,

      queueNumber:
        patientToken.queueNumber,

      patientsAhead,

      status:
        patientToken.status,

      currentConsultation:
        currentConsultation
          ? currentConsultation.tokenNumber
          : null,

      averageConsultationTime,

      estimatedWaitingTime,

      hospitalLoad,

      activePatients,

      historicalSamples:
        completedConsultations.length,

      confidence,

      alertLevel,

      alertMessage,

      alertIcon,

      recommendation,

      predictionExplanation,
    });
  } catch (error) {
    console.error(
      "Smart Queue Turn Alert V3 Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to calculate Smart Queue Turn Alert V3",
      error: error.message,
    });
  }
});
// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;