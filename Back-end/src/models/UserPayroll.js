import mongoose from "mongoose";

const userPayrollSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    accountHolderName: {
      type: String,
      trim: true,
    },

    bankName: {
      type: String,
      trim: true,
    },

    accountNumber: {
      type: String,
      trim: true,
      minlength: 6,
      maxlength: 20,
    },

    branchName: {
      type: String,
    },

    city: {
      type: String,
    },

    ifscCode: {
      type: String,
      uppercase: true,
      match: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    },

    pfNumber: {
      type: String,
      uppercase: true,
    },

    panNumber: {
      type: String,
      uppercase: true,
    },

    accountType: {
      type: String,
      enum: ["SAVINGS", "CURRENT", "SALARY"],
      default: "SALARY",
    },

    basicPay: {
      type: Number,
    },

    HRA: {
      type: Number,
    },

    bonus: {
      type: Number,
    },

    specialAllowance: {
      type: Number,
    },

    ta: {
      type: Number,
    },

    medicalAllowance: {
      type: Number,
    },

    variable: {
      type: Number,
    },

    EPF: {
      type: Number,
    },

    ctc: {
      type: Number,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

export const UserPayroll = mongoose.model("UserPayroll", userPayrollSchema);
