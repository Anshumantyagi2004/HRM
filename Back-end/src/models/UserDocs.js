import mongoose from "mongoose";

const userDocsSchema = new mongoose.Schema(
    {
        userDocsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String, // "aadhaar", "degree", "certificate"
        },

        url: String,

        uploadedAt: {
            type: Date,
            default: Date.now,
        }
    }
);

export const UserDocuments = mongoose.model("UserDocuments", userDocsSchema);
