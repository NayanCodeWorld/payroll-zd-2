const { Schema, model } = require("mongoose");
const year_Leave = Schema(
  {
    year: {
      type: Date,
      // required: true,
    },
    leave: {
      type: Number,
      // required: true,
    },
  },

  {
    timestamps: true,
  }
);
const yearModal = model("YEAR_LEAVE", year_Leave, "year_Leave");
module.exports = yearModal;
