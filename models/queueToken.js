const mongoose = require("mongoose");

const queueTokenSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },

    tokenNumber: {
      type: String,
      required: true,
      unique: true,
    },

    queueNumber: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Waiting",
        "In Consultation",
        "Completed",
        "Cancelled",
      ],
      default: "Waiting",
    },

    // Version 3
    consultationStartTime: {
      type: Date,
      default: null,
    },

    consultationEndTime: {
      type: Date,
      default: null,
    },

    consultationDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
module.exports =
  mongoose.models.QueueToken ||
  mongoose.model("QueueToken", queueTokenSchema);