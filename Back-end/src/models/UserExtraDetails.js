import mongoose from "mongoose";

const userExtraDetailSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    shiftStartTime: String,
    shiftOutTime: String,
    inTimeGrace: String,
    outTimeGrace: String,
    fullDay: String,
    halfDay: String,

    casualLeave: {
        type: Number,
        default: 0,
    },

    sickLeave: {
        type: Number,
        default: 0,
    },

    lossOfPay: String,

    compOff: {
        type: Number,
        default: 0,
    },

    casualLeaveRemaining: {
        type: Number,
        default: 0,
    },

    sickLeaveRemaining: {
        type: Number,
        default: 0,
    },

    compOffRemaining: {
        type: Number,
        default: 0,
    },

    // NEW
    lastLeaveCreditMonth: {
        type: Number,
        default: 0,
    },
});

export const UserExtraDetail = mongoose.model(
    "UserExtraDetail",
    userExtraDetailSchema
);