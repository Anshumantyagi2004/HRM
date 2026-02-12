import mongoose from "mongoose";

const userEduSchema = new mongoose.Schema(
    {
        userEduId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        qualificationType: String,
        courseName: String,
        courseType: String,
        stream: String,
        courseStartDate: Date,
        courseEndDate: Date,
        collegeName: String,
        universityName: String,
    },
);

export const UserEducation = mongoose.model("UserEducation", userEduSchema);
