import mongoose from "mongoose";

const userExtraDetailSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        shiftStartTime: String, //9:30
        shiftOutTime: String, //6:30
        inTimeGrace: String, //00:15
        outTimeGrace: String, //00:15
        fullDay: String, //08:30
        halfDay: String, //04:15
        casualLeave: String, //15 or 30
        sickLeave: String, //7 or 10
        lossOfPay: String,
        compOff: String,
    },
);

export const UserExtraDetail = mongoose.model("UserExtraDetail", userExtraDetailSchema);