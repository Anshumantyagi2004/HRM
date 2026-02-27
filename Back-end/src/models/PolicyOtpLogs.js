import mongoose from "mongoose";

const policyOtpSchema = new mongoose.Schema({
    userId: String,
    policyId: String,
    otpHash: String,
    expiresAt: Date,
    attempts: { type: Number, default: 0 },
    status: { type: String, default: "ACTIVE" } // ACTIVE, USED, EXPIRED
}, { timestamps: true });

export default mongoose.model("PolicyOtpLog", policyOtpSchema);