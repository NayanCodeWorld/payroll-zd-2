"use strict";

const { Schema, model } = require("mongoose");

const holiday = Schema(
  {
    holiday_name: {
      required: true,
      type: String,
      trim: true,
    },

    holiday_type: {
      type: String,
      // required: true,
      // trim: [true, "space not allow"],
      // enum: [1, 0.5]
    },
    holiday_date: {
      type: Date,
      // required: true,
    },
  },
  {
    timestamps: true,
  }
);

// collection creation
const HolidayModal = model("HOLIDAY", holiday, "holiday");

module.exports = HolidayModal;
