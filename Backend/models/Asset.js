

const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: true,
      unique: true,
    },

    assetName: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      default: "Laptop",
    },

    assignedTo: {
      type: String,
      default: "",
    },

    assignedDate: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Available", "Assigned"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Asset", assetSchema);