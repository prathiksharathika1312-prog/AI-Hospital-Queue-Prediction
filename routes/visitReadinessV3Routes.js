const express = require("express");
const router = express.Router();

const QueueToken = require("../models/queueToken");
const Patient = require("../models/patient");

// ============================================================
// PATIENT VISIT READINESS - VERSION 3
// AI-POWERED READINESS
// ============================================================

router.get("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    // ============================================================
    // 1. CHECK PATIENT
    // ============================================================

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        version: "Version 3",
        message: "Patient not found",
        readinessStatus: "Not Ready",
        readinessScore: 0,
      });
    }

    // ============================================================
    // 2. FIND PATIENT'S ACTIVE TOKEN
    // ============================================================

    const patientToken = await QueueToken.findOne({
      patientId,
      status: { $in: ["Waiting", "In Consultation"] },
    }).sort({ createdAt: -1 });

    if (!patientToken) {
      return res.status(404).json({
        success: false,
        version: "Version 3",
        patientId,
        message: "No active queue token found",
        readinessStatus: "Not Ready",
        readinessScore: 0,
        recommendation:
          "Please join the queue before checking visit readiness.",
      });
    }

    // ============================================================
    // 3. GET ACTIVE QUEUE
    // ============================================================

    const activeQueue = await QueueToken.find({
      status: { $in: ["Waiting", "In Consultation"] },
    }).sort({ queueNumber: 1 });

    // ============================================================
    // 4. QUEUE ANALYSIS
    // ============================================================

    const patientsAhead = activeQueue.filter((token) => {
      return (
        token.status === "Waiting" &&
        token.queueNumber < patientToken.queueNumber
      );
    }).length;

    const totalActivePatients = activeQueue.length;

    const waitingPatients = activeQueue.filter(
      (token) => token.status === "Waiting"
    ).length;

    const patientsInConsultation = activeQueue.filter(
      (token) => token.status === "In Consultation"
    ).length;

    // ============================================================
    // 5. HISTORICAL CONSULTATION ANALYSIS
    // ============================================================

    const completedConsultations = await QueueToken.find({
      status: "Completed",
      consultationDuration: { $gt: 0 },
    }).sort({ updatedAt: -1 });

    let averageConsultationTime = 5;

    if (completedConsultations.length > 0) {
      const totalDuration = completedConsultations.reduce(
        (sum, token) => {
          return sum + (token.consultationDuration || 0);
        },
        0
      );

      averageConsultationTime =
        totalDuration / completedConsultations.length;
    }

    averageConsultationTime =
      Math.round(averageConsultationTime * 10) / 10;

    const historicalSamples = completedConsultations.length;

    // ============================================================
    // 6. CURRENT CONSULTATION ANALYSIS
    // ============================================================

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

    currentConsultationRemaining =
      Math.round(currentConsultationRemaining * 10) / 10;

    // ============================================================
    // 7. AI WAITING TIME PREDICTION
    // ============================================================

    const estimatedWaitingTime =
      currentConsultationRemaining +
      patientsAhead * averageConsultationTime;

    const predictedWaitingTime = Math.max(
      0,
      Math.round(estimatedWaitingTime)
    );

    // ============================================================
    // 8. HOSPITAL WORKLOAD
    // ============================================================

    let hospitalWorkload = "Low";

    if (totalActivePatients >= 8) {
      hospitalWorkload = "High";
    } else if (totalActivePatients >= 4) {
      hospitalWorkload = "Medium";
    }

    // ============================================================
    // 9. TURN PROXIMITY
    // ============================================================

    let turnProximity = "Far";

    if (patientToken.status === "In Consultation") {
      turnProximity = "Current";
    } else if (patientsAhead === 0) {
      turnProximity = "Next";
    } else if (patientsAhead <= 2) {
      turnProximity = "Near";
    } else if (patientsAhead <= 5) {
      turnProximity = "Moderate";
    }

    // ============================================================
    // 10. AI READINESS SCORE
    // ============================================================

    let readinessScore = 50;

    // Queue position factor
    if (patientsAhead === 0) {
      readinessScore += 30;
    } else if (patientsAhead <= 2) {
      readinessScore += 20;
    } else if (patientsAhead <= 5) {
      readinessScore += 10;
    } else {
      readinessScore -= 10;
    }

    // Waiting time factor
    if (predictedWaitingTime <= 10) {
      readinessScore += 15;
    } else if (predictedWaitingTime <= 20) {
      readinessScore += 5;
    } else if (predictedWaitingTime > 40) {
      readinessScore -= 10;
    }

    // Workload factor
    if (hospitalWorkload === "Low") {
      readinessScore += 5;
    } else if (hospitalWorkload === "High") {
      readinessScore -= 5;
    }

    // Historical data confidence factor
    if (historicalSamples >= 5) {
      readinessScore += 5;
    } else if (historicalSamples === 0) {
      readinessScore -= 5;
    }

    // Keep score between 0 and 100
    readinessScore = Math.max(
      0,
      Math.min(100, readinessScore)
    );

    // ============================================================
    // 11. AI CONFIDENCE
    // ============================================================

    let confidence = 60;

    if (historicalSamples >= 10) {
      confidence = 90;
    } else if (historicalSamples >= 5) {
      confidence = 80;
    } else if (historicalSamples >= 3) {
      confidence = 75;
    } else if (historicalSamples >= 1) {
      confidence = 65;
    }

    if (totalActivePatients >= 5) {
      confidence += 5;
    }

    confidence = Math.min(95, confidence);

    // ============================================================
    // 12. AI READINESS STATUS
    // ============================================================

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
      predictedWaitingTime <= 10
    ) {
      readinessStatus = "Almost Ready";
      readinessIcon = "🟢";

      recommendation =
        "Your turn is approaching. Please stay near the consultation area.";
    } else if (
      patientsAhead <= 5 &&
      predictedWaitingTime <= 30
    ) {
      readinessStatus = "Get Ready";
      readinessIcon = "🟡";

      recommendation =
        "Your consultation is getting closer. Please remain available.";
    } else {
      readinessStatus = "Not Yet Ready";
      readinessIcon = "🔵";

      recommendation =
        "There is still some waiting time. You can continue your normal activities but monitor your queue.";
    }

    // ============================================================
    // 13. AI EXPLANATION
    // ============================================================

    let predictionExplanation =
      "Prediction is based on current queue activity and historical consultation data.";

    if (historicalSamples >= 5) {
      predictionExplanation =
        "AI prediction uses current queue activity, historical consultation times, hospital workload, and recent consultation patterns.";
    } else if (historicalSamples > 0) {
      predictionExplanation =
        "AI prediction uses available consultation history together with current queue activity and hospital workload.";
    } else {
      predictionExplanation =
        "Limited historical data is available. Prediction currently relies mainly on the live queue.";
    }

    // ============================================================
    // 14. PERSONALIZED PREPARATION
    // ============================================================

    let preparationAdvice;

    if (predictedWaitingTime <= 10) {
      preparationAdvice =
        "Your turn is close. Keep your patient information and previous consultation details ready.";
    } else if (predictedWaitingTime <= 30) {
      preparationAdvice =
        "Your consultation is approaching. Stay available and keep your important medical information ready.";
    } else {
      preparationAdvice =
        "You have some waiting time. Continue monitoring your queue and prepare your consultation information.";
    }

    // ============================================================
    // 15. FINAL RESPONSE
    // ============================================================

    return res.json({
      success: true,
      version: "Version 3",

      patientId,

      tokenNumber: patientToken.tokenNumber,
      queueNumber: patientToken.queueNumber,
      queueStatus: patientToken.status,

      patientsAhead,

      predictedWaitingTime,
      currentConsultationRemaining,

      averageConsultationTime,
      historicalSamples,

      hospitalWorkload,

      totalActivePatients,
      waitingPatients,
      patientsInConsultation,

      turnProximity,

      readinessStatus,
      readinessScore,
      readinessIcon,

      confidence,

      recommendation,
      preparationAdvice,
      predictionExplanation,

      aiFactors: {
        liveQueueActivity: true,
        historicalConsultationData:
          historicalSamples > 0,
        hospitalWorkloadAnalysis: true,
        waitingTimePrediction: true,
        turnProximityAnalysis: true,
      },

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
      "Patient Visit Readiness V3 Error:",
      error
    );

    return res.status(500).json({
      success: false,
      version: "Version 3",
      message:
        "Failed to calculate AI patient visit readiness.",
      error: error.message,
    });
  }
});

module.exports = router;