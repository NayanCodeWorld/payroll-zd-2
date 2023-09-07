"use strict";

const { Schema, model } = require("mongoose");

const leaveSchema = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId, // Corrected the type
      required: true,
      trim: true,
    },
    leave_type: {
      type: Number,
      required: true,
      enum: [1, 0.5],
    },
    from_date: {
      type: Date,
      required: true,
    },
    to_date: {
      type: Date,
      required: true,
    },
    reason_for_leave: {
      type: String,
      required: true,
    },
    total_number_of_day: {
      type: Number,
      default: 0,
    },
    leave_status: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// collection creation
const LeaveModel = model("LEAVE", leaveSchema, "leave"); // Corrected variable name

module.exports = LeaveModel;
