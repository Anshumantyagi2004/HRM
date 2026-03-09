import Notification from "../models/Notification.js";
import { User } from '../models/User.js';

//Create
export const createNotification = async ({
  receiver,
  title,
  message,
  type,
  link
}) => {
  try {
    const notification = await Notification.create({
      receiver,
      title,
      message,
      type,
      link
    });

    return notification;

  } catch (error) {
    console.error("Create notification error:", error);
  }
};

//Get
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({
      receiver: userId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });

  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

//Unread
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Notification.find({
      receiver: userId,
      isRead: false
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      unread: count
    });

  } catch (error) {
    console.error("Unread count error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

//Mark Read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: notification
    });

  } catch (error) {
    console.error("Mark as read error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

//Mark All Read
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await Notification.updateMany(
      { receiver: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      message: "All notifications marked as read"
    });

  } catch (error) {
    console.error("Mark all as read error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

//Delete
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Notification deleted"
    });

  } catch (error) {
    console.error("Delete notification error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

//Add admin notification
export const adminSendNotification = async (req, res) => {
  try {
    const { user, title, message, type, sendToAll } = req.body;
    let notifications = [];

    if (sendToAll) {
      const users = await User.find({}, "_id");

      notifications = users.map((u) => ({
        receiver: u._id,
        title,
        message,
        type,
        link: "/notification"
      }));
    } else {
      notifications.push({
        receiver: user,
        title,
        message,
        type,
        link: "/notification"
      });
    }

    await Notification.insertMany(notifications);

    res.status(200).json({
      success: true,
      message: "Notification sent"
    });

  } catch (error) {
    console.error("Admin notification error", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};