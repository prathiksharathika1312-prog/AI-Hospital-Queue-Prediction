const express = require("express");
const router = express.Router();

const QueueToken = require("../models/queueToken");
const Patient = require("../models/patient");

// ============================================================
// PATIENT VISIT READINESS - VERSION 2
// SMART READINESS
// ============================================================

router.get("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    // ========================================================
    // 1. CHECK PATIENT
    // ========================================================

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        version: "Version 2",
        message: "Patient not found",
      });
    }

    // ========================================================
    // 2. FIND ACTIVE TOKEN
    // ========================================================

    const patientToken = await QueueToken.findOne({
      patientId,
      status: {
        $in: ["Waiting", "In Consultation"],
      },
    }).sort({
      createdAt: -1,
    });

    if (!patientToken) {
      return res.status(404).json({
        success: false,
        version: "Version 2",
        patientId,
        message: "No active queue token found",
        readinessStatus: "Not Ready",
        readinessScore: 0,
        recommendation:
          "Please join the queue to prepare for your consultation.",
      });
    }

    // ========================================================
    // 3. GET ACTIVE QUEUE
    // ========================================================

    const activeQueue = await QueueToken.find({
      status: {
        $in: ["Waiting", "In Consultation"],
      },
    }).sort({
      queueNumber: 1,
    });

    // ========================================================
    // 4. PATIENTS AHEAD
    // ========================================================

    const patientsAhead = activeQueue.filter((token) => {
      return (
        token.status === "Waiting" &&
        token.queueNumber < patientToken.queueNumber
      );
    }).length;

    // ========================================================
    // 5. ESTIMATE WAITING TIME
    // ========================================================

    const completedConsultations = await QueueToken.find({
      status: "Completed",
      consultationDuration: {
        $gt: 0,
      },
    }).sort({
      updatedAt: -1,
    });

    let averageConsultationTime = 5;

    if (completedConsultations.length > 0) {
      const totalDuration = completedConsultations.reduce(
        (sum, token) =>
          sum + (token.consultationDuration || 0),
        0
      );

      averageConsultationTime =
        totalDuration / completedConsultations.length;
    }

    // Round average consultation time
    averageConsultationTime =
      Math.round(averageConsultationTime * 10) / 10;

    // Find currently consulting patient
    const currentConsultation = activeQueue.find(
      (token) => token.status === "In Consultation"
    );

    let currentConsultationRemaining = 0;

    if (currentConsultation?.consultationStartTime) {
      const elapsedMinutes =
        (Date.now() -
          new Date(
            currentConsultation.consultationStartTime
          ).getTime()) /
        (1000 * 60);

      currentConsultationRemaining = Math.max(
        0,
        averageConsultationTime - elapsedMinutes
      );
    }

    const estimatedWaitingTime =
      currentConsultationRemaining +
      patientsAhead * averageConsultationTime;

    const roundedWaitingTime =
      Math.max(
        0,
        Math.round(estimatedWaitingTime)
      );

    // ========================================================
    // 6. HOSPITAL WORKLOAD
    // ========================================================

    const totalActivePatients = activeQueue.length;

    const waitingPatients = activeQueue.filter(
      (token) => token.status === "Waiting"
    ).length;

    const patientsInConsultation = activeQueue.filter(
      (token) => token.status === "In Consultation"
    ).length;

    let hospitalWorkload = "Low";

    if (totalActivePatients >= 8) {
      hospitalWorkload = "High";
    } else if (totalActivePatients >= 4) {
      hospitalWorkload = "Medium";
    }

    // ========================================================
    // 7. TURN PROXIMITY
    // ========================================================

    let turnProximity = "Far";

    if (patientToken.status === "In Consultation") {
      turnProximity = "Current";
    } else if (patientsAhead === 0) {
      turnProximity = "Next";
    } else if (patientsAhead <= 2) {
      turnProximity = "Near";
    } else if (patientsAhead <= 5) {
      turnProximity = "Moderate";
    } else {
      turnProximity = "Far";
    }

    // ========================================================
    // 8. SMART READINESS SCORE
    // ========================================================

    let readinessScore = 50;

    // Queue proximity
    if (patientsAhead === 0) {
      readinessScore += 30;
    } else if (patientsAhead <= 2) {
      readinessScore += 20;
    } else if (patientsAhead <= 5) {
      readinessScore += 10;
    } else {
      readinessScore -= 10;
    }

    // Waiting time
    if (roundedWaitingTime <= 10) {
      readinessScore += 15;
    } else if (roundedWaitingTime <= 20) {
      readinessScore += 5;
    } else if (roundedWaitingTime > 40) {
      readinessScore -= 10;
    }

    // Hospital workload
    if (hospitalWorkload === "Low") {
      readinessScore += 5;
    } else if (hospitalWorkload === "High") {
      readinessScore -= 5;
    }

    // Keep score between 0 and 100
    readinessScore = Math.max(
      0,
      Math.min(100, readinessScore)
    );

    // ========================================================
    // 9. SMART READINESS STATUS
    // ========================================================

    let readinessStatus;
    let readinessIcon;
    let recommendation;

    if (patientToken.status === "In Consultation") {
      readinessStatus = "Consultation In Progress";
      readinessIcon = "🟢";
      readinessScore = 100;

      recommendation =
        "Your consultation is currently in progress.";
    } else if (
      patientsAhead <= 1 &&
      roundedWaitingTime <= 10
    ) {
      readinessStatus = "Almost Ready";
      readinessIcon = "🟢";

      recommendation =
        "Your turn is approaching. Please stay near the consultation area.";
    } else if (
      patientsAhead <= 5 &&
      roundedWaitingTime <= 30
    ) {
      readinessStatus = "Get Ready";
      readinessIcon = "🟡";

      recommendation =
        "Your consultation is getting closer. Please remain available.";
    } else {
      readinessStatus = "Not Yet Ready";
      readinessIcon = "🔵";

      recommendation =
        "There is still some waiting time. Continue monitoring your queue.";
    }

    // ========================================================
    // 10. RESPONSE
    // ========================================================

    return res.json({
      success: true,
      version: "Version 2",

      patientId,

      tokenNumber: patientToken.tokenNumber,
      queueNumber: patientToken.queueNumber,
      queueStatus: patientToken.status,

      patientsAhead,

      estimatedWaitingTime:
        roundedWaitingTime,

      averageConsultationTime,

      hospitalWorkload,

      totalActivePatients,
      waitingPatients,
      patientsInConsultation,

      turnProximity,

      readinessStatus,
      readinessScore,
      readinessIcon,

      recommendation,

      checks: {
        activeToken: true,
        inQueue: true,
        notCancelled: true,
        waiting:
          patientToken.status === "Waiting",
      },
    });
  } catch (error) {
    console.error(
      "Patient Visit Readiness V2 Error:",
      error
    );

    return res.status(500).json({
      success: false,
      version: "Version 2",
      message:
        "Failed to calculate smart visit readiness",
      error: error.message,
    });
  }
});

module.exports = router;