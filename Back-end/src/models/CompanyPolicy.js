import mongoose from "mongoose";

const companyPolicy = new mongoose.Schema(
    {
        documentName: String,
        url: String,
        fileField: {
            type: String,
        },
    }, { timestamps: true });

export const CompanyPolicy = mongoose.model("CompanyPolicy", companyPolicy);