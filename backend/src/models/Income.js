import mongoose from "mongoose";

const IncomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    icon: {
      type: String,
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Income", IncomeSchema);
