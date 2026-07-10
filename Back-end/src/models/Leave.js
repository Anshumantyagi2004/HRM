import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        leaveType: {
            type: String,
            required: true,
        },

        startDate: {
            type: Date,
            required: true,
        },

        endDate: {
            type: Date,
            required: true,
        },

        startHalf: {
            type: String,
            enum: ["FULL", "FIRST_HALF", "SECOND_HALF"],
            default: "FULL",
        },

        endHalf: {
            type: String,
            enum: ["FULL", "FIRST_HALF", "SECOND_HALF"],
            default: "FULL",
        },

        reason: {
            type: String,
            trim: true,
        },

        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },

        actionBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        actionDate: {
            type: Date,
            default: null,
        },

        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Leave", leaveSchema);
