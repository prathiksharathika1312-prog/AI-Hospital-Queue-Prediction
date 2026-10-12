const express = require("express");
const router = express.Router();

const Patient = require("../models/patient");
const QueueToken = require("../models/queueToken");

// ============================================================
// PATIENT VISIT READINESS - VERSION 1
// Basic readiness check
// ============================================================

router.get("/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    // --------------------------------------------------------
    // 1. Check whether patient exists
    // --------------------------------------------------------

    const patient = await Patient.findById(patientId);

    if (!patient) {
      return res.status(404).json({
        success: false,
        version: "Version 1",
        message: "Patient not found",
        readinessStatus: "Not Ready",
        readinessScore: 0,
        recommendation:
          "Please check your patient information.",
      });
    }

    // --------------------------------------------------------
    // 2. Find patient's active queue token
    // --------------------------------------------------------

    const patientToken = await QueueToken.findOne({
      patientId: patientId,
      status: {
        $in: ["Waiting", "In Consultation"],
      },
    }).sort({ queueNumber: 1 });

    // --------------------------------------------------------
    // 3. No active token
    // --------------------------------------------------------

    if (!patientToken) {
      return res.status(404).json({
        success: false,
        version: "Version 1",
        patientId: patientId,
        message: "No active queue token found",

        readinessStatus: "Not Ready",

        readinessScore: 0,

        recommendation:
          "Please join the queue to prepare for your consultation.",

        checks: {
          activeToken: false,
          inQueue: false,
          notCancelled: false,
          waiting: false,
        },
      });
    }

    // --------------------------------------------------------
    // 4. Find patients ahead
    // --------------------------------------------------------

    const patientsAhead = await QueueToken.countDocuments({
      status: {
        $in: ["Waiting", "In Consultation"],
      },
      queueNumber: {
        $lt: patientToken.queueNumber,
      },
    });

    // --------------------------------------------------------
    // 5. Patient is already in consultation
    // --------------------------------------------------------

    if (patientToken.status === "In Consultation") {
      return res.json({
        success: true,
        version: "Version 1",

        patientId: patientId,

        tokenNumber: patientToken.tokenNumber,

        queueNumber: patientToken.queueNumber,

        queueStatus: patientToken.status,

        patientsAhead: patientsAhead,

        readinessStatus: "Consultation In Progress",

        readinessScore: 100,

        recommendation:
          "Your consultation is currently in progress.",

        checks: {
          activeToken: true,
          inQueue: true,
          notCancelled: true,
          waiting: false,
        },
      });
    }

    // --------------------------------------------------------
    // 6. Patient is waiting
    // --------------------------------------------------------

    if (patientToken.status === "Waiting") {
      return res.json({
        success: true,
        version: "Version 1",

        patientId: patientId,

        tokenNumber: patientToken.tokenNumber,

        queueNumber: patientToken.queueNumber,

        queueStatus: patientToken.status,

        patientsAhead: patientsAhead,

        readinessStatus: "Ready for Consultation",

        readinessScore: 80,

        recommendation:
          "Please be ready for your consultation and stay near the consultation area.",

        checks: {
          activeToken: true,
          inQueue: true,
          notCancelled: true,
          waiting: true,
        },
      });
    }

    // --------------------------------------------------------
    // 7. Fallback
    // --------------------------------------------------------

    return res.json({
      success: true,
      version: "Version 1",

      patientId: patientId,

      readinessStatus: "Not Ready",

      readinessScore: 0,

      recommendation:
        "Please check your queue status.",
    });

  } catch (error) {
    console.error(
      "Visit Readiness V1 Error:",
      error
    );

    res.status(500).json({
      success: false,
      version: "Version 1",
      message:
        "Unable to calculate patient visit readiness.",
      error: error.message,
    });
  }
});

module.exports = router;