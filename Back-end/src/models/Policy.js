import mongoose from "mongoose";

const userPolicy = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        documentName: {
            type: String,
        },

        url: String,

        status: String,

        uploadedAt: {
            type: Date,
            default: Date.now,
        }
    }
);

export const UserPolicy = mongoose.model("UserPolicy", userPolicy);