const express = require("express");
const router = express.Router();

const QueueToken = require("../models/queueToken");

// ============================================================
// HELPER FUNCTION
// ============================================================

function getLoadLevel(score) {
  if (score <= 30) {
    return "Low";
  } else if (score <= 60) {
    return "Medium";
  } else {
    return "High";
  }
}

// ============================================================
// VERSION 1
// BASIC HOSPITAL LOAD PREDICTION
//
// Uses:
// - Active patients
//
// Low    = 0 - 3
// Medium = 4 - 7
// High   = 8+
// ============================================================

router.get("/v1", async (req, res) => {
  try {
    const activePatients = await QueueToken.countDocuments({
      status: {
        $in: ["Waiting", "In Consultation"]
      }
    });

    let loadLevel;

    if (activePatients <= 3) {
      loadLevel = "Low";
    } else if (activePatients <= 7) {
      loadLevel = "Medium";
    } else {
      loadLevel = "High";
    }

    res.json({
      success: true,
      predictionVersion: "Version 1",
      activePatients,
      loadLevel,
      explanation:
        `Hospital load is ${loadLevel} because there are ` +
        `${activePatients} active patients in the queue.`
    });

  } catch (error) {
    console.error("Hospital Load V1 Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to predict hospital load - Version 1",
      error: error.message
    });
  }
});

// ============================================================
// VERSION 2
// IMPROVED HOSPITAL LOAD PREDICTION
//
// Uses:
// - Active patients
// - Waiting patients
// - Patients currently in consultation
//
// Load score:
// Active patients × 5
// Waiting patients × 2
// Current consultations × 5
// ============================================================

router.get("/v2", async (req, res) => {
  try {

    // --------------------------------------------------------
    // ACTIVE PATIENTS
    // --------------------------------------------------------

    const activePatients =
      await QueueToken.countDocuments({
        status: {
          $in: ["Waiting", "In Consultation"]
        }
      });

    // --------------------------------------------------------
    // WAITING PATIENTS
    // --------------------------------------------------------

    const waitingPatients =
      await QueueToken.countDocuments({
        status: "Waiting"
      });

    // --------------------------------------------------------
    // CURRENT CONSULTATIONS
    // --------------------------------------------------------

    const patientsInConsultation =
      await QueueToken.countDocuments({
        status: "In Consultation"
      });

    // --------------------------------------------------------
    // LOAD SCORE
    // --------------------------------------------------------

    const loadScore =
      (activePatients * 5) +
      (waitingPatients * 2) +
      (patientsInConsultation * 5);

    // --------------------------------------------------------
    // LOAD LEVEL
    // --------------------------------------------------------

    const loadLevel =
      getLoadLevel(loadScore);

    // --------------------------------------------------------
    // EXPLANATION
    // --------------------------------------------------------

    let explanation;

    if (loadLevel === "Low") {

      explanation =
        "Hospital workload is currently LOW based on " +
        "the current queue activity.";

    } else if (loadLevel === "Medium") {

      explanation =
        "Hospital workload is currently MEDIUM because " +
        "there is moderate queue activity.";

    } else {

      explanation =
        "Hospital workload is currently HIGH because " +
        "there are many active patients and significant " +
        "queue activity.";
    }

    // --------------------------------------------------------
    // RESPONSE
    // --------------------------------------------------------

    res.json({

      success: true,

      predictionVersion: "Version 2",

      activePatients,

      waitingPatients,

      patientsInConsultation,

      loadScore,

      loadLevel,

      explanation
    });

  } catch (error) {

    console.error(
      "Hospital Load V2 Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to predict hospital load - Version 2",

      error: error.message
    });
  }
});

// ============================================================
// VERSION 3
// INTELLIGENT HOSPITAL LOAD PREDICTION
//
// Uses:
// - Active patients
// - Waiting patients
// - Patients in consultation
// - Completed consultation history
// - Average consultation duration
//
// Returns:
// - Load level
// - Load score
// - Confidence
// - Historical samples
// - Explanation
// ============================================================

