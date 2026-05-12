import mongoose from "mongoose";

const companyInfo = new mongoose.Schema(
    {
        ruleName: {
            type: String,
            required: true,
            trim: true,
        },
        shiftStartTime: String,
        shiftOutTime: String,
        inTimeGrace: String,
        outTimeGrace: String,
        fullDay: String,
        halfDay: String,
        casualLeave: Number,
        sickLeave: Number,
        defaultRule: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

export const CompanyInfo = mongoose.model("CompanyInfo", companyInfo);
