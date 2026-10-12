const dns = require("dns");

// ============================================================
// DNS SETTINGS FOR MONGODB ATLAS
// ============================================================

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

// ============================================================
// IMPORTS
// ============================================================

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

// ============================================================
// ROUTES
// ============================================================

const patientRoutes = require("./routes/patientRoutes");
const queueRoutes = require("./routes/queueRoutes");
const queueAlertRoutes = require("./routes/queueAlertRoutes");
const consultationHistoryRoutes = require("./routes/consultationHistoryRoutes");
const hospitalLoadRoutes = require("./routes/hospitalLoadRoutes");
const bestTimeRoutes = require("./routes/bestTimeRoutes");
const visitReadinessRoutes = require("./routes/visitReadinessRoutes");
const visitReadinessV2Routes = require("./routes/visitReadinessV2Routes");
const visitReadinessV3Routes = require("./routes/visitReadinessV3Routes");
// ============================================================
// EXPRESS APP
// ============================================================

const app = express();

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(cors());
app.use(express.json());

// ============================================================
// PATIENT ROUTES
// ============================================================

app.use("/patients", patientRoutes);

// ============================================================
// QUEUE ROUTES
// ============================================================

app.use("/queue", queueRoutes);
// ============================================================
// SMART QUEUE TURN ALERT
// VERSION 1
// ============================================================

app.use("/queue-alert", queueAlertRoutes);

// ============================================================
// CONSULTATION HISTORY ROUTES
// ============================================================

app.use(
  "/consultation-history",
  consultationHistoryRoutes
);

// ============================================================
// HOSPITAL LOAD PREDICTION ROUTES
// ============================================================

app.use(
  "/hospital-load",
  hospitalLoadRoutes
);

// ============================================================
// BEST TIME TO VISIT
// ============================================================

app.use(
  "/best-time",
  bestTimeRoutes
);
app.use("/visit-readiness", visitReadinessRoutes);
app.use("/visit-readiness-v2", visitReadinessV2Routes);
app.use("/visit-readiness-v3", visitReadinessV3Routes);
// ============================================================
// HOME ROUTE
// ============================================================

app.get("/", (req, res) => {

  res.json({
    success: true,
    message:
      "AI Hospital Queue Backend is running",

    version:
      "Waiting Time V3 + Consultation History V1 V2 V3 + Hospital Load V1 V2 V3 + Best Time V2",
  });

});

// ============================================================
// BEST TIME TEST ROUTE
// ============================================================

app.get("/best-time-test", (req, res) => {

  res.json({
    success: true,
    message:
      "Best Time route is connected",
  });

});

// ============================================================
// MONGODB CONNECTION
// ============================================================

const connectDatabase = async () => {

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB Connected Successfully"
    );

  } catch (error) {

    console.error(
      "MongoDB Connection Error:",
      error.message
    );

    process.exit(1);
  }

};

// ============================================================
// SERVER
// ============================================================

const PORT = 5000;

const startServer = async () => {

  try {

    await connectDatabase();

    app.listen(PORT, () => {

      console.log(
        `Server is running on port ${PORT}`
      );

      console.log(
        `http://localhost:${PORT}`
      );

      console.log(
        `Best Time API: http://localhost:${PORT}/best-time`
      );

    });

  } catch (error) {

    console.error(
      "Server Start Error:",
      error.message
    );

  }

};

// ============================================================
// START
// ============================================================

startServer();