router.get("/v3", async (req, res) => {
  try {

    // ========================================================
    // 1. ACTIVE PATIENTS
    // ========================================================

    const activePatients =
      await QueueToken.countDocuments({
        status: {
          $in: ["Waiting", "In Consultation"]
        }
      });

    // ========================================================
    // 2. WAITING PATIENTS
    // ========================================================

    const waitingPatients =
      await QueueToken.countDocuments({
        status: "Waiting"
      });

    // ========================================================
    // 3. CURRENT CONSULTATIONS
    // ========================================================

    const patientsInConsultation =
      await QueueToken.countDocuments({
        status: "In Consultation"
      });

    // ========================================================
    // 4. COMPLETED CONSULTATIONS
    // ========================================================

    const completedConsultations =
      await QueueToken.find({
        status: "Completed",
        consultationDuration: {
          $ne: null
        }
      }).select("consultationDuration");

    // ========================================================
    // 5. AVERAGE CONSULTATION TIME
    // ========================================================

    let averageConsultationTime = 5;

    if (completedConsultations.length > 0) {

      const totalDuration =
        completedConsultations.reduce(
          (total, consultation) => {

            return (
              total +
              (Number(
                consultation.consultationDuration
              ) || 0)
            );

          },
          0
        );

      averageConsultationTime =
        totalDuration /
        completedConsultations.length;

      averageConsultationTime =
        Math.round(
          averageConsultationTime * 10
        ) / 10;
    }

    // ========================================================
    // 6. HISTORICAL SAMPLES
    // ========================================================

    const historicalSamples =
      completedConsultations.length;

    // ========================================================
    // 7. INTELLIGENT LOAD SCORE
    // ========================================================

    let loadScore = 0;

    // Active patients
    loadScore +=
      activePatients * 5;

    // Waiting patients
    loadScore +=
      waitingPatients * 3;

    // Current consultations
    loadScore +=
      patientsInConsultation * 7;

    // Longer consultations increase workload
    if (averageConsultationTime > 10) {

      loadScore += 10;

    } else if (averageConsultationTime > 7) {

      loadScore += 5;
    }

    // Maximum score = 100
    loadScore =
      Math.min(
        Math.round(loadScore),
        100
      );

    // ========================================================
    // 8. LOAD LEVEL
    // ========================================================

    let loadLevel;

    if (loadScore <= 30) {

      loadLevel = "Low";

    } else if (loadScore <= 60) {

      loadLevel = "Medium";

    } else {

      loadLevel = "High";
    }

    // ========================================================
    // 9. CONFIDENCE
    // ========================================================

    let confidence;

    if (historicalSamples >= 20) {

      confidence = 95;

    } else if (historicalSamples >= 10) {

      confidence = 90;

    } else if (historicalSamples >= 5) {

      confidence = 85;

    } else if (historicalSamples >= 2) {

      confidence = 75;

    } else {

      confidence = 65;
    }

    // ========================================================
    // 10. PREDICTION EXPLANATION
    // ========================================================

    let predictionExplanation;

    if (loadLevel === "Low") {

      predictionExplanation =
        "Hospital workload is predicted to be LOW. " +
        "Current queue activity and consultation workload " +
        "are relatively low.";

    } else if (loadLevel === "Medium") {

      predictionExplanation =
        "Hospital workload is predicted to be MEDIUM. " +
        "The current queue and consultation activity " +
        "show a moderate workload.";

    } else {

      predictionExplanation =
        "Hospital workload is predicted to be HIGH. " +
        "The current queue, waiting patients, and " +
        "consultation activity indicate increased workload.";
    }

    // ========================================================
    // 11. RESPONSE
    // ========================================================

    res.json({

      success: true,

      predictionVersion: "Version 3",

      loadLevel,

      loadScore,

      confidence,

      activePatients,

      waitingPatients,

      patientsInConsultation,

      averageConsultationTime,

      historicalSamples,

      predictionExplanation,

      factors: {

        queueActivity:
          activePatients,

        waitingQueue:
          waitingPatients,

        currentConsultations:
          patientsInConsultation,

        consultationDuration:
          averageConsultationTime
      }

    });

  } catch (error) {

    console.error(
      "Hospital Load V3 Error:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        "Failed to predict hospital load - Version 3",

      error: error.message
    });
  }
});

// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;