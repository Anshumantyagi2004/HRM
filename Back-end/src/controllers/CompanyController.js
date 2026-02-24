import { CompanyInfo } from '../models/CompanyInfo.js';

export const addRules = async (req, res) => {
    try {
        const {
            shiftStartTime,
            shiftOutTime,
            inTimeGrace,
            outTimeGrace,
            fullDay,
            halfDay,
            casualLeave,
            sickLeave,
            ruleName
        } = req.body;

        const rules = await CompanyInfo.create({
            shiftStartTime,
            shiftOutTime,
            inTimeGrace,
            outTimeGrace,
            fullDay,
            halfDay,
            casualLeave,
            sickLeave,
            ruleName
        });

        return res.status(201).json({
            success: true,
            message: "Attendance rules added successfully",
            data: rules,
        });

    } catch (error) {
        console.error("addRules error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while applying rules",
            error: error.message,
        });
    }
};

export const getAllInfo = async (req, res) => {
    try {
        const Info = await CompanyInfo.find()

        res.status(200).json(Info);
    } catch (error) {
        console.error("Get error:", error);
        res.status(500).json({ message: "Failed to fetch" });
    }
};