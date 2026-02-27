import mongoose from "mongoose";

const userPolicy = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        documentName: String,
        url: String,
        status: { type: String, default: "PENDING" },
        signedAt: Date,
        signedBy: String,
        remark: String
    }, { timestamps: true });

export const UserPolicy = mongoose.model("UserPolicy", userPolicy);