import { Attendance } from "../models/Attendance.js";
import Holiday from "../models/Holiday.js";

export const getDashboardCalendar = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const holidays = await Holiday.find({
      date: { $gte: startDate, $lte: endDate },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const calendar = {};
    const attendanceMap = {};

    attendance.forEach((a) => {
      const d = new Date(a.clockInTime);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      attendanceMap[key] = a.status;
    });

    const holidayMap = {};
    holidays.forEach((h) => {
      const d = new Date(h.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      holidayMap[key] = h.title;
    });

    const totalDays = new Date(year, month, 0).getDate();

    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(year, month - 1, d);
      date.setHours(0, 0, 0, 0);
      const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

      if (holidayMap[key]) {
        calendar[key] = {
          type: "holiday",
          name: holidayMap[key],
        };
      } else if (attendanceMap[key]) {
        calendar[key] = {
          type: "attendance",
          status: attendanceMap[key],
        };
      } else {
        if (date > today) {
          calendar[key] = { type: "NA" };
        } else {
          calendar[key] = {
            type: "attendance",
            status: "ABSENT",
          };
        }
      }
    }

    res.json({
      success: true,
      data: calendar,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};