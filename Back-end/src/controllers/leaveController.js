import mongoose from "mongoose";
import Leave from "../models/Leave.js";
import { UserExtraDetail } from "../models/UserExtraDetails.js";
import { getUserSocketId } from "../socket/socket.js";
import { UserWork } from "../models/UserWork.js";
import { mailTransporter } from "../config/mail.js";
import { User } from "../models/User.js";

const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const deductLeave = (userExtra, leaveType, days, leave) => {
    if (leaveType === "Causal Leave") {
        if (userExtra.casualLeaveRemaining < days) {
            leave.leaveType = "Loss of Pay";
            return;
        }
        userExtra.casualLeaveRemaining -= days;
    }

    if (leaveType === "Sick Leave") {
        if (userExtra.sickLeaveRemaining < days) {
            leave.leaveType = "Loss of Pay";
            return;
        }
        userExtra.sickLeaveRemaining -= days;
    }
};

const restoreLeave = (userExtra, leaveType, days) => {
    if (leaveType === "Causal Leave") {
        userExtra.casualLeaveRemaining += days;
    }

    if (leaveType === "Sick Leave") {
        userExtra.sickLeaveRemaining += days;
    }
};

export const applyLeave = async (req, res) => {
    try {
        const userId = req.user.id;
        const { leaveType, startDate, endDate, reason } = req.body;

        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({
                message: "Start date cannot be after end date",
            });
        }

        const currentUser = await User.findById(userId);

        if (!currentUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Create leave
        const leave = await Leave.create({
            user: userId,
            leaveType,
            startDate,
            endDate,
            reason,
        });

        // Fetch Admin & Sub Admin
        const admins = await User.find({
            role: { $in: ["Admin", "Sub Admin"] },
            officialEmail: { $exists: true, $ne: "" },
        });

        // Extract emails
        const adminEmails = admins.map((admin) => admin.officialEmail);

        // Send mail to all admins/subadmins
        if (adminEmails.length > 0) {
            const oneDay = 1000 * 60 * 60 * 24;

            const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / oneDay) + 1;

            await mailTransporter.sendMail({
                from: `"HRMS Portal" <${process.env.MAIL_USER}>`,

                to: adminEmails.join(","),

                subject: `New Leave Request - ${currentUser.username}`,

                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        
                        <h2 style="color:#4f46e5;">
                            New Leave Application
                        </h2>

                        <p>
                            An employee has applied for leave.
                        </p>

                        <table 
                            style="
                                border-collapse: collapse;
                                width: 100%;
                                margin-top: 20px;
                            "
                        >
                            <tr>
                                <td style="padding:10px; border:1px solid #ddd;">
                                    <b>Employee Name</b>
                                </td>

                                <td style="padding:10px; border:1px solid #ddd;">
                                    ${currentUser.username}
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:10px; border:1px solid #ddd;">
                                    <b>Official Email</b>
                                </td>

                                <td style="padding:10px; border:1px solid #ddd;">
                                    ${currentUser.officialEmail || "-"}
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:10px; border:1px solid #ddd;">
                                    <b>Leave Type</b>
                                </td>

                                <td style="padding:10px; border:1px solid #ddd;">
                                    ${leaveType}
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:10px; border:1px solid #ddd;">
                                    <b>Start Date</b>
                                </td>

                                <td style="padding:10px; border:1px solid #ddd;">
                                    ${startDate}
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:10px; border:1px solid #ddd;">
                                    <b>End Date</b>
                                </td>

                                <td style="padding:10px; border:1px solid #ddd;">
                                    ${endDate}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:10px; border:1px solid #ddd;">
                                    <b>Total Days</b>
                                </td>

                                <td style="padding:10px; border:1px solid #ddd;">
                                    ${totalDays}
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:10px; border:1px solid #ddd;">
                                    <b>Reason</b>
                                </td>

                                <td style="padding:10px; border:1px solid #ddd;">
                                    ${reason}
                                </td>
                            </tr>
                        </table>

                        <p style="margin-top:20px;">
                            Please review the leave request in the HRMS portal.
                        </p>

                    </div>
                `,
            });
        }

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
            .populate("user", "username email officialEmail profileImage")
            .populate("actionBy", "username email officialEmail profileImage")
            .sort({ createdAt: -1 });

        // Attach userWork manually
        const updatedLeave = await Promise.all(
            leave.map(async (item) => {

                const userWork = await UserWork.findOne({
                    userWorkId: item.user?._id,
                });

                return {
                    ...item.toObject(),
                    userWork,
                };
            })
        );

        res.status(200).json({
            success: true,
            data: updatedLeave,
        });
    } catch (error) {
        console.error("Get leave error:", error);
        res.status(500).json({ message: "Failed to fetch leave" });
    }
};

//find by userid
export const getLeaveByUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const leaves = await Leave.find({
            user: new mongoose.Types.ObjectId(userId),
        }).populate("user", "username email designation")
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
export const updateLeaveStatus1 = async (req, res) => {
    try {
        const { status, actionBy } = req.body;
        const { id } = req.params;



        const leave = await Leave.findByIdAndUpdate(
            id,
            {
                status,
                actionBy,
                actionDate: new Date(),
            },
            { new: true }
        ).populate("user");

        res.status(200).json({
            message: `Leave ${status} successfully`,
            leave,
        });
    } catch (error) {
        console.error("Leave action error:", error);
        res.status(500).json({ message: "Failed to update leave" });
    }
};

export const updateLeaveStatus = async (req, res) => {
    try {
        const { status, actionBy } = req.body;
        const { id } = req.params;

        const leave = await Leave.findById(id).populate("user");
        if (!leave) return res.status(404).json({ message: "Leave not found" });

        const userExtra = await UserExtraDetail.findOne({ userId: leave.user._id });
        if (!userExtra) return res.status(404).json({ message: "User extra details not found" });

        const days = calculateDays(leave.startDate, leave.endDate);
        const oldStatus = leave.status;
        const leaveType = leave.leaveType;

        // Pending → Approved
        if (oldStatus === "Pending" && status === "Approved") {
            deductLeave(userExtra, leaveType, days, leave);
        }

        // Pending → Rejected
        if (oldStatus === "Pending" && status === "Rejected") {
            leave.leaveType = "Loss of Pay";
        }

        // Approved → Rejected
        if (oldStatus === "Approved" && status === "Rejected") {
            restoreLeave(userExtra, leaveType, days);
            leave.leaveType = "Loss of Pay";
        }

        // Approved → Pending (Cancel)
        if (oldStatus === "Approved" && status === "Pending") {
            restoreLeave(userExtra, leaveType, days);
        }

        // Rejected → Approved
        if (oldStatus === "Rejected" && status === "Approved") {
            deductLeave(userExtra, leaveType, days, leave);
        }
        if (oldStatus === "Rejected" && status === "Pending") {
            // nothing
        }

        leave.status = status;
        leave.actionBy = actionBy;
        leave.actionDate = new Date();

        await userExtra.save();
        await leave.save();

        res.status(200).json({
            message: `Leave ${oldStatus} → ${status} successfully`,
            leave,
            days
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
