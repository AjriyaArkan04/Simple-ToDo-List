const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    activity: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false, 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);