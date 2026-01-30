import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        date: {
            type: Date,
            required: true,
        },

        clockInTime: {
            type: Date,
            required: true,
        },

        clockOutTime: {
            type: Date,
            default: null,
        },

        clockStatus: {
            type: String,
            enum: ["CLOCKED_IN", "CLOCKED_OUT"],
            default: "CLOCKED_IN",
        },

        workDuration: {
            type: Number, // minutes
            default: 0,
        },

        lateBy: {
            type: Number, // minutes
            default: 0,
        },

        status: {
            type: String,
            enum: ["PRESENT", "ABSENT", "ANOMALIES", "ON_LEAVE", "WORK_FROM_HOME"],
            default: "PRESENT",
        },

        userLocation: {
            latitude: Number,
            longitude: Number,
        },

        officeLocation: {
            latitude: Number,
            longitude: Number,
            radius: Number,
        },
    },
    { timestamps: true }
);

export const Attendance = mongoose.model("Attendance", attendanceSchema);