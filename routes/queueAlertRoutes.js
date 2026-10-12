const express = require("express");

const router = express.Router();

const QueueToken = require("../models/queueToken");

// ============================================================
// SMART QUEUE TURN ALERT
// VERSION 1
// ============================================================
//
// V1 checks:
//
// 1. Patient active token
// 2. Queue number
// 3. Current queue position
// 4. Waiting patients ahead
// 5. Queue status
// 6. Alert level
//
// ============================================================

router.get("/v1/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    console.log(
      "Smart Queue Turn Alert V1 request:",
      patientId
    );

    // ========================================================
    // FIND PATIENT'S ACTIVE TOKEN
    // ========================================================

    const patientToken = await QueueToken.findOne({
      patientId,
      status: {
        $in: ["Waiting", "In Consultation"]
      }
    }).sort({
      createdAt: -1
    });

    // ========================================================
    // NO ACTIVE TOKEN
    // ========================================================

    if (!patientToken) {
      return res.status(404).json({
        success: false,
        message: "No active queue token found"
      });
    }

    // ========================================================
    // GET ACTIVE QUEUE
    // ========================================================

    const activeQueue = await QueueToken.find({
      status: {
        $in: ["Waiting", "In Consultation"]
      }
    }).sort({
      queueNumber: 1
    });

    // ========================================================
    // CURRENT POSITION
    // ========================================================

    const currentPosition =
      activeQueue.findIndex(
        (token) =>
          String(token._id) ===
          String(patientToken._id)
      ) + 1;

    // ========================================================
    // WAITING PATIENTS AHEAD
    // ========================================================
    //
    // We count only WAITING patients ahead.
    //
    // If another patient is currently "In Consultation",
    // that patient is handled separately.
    //
    // ========================================================

    const waitingPatientsAhead =
      activeQueue.filter((token) => {
        return (
          token.status === "Waiting" &&
          token.queueNumber <
            patientToken.queueNumber
        );
      });

    const patientsAhead =
      waitingPatientsAhead.length;

    // ========================================================
    // CURRENT CONSULTATION
    // ========================================================

    const currentConsultation =
      activeQueue.find(
        (token) =>
          token.status === "In Consultation"
      );

    // ========================================================
    // ALERT LEVEL
    // ========================================================

    let alertLevel = "";
    let alertMessage = "";
    let alertType = "";

    if (
      patientToken.status ===
      "In Consultation"
    ) {
      alertLevel = "In Consultation";
      alertType = "consultation";
      alertMessage =
        "Your consultation is currently in progress.";
    }

    else if (patientsAhead === 0) {
      alertLevel = "Your Turn Is Next";
      alertType = "your-turn";
      alertMessage =
        "Your turn is next. Please be ready for consultation.";
    }

    else if (patientsAhead <= 2) {
      alertLevel = "Get Ready";
      alertType = "get-ready";
      alertMessage =
        `Your turn is getting closer. ${patientsAhead} ${
          patientsAhead === 1
            ? "patient is"
            : "patients are"
        } ahead of you.`;
    }

    else if (patientsAhead <= 4) {
      alertLevel = "Getting Closer";
      alertType = "getting-closer";
      alertMessage =
        `${patientsAhead} patients are ahead of you. Your turn is getting closer.`;
    }

    else {
      alertLevel = "Waiting";
      alertType = "waiting";
      alertMessage =
        `${patientsAhead} patients are ahead of you. Please wait for your turn.`;
    }

    // ========================================================
    // RESPONSE
    // ========================================================

    res.json({
      success: true,

      version: "Version 1",

      patientId,

      tokenNumber:
        patientToken.tokenNumber,

      queueNumber:
        patientToken.queueNumber,

      currentPosition,

      patientsAhead,

      queueStatus:
        patientToken.status,

      currentConsultationToken:
        currentConsultation
          ? currentConsultation.tokenNumber
          : null,

      alertLevel,

      alertType,

      alertMessage
    });

  } catch (error) {

    console.error(
      "Smart Queue Turn Alert V1 Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Server error while calculating Smart Queue Turn Alert",
      error: error.message
    });
  }
});

// ============================================================
// EXPORT ROUTER
// ============================================================

module.exports = router;