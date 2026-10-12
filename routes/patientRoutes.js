const express = require("express");
const router = express.Router();

const Patient = require("../models/patient");


// ==========================================
// REGISTER PATIENT
// ==========================================

router.post("/add", async (req, res) => {

  try {

    console.log(
      "Registration data received:",
      req.body
    );


    const {
      name,
      age,
      phone,
      disease,
      password,
    } = req.body;


    // ==========================================
    // CHECK REQUIRED FIELDS
    // ==========================================

    if (
      !name ||
      !age ||
      !phone ||
      !disease ||
      !password
    ) {

      return res.status(400).json({
        message: "All fields are required",
      });

    }


    // ==========================================
    // CHECK EXISTING PHONE NUMBER
    // ==========================================

    const existingPatient =
      await Patient.findOne({
        phone: phone,
      });


    if (existingPatient) {

      return res.status(400).json({
        message: "Phone number already registered",
      });

    }


    // ==========================================
    // CREATE PATIENT
    // ==========================================

    const patient = new Patient({

      name: name,

      age: age,

      phone: phone,

      disease: disease,

      password: password,

      // IMPORTANT:
      // Do NOT generate queueToken here.
      // Queue token will be generated when
      // the patient clicks "Join Queue".

    });


    await patient.save();


    console.log(
      "Patient saved:",
      patient
    );


    // ==========================================
    // SEND RESPONSE
    // ==========================================

    res.status(201).json({

      message:
        "Patient registered successfully",

      patient: {

        _id: patient._id,

        name: patient.name,

        age: patient.age,

        phone: patient.phone,

        disease: patient.disease,

      },

    });


  } catch (error) {

    console.error(
      "Registration Error:",
      error
    );


    res.status(500).json({

      message: "Registration failed",

      error: error.message,

    });

  }

});


// ==========================================
// GET ALL PATIENTS
// ==========================================

router.get("/", async (req, res) => {

  try {

    const patients =
      await Patient.find();

    res.json(patients);


  } catch (error) {

    console.error(
      "Fetch Patients Error:",
      error
    );


    res.status(500).json({

      message:
        "Failed to fetch patients",

      error: error.message,

    });

  }

});


// ==========================================
// PATIENT LOGIN
// ==========================================

router.post("/login", async (req, res) => {

  try {

    const {
      name,
      password,
    } = req.body;


    console.log(
      "Login attempt:",
      name
    );


    // ==========================================
    // CHECK REQUIRED FIELDS
    // ==========================================

    if (!name || !password) {

      return res.status(400).json({

        message:
          "Name and password are required",

      });

    }


    // ==========================================
    // FIND PATIENT
    // ==========================================

    const patient =
      await Patient.findOne({
        name: name,
      });


    // ==========================================
    // PATIENT NOT FOUND
    // ==========================================

    if (!patient) {

      return res.status(401).json({

        message:
          "Invalid name or password",

      });

    }


    // ==========================================
    // CHECK PASSWORD
    // ==========================================

    if (
      patient.password !== password
    ) {

      return res.status(401).json({

        message:
          "Invalid name or password",

      });

    }


    // ==========================================
    // LOGIN SUCCESSFUL
    // ==========================================

    console.log(
      "Login successful:",
      patient._id
    );


    res.status(200).json({

      message:
        "Login successful",


      // IMPORTANT:
      // Use _id, NOT id.
      // DigitalQueueToken.jsx needs
      // patient._id.

      patient: {

        _id: patient._id,

        name: patient.name,

        age: patient.age,

        phone: patient.phone,

        disease: patient.disease,

        queueToken:
          patient.queueToken || null,

      },

    });


  } catch (error) {

    console.error(
      "Login Error:",
      error
    );


    res.status(500).json({

      message:
        "Login failed",

      error: error.message,

    });

  }

});


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;