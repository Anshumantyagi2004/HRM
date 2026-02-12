import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String, // personal email
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    officialEmail: {
      type: String, // company email
    },

    password: {
      type: String,
      required: true,
    },

    contact: {
      type: String,
      required: true,
    },

    altContact: {
      type: String,
    },

    role: {
      type: String,
      enum: ["Admin", "Sub Admin", "Employee"],
      default: "Employee",
    },

    dob: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },

    address: {
      type: String, // current address
      trim: true,
    },

    permanentAddress: {
      type: String,
      trim: true,
    },

    profileImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
