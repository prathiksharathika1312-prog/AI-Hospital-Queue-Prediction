const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const QueueToken = require("../models/queueToken");

// ============================================================
// CONSULTATION HISTORY
// VERSION 1 + VERSION 2 + VERSION 3
// ============================================================

router.get("/patient/:patientId", async (req, res) => {
  try {
    const { patientId } = req.params;

    // ========================================================
    // CHECK PATIENT ID
    // ========================================================

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient ID",
      });
    }

    // ========================================================
    // GET COMPLETED CONSULTATIONS
    // ========================================================

    const consultations = await QueueToken.find({
      patientId: patientId,
      status: "Completed",
    }).sort({
      consultationEndTime: -1,
      createdAt: -1,
    });

    // ========================================================
    // VERSION 1
    // BASIC CONSULTATION HISTORY
    // ========================================================

    const version1 = consultations.map((consultation) => ({
      id: consultation._id,

      tokenNumber: consultation.tokenNumber,

      queueNumber: consultation.queueNumber,

      status: consultation.status,

      date: consultation.createdAt,

      consultationDuration:
        consultation.consultationDuration || 0,
    }));

    // ========================================================
    // VERSION 2
    // DETAILED HISTORY + STATISTICS
    // ========================================================

    const validDurations = consultations
      .map(
        (consultation) =>
          Number(consultation.consultationDuration) || 0
      )
      .filter((duration) => duration > 0);

    const totalConsultations = consultations.length;

    const totalDuration = validDurations.reduce(
      (sum, duration) => sum + duration,
      0
    );

    const averageDuration =
      validDurations.length > 0
        ? Number(
            (totalDuration / validDurations.length).toFixed(1)
          )
        : 0;

    const fastestConsultation =
      validDurations.length > 0
        ? Math.min(...validDurations)
        : 0;

    const longestConsultation =
      validDurations.length > 0
        ? Math.max(...validDurations)
        : 0;

    const version2 = {
      totalConsultations,

      averageDuration,

      fastestConsultation,

      longestConsultation,

      consultations: consultations.map((consultation) => ({
        id: consultation._id,

        tokenNumber: consultation.tokenNumber,

        queueNumber: consultation.queueNumber,

        status: consultation.status,

        date: consultation.createdAt,

        startTime: consultation.consultationStartTime,

        endTime: consultation.consultationEndTime,

        consultationDuration:
          consultation.consultationDuration || 0,
      })),
    };

    // ========================================================
    // VERSION 3
    // SMART / AI-STYLE CONSULTATION ANALYSIS
    // ========================================================

    let recentAverage = 0;

    if (validDurations.length > 0) {
      const recentDurations = validDurations.slice(0, 3);

      const recentTotal = recentDurations.reduce(
        (sum, duration) => sum + duration,
        0
      );

      recentAverage = Number(
        (recentTotal / recentDurations.length).toFixed(1)
      );
    }

    let trend = "No Trend";

    if (validDurations.length >= 2) {
      if (recentAverage < averageDuration) {
        trend = "Improving";
      } else if (recentAverage > averageDuration) {
        trend = "Increasing";
      } else {
        trend = "Stable";
      }
    }

    let insight =
      "Not enough consultation data to generate a smart insight.";

    if (validDurations.length === 1) {
      insight =
        "You have completed your first recorded consultation. More consultation data will improve the analysis.";
    }

    if (validDurations.length >= 2) {
      if (trend === "Improving") {
        insight =
          "Your recent consultations are shorter than your overall average consultation time.";
      } else if (trend === "Increasing") {
        insight =
          "Your recent consultations are taking longer than your overall average consultation time.";
      } else {
        insight =
          "Your recent consultation duration is close to your overall average.";
      }
    }

    let performance = "Not Available";

    if (averageDuration > 0) {
      if (averageDuration <= 5) {
        performance = "Very Fast";
      } else if (averageDuration <= 10) {
        performance = "Normal";
      } else if (averageDuration <= 15) {
        performance = "Moderate";
      } else {
        performance = "Long";
      }
    }

    const version3 = {
      totalConsultations,

      averageDuration,

      fastestConsultation,

      longestConsultation,

      recentAverage,

      trend,

      performance,

      insight,
    };

    // ========================================================
    // FINAL RESPONSE
    // ========================================================

    res.json({
      success: true,

      patientId: patientId,

      version1: {
        description: "Basic Consultation History",
        consultations: version1,
      },

      version2: {
        description: "Detailed Consultation History",
        ...version2,
      },

      version3: {
        description: "Smart Consultation History Analysis",
        ...version3,
      },
    });
  } catch (error) {
    console.error(
      "Consultation History Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch consultation history",
      error: error.message,
    });
  }
});

module.exports = router;