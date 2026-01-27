import mongoose from "mongoose";
import Leave from "../models/Leave.js";

export const applyLeave = async (req, res) => {
    try {
        // const userId = req.user.id; // from auth middleware
        const { leaveType, startDate, endDate, reason, userId } = req.body;

        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({
                message: "Start date cannot be after end date",
            });
        }

        const leave = await Leave.create({
            user: userId,
            leaveType,
            startDate,
            endDate,
            reason,
        });

        return res.status(201).json({
            message: "Leave applied successfully",
            leave,
        });
    } catch (error) {
        console.error("Apply leave error:", error);
        return res.status(500).json({
            message: "Server error while applying leave",
        });
    }
};

//findall Leave
export const getAllLeave = async (req, res) => {
    try {
        const leave = await Leave.find()
            .populate("user", "username email designation")
            .populate("actionBy", "username email designation")
            .sort({ createdAt: -1 });

        res.status(200).json(leave);
    } catch (error) {
        console.error("Get leave error:", error);
        res.status(500).json({ message: "Failed to fetch leave" });
    }
};

//find by userid
export const getLeaveByUser = async (req, res) => {
    try {
        const { user } = req.params;

        const leaves = await Leave.find({
            user: new mongoose.Types.ObjectId(user),
        })
            .populate("user", "username email designation")
            .populate("actionBy", "username email designation")
            .sort({ createdAt: -1 });

        if (!leaves.length) {
            return res.status(404).json({ message: "No leave records found" });
        }

        res.status(200).json(leaves || []);
    } catch (error) {
        console.error("Get leave by user error:", error);
        res.status(500).json({ message: "Failed to fetch user leave" });
    }
};

//leave status update
export const updateLeaveStatus = async (req, res) => {
    try {
        const { status, actionBy, actionDate } = req.body;
        const { id } = req.params;

        const leave = await Leave.findByIdAndUpdate(
            id,
            {
                status,
                actionBy,
                actionDate,
            },
            { new: true }
        );

        res.status(200).json({
            message: `Leave ${status} successfully`,
            leave,
        });
    } catch (error) {
        console.error("Leave action error:", error);
        res.status(500).json({ message: "Failed to update leave" });
    }
};

//pending leave edit by user
export const updateUserLeave = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedLeave = await Leave.findByIdAndUpdate(
            id,
            req.body,
            { new: true } // return updated document
        );

        if (!updatedLeave) {
            return res.status(404).json({ message: "Leave not found" });
        }

        res.status(200).json({
            message: "Leave updated successfully",
            leave: updatedLeave,
        });
    } catch (error) {
        console.error("Edit leave error:", error);
        res.status(500).json({ message: "Failed to update leave" });
    }
};
