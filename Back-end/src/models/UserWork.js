import mongoose from "mongoose";

const userWorkSchema = new mongoose.Schema(
    {
        userWorkId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        empId: {
            type: String,
        },

        joiningDate: {
            type: Date,
        },

        empType: {
            type: String,
        },

        workLocation: {
            type: String,
        },

        workExperince: {
            type: String,
        },

        department: {
            type: String,
        },

        designation: {
            type: String,
        },

        workHistory: [
            {
                department: String,
                designation: String,
                from: Date,
                to: Date,
                orgName: String,
                orgLocation: String,
            },
        ],
    },
);

export const UserWork = mongoose.model("UserWork", userWorkSchema);
