const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    disease: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    queueNumber: {
      type: Number,
      default: null,
    },

    queueStatus: {
      type: String,
      enum: [
        "Not Joined",
        "Waiting",
        "Serving",
        "Completed",
        "Cancelled",
      ],
      default: "Not Joined",
    },
  },
  {
    timestamps: true,
  }
);
module.exports =
  mongoose.models.Patient ||
  mongoose.model("Patient", patientSchema);
