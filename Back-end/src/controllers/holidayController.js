import Holiday from "../models/Holiday.js";
import { User } from '../models/User.js';
import Notification from "../models/Notification.js";

// Add
export const addHoliday = async (req, res) => {
  try {
    const { title, date, type } = req.body;

    if (!title || !date) {
      return res.status(400).json({
        success: false,
        message: "Title and date are required",
      });
    }

    // Check duplicate holiday
    const existingHoliday = await Holiday.findOne({ date });

    if (existingHoliday) {
      return res.status(400).json({
        success: false,
        message: "Holiday already exists on this date",
      });
    }

    // Calculate day automatically
    const day = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const holiday = await Holiday.create({
      title,
      date,
      day,
      type,
      createdBy: req.user?.id,
    });
    
    const users = await User.find({}, "_id");

    // 🔔 CREATE NOTIFICATIONS
    const notifications = users.map((user) => ({
      receiver: user._id,
      title: "New Holiday Announced",
      message: `${title} has been declared a holiday on ${date} ${day}`,
      type: "holiday",
      link: "/holiday",
      
    }));

    await Notification.insertMany(notifications);

    res.status(201).json({
      success: true,
      message: "Holiday added successfully",
      data: holiday,
    });
  } catch (error) {
    console.error("Add Holiday Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Get
export const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find().sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: holidays.length,
      data: holidays,
    });
  } catch (error) {
    console.error("Get Holidays Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Update
export const updateHoliday = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, type } = req.body;

    const day = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const holiday = await Holiday.findByIdAndUpdate(
      id,
      { title, date, type, day },
      { new: true }
    );

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Holiday updated successfully",
      data: holiday,
    });
  } catch (error) {
    console.error("Update Holiday Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete
export const deleteHoliday = async (req, res) => {
  try {
    const { id } = req.params;

    const holiday = await Holiday.findByIdAndDelete(id);

    if (!holiday) {
      return res.status(404).json({
        success: false,
        message: "Holiday not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Holiday deleted successfully",
    });
  } catch (error) {
    console.error("Delete Holiday Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};