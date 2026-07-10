import { Attendance } from '../models/Attendance.js';
import { User } from '../models/User.js';
import { UserExtraDetail } from "../models/UserExtraDetails.js";
import Holiday from "../models/Holiday.js";
import Leave from "../models/Leave.js";
import { mailTransporter } from "../config/mail.js";

const OFFICE_LOCATION = {
  latitude: 28.692301898136748,
  longitude: 77.1483210938225,
  radius: 100, // meters
};

const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const convertToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

const getISTMinutes = (date) => {
  const istOffset = 5.5 * 60; // minutes
  const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes();
  return utcMinutes + istOffset;
};

const calculateLateAndStatus = (clockInUTC, userShift, monthlyAnomalies) => {
  const clockInMinutes = getISTMinutes(clockInUTC);

  const shiftStart = convertToMinutes(
    userShift.shiftStartTime
  );

  const graceMinutes = convertToMinutes(
    userShift.inTimeGrace
  );

  const graceLimit = shiftStart + graceMinutes;

  let lateBy = 0;
  let status = "PRESENT";

  // User is late
  if (clockInMinutes > graceLimit) {
    lateBy = clockInMinutes - graceLimit;
    if (monthlyAnomalies >= 2) {
      status = "HALF_DAY";
    } else {
      status = "ANOMALIES";
    }
  }

  return { lateBy, status };
};

// const calculateClockOutStatus = (clockOutUTC, workDuration, userShift) => {
//   const clockOutMinutes = getISTMinutes(clockOutUTC);

//   const shiftOut = convertToMinutes(userShift.shiftOutTime);   // "18:30"
//   const outGrace = convertToMinutes(userShift.outTimeGrace);  // "00:15"
//   const graceLimit = shiftOut + outGrace;                      // 18:45

//   const halfDayMinutes = convertToMinutes(userShift.halfDay); // "04:30" → 270

//   let status = "PRESENT";

//   // 🌓 Half Day Rule
//   if (workDuration < halfDayMinutes) {
//     return "HALF_DAY";
//   }

//   // ❌ Early out OR late out beyond grace
//   if (clockOutMinutes < shiftOut || clockOutMinutes > graceLimit) {
//     return "ANOMALIES";
//   }

//   return status;
// };

const calculateClockOutStatus = (clockOutUTC, workDuration, userShift) => {
  const fullDayMinutes = convertToMinutes(userShift.fullDay); // 540
  const halfDayMinutes = convertToMinutes(userShift.halfDay); // 270
  const graceMinutes = convertToMinutes(userShift.outTimeGrace); // 15

  // Half Day
  if (workDuration < halfDayMinutes) {
    return "HALF_DAY";
  }

  // Full Day with grace
  const minimumFullDay = fullDayMinutes - graceMinutes;

  if (workDuration >= minimumFullDay) {
    return "PRESENT";
  }

  return "ANOMALIES";
};

//Clock in
export const clockIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "User location is required" });
    }

    const distance = getDistanceInMeters(
      latitude,
      longitude,
      OFFICE_LOCATION.latitude,
      OFFICE_LOCATION.longitude
    );

    if (distance > OFFICE_LOCATION.radius) {
      return res.status(403).json({ message: "You are not inside the office" });
    }

    const userShift = await UserExtraDetail.findOne({ userId });

    if (!userShift) {
      return res.status(400).json({ message: "Shift config not set for user" });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const alreadyClockedIn = await Attendance.findOne({
      userId,
      clockInTime: { $gte: todayStart },
    });

    if (alreadyClockedIn) {
      return res.status(400).json({ message: "Already clocked in today" });
    }

    const clockInTimeUTC = new Date();
    // Current month range
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    // Count anomalies this month
    const monthlyAnomalies = await Attendance.countDocuments({
      userId,
      status: "ANOMALIES",
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    const { lateBy, status } = calculateLateAndStatus(clockInTimeUTC, userShift, monthlyAnomalies);

    const attendance = await Attendance.create({
      userId,
      date: todayStart,
      clockInTime: clockInTimeUTC,
      lateBy,
      status,
      clockStatus: "CLOCKED_IN",
      userLocation: { latitude, longitude },
      officeLocation: OFFICE_LOCATION,
    });

    res.status(201).json({
      message: "Clock In successful",
      data: attendance,
      lateBy,
      status,
    });

  } catch (error) {
    console.error("Clock In Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//find today's attendance
export const getTodayAttendance = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();
    const istNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const startOfDay = new Date(istNow);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(istNow);
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      userId,
      clockInTime: { $gte: startOfDay, $lte: endOfDay },
      clockStatus: "CLOCKED_IN",
    });

    return res.status(200).json({
      attendance: attendance || null,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//Clock out
export const getISTNow = () => {
  const IST_OFFSET_MIN = 330;
  const nowUTC = new Date();
  return new Date(nowUTC.getTime() + IST_OFFSET_MIN * 60 * 1000);
};

export const clockOut = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Always work in UTC for DB
    const nowUTC = new Date();

    // 🔒 IST only for business logic / response
    const istNow = getISTNow();

    // ✅ UTC day range (not IST range)
    const startOfDayUTC = new Date(nowUTC);
    startOfDayUTC.setUTCHours(0, 0, 0, 0);

    const endOfDayUTC = new Date(nowUTC);
    endOfDayUTC.setUTCHours(23, 59, 59, 999);

    // 🔍 Find active attendance (UTC safe)
    const attendance = await Attendance.findOne({
      userId,
      clockStatus: "CLOCKED_IN",
      clockInTime: { $gte: startOfDayUTC, $lte: endOfDayUTC },
    });

    if (!attendance) {
      return res.status(400).json({
        message: "No active clock-in found",
      });
    }

    // 🔥 Fetch shift config
    const userShift = await UserExtraDetail.findOne({ userId });

    if (!userShift) {
      return res.status(400).json({
        message: "Shift config not found for user",
      });
    }

    // ⏱ Work duration (UTC based, safe everywhere)
    const workDuration = Math.floor(
      (nowUTC.getTime() - new Date(attendance.clockInTime).getTime()) / (1000 * 60)
    );

    // ✅ Status calculation (business logic uses IST time meaningfully)
    const status = calculateClockOutStatus(istNow, workDuration, userShift);

    // ✅ Save (UTC in DB)
    attendance.clockOutTime = nowUTC;   // store UTC
    attendance.workDuration = workDuration;
    attendance.clockStatus = "CLOCKED_OUT";
    attendance.status = status;

    await attendance.save();

    res.status(200).json({
      message: "Clock out successful",
      workDuration,
      status,
      clockOutTime: istNow, // return IST for UI
    });

  } catch (error) {
    console.error("Clock Out Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//find by date attendance
export const getAttendanceByDate = async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query; // <-- from frontend

    if (!date) {
      return res.status(400).json({
        message: "Date is required",
      });
    }

    // Convert date to IST start/end
    const searchDate = new Date(date);

    const startOfDay = new Date(searchDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(searchDate);
    endOfDay.setHours(23, 59, 59, 999);

    const attendance = await Attendance.findOne({
      userId,
      clockInTime: { $gte: startOfDay, $lte: endOfDay },
    });

    res.status(200).json({
      attendance: attendance || null,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//find all user and their attendance
export const getAdminAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const istDate = new Date(
      new Date(date).toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      })
    );

    const startOfDay = new Date(istDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(istDate);
    endOfDay.setHours(23, 59, 59, 999);

    // LEFT JOIN
    const usersAttendance = await User.aggregate([
      // {
      //   $match: { role: { $ne: "ADMIN" } }, // optional
      // },
      {
        $lookup: {
          from: "attendances",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $gte: ["$clockInTime", startOfDay] },
                    { $lte: ["$clockInTime", endOfDay] },
                  ],
                },
              },
            },
          ],
          as: "attendance",
        },
      },
      {
        $addFields: {
          attendance: { $arrayElemAt: ["$attendance", 0] },
        },
      },
      {
        $project: {
          username: 1,
          email: 1,
          designation: 1,
          profileImage: 1,
          attendance: 1,
        },
      },
    ]);

    return res.status(200).json({
      date,
      totalUsers: usersAttendance.length,
      data: usersAttendance,
    });

  } catch (error) {
    console.error("Admin attendance error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//find all attendance of user by month
const IST_OFFSET_MIN = 330; // 5h 30m

export const createISTDate = (y, m, d, h = 0, min = 0, sec = 0, ms = 0) => {
  // Build UTC then shift to IST
  const utc = Date.UTC(y, m, d, h, min, sec, ms);
  return new Date(utc - IST_OFFSET_MIN * 60 * 1000);
};

export const getISTRangeForMonth = (year, month) => {
  // month = 1–12

  // 1st day 00:00 IST
  const start = createISTDate(year, month - 1, 1, 0, 0, 0, 0);

  // Last day 23:59:59 IST
  const lastDay = new Date(year, month, 0).getDate();
  const end = createISTDate(year, month - 1, lastDay, 23, 59, 59, 999);

  return { start, end };
};

export const toISTKey = (date) => {
  // Convert UTC date → IST date key
  const ist = new Date(date.getTime() + IST_OFFSET_MIN * 60 * 1000);

  return `${ist.getFullYear()}-${String(ist.getMonth() + 1).padStart(2, "0")}-${String(ist.getDate()).padStart(2, "0")}`;
};

export const getMonthlyAttendanceAdmin = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res
        .status(400)
        .json({ message: "Month and year are required" });
    }

    const m = Number(month);
    const y = Number(year);

    const { start, end } = getISTRangeForMonth(y, m);

    const users = await User.find({}, "username email employeeId");

    const attendanceRecords = await Attendance.find({
      date: { $gte: start, $lte: end },
    });

    const holidayRecords = await Holiday.find({
      date: { $gte: start, $lte: end },
    });

    const leaveRecords = await Leave.find({
      status: "Approved",
      $or: [
        {
          startDate: { $gte: start, $lte: end },
        },
        {
          endDate: { $gte: start, $lte: end },
        },
        {
          startDate: { $lte: start },
          endDate: { $gte: end },
        },
      ],
    });

    const todayKey = toISTKey(new Date());

    const daysInMonth = new Date(y, m, 0).getDate();

    const dates = [];

    for (let day = 1; day <= daysInMonth; day++) {
      dates.push(
        `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`
      );
    }

    // --------------------------
    // Holiday Map
    // --------------------------

    const holidayMap = {};

    holidayRecords.forEach((holiday) => {
      holidayMap[toISTKey(new Date(holiday.date))] = holiday;
    });

    // --------------------------
    // Attendance Map
    // attendanceMap[userId][date]
    // --------------------------

    const attendanceMap = {};

    attendanceRecords.forEach((attendance) => {
      const userId = attendance.userId.toString();

      if (!attendanceMap[userId]) attendanceMap[userId] = {};

      attendanceMap[userId][toISTKey(new Date(attendance.date))] = attendance;
    });

    // --------------------------
    // Leave Map
    // leaveMap[userId][date]
    // --------------------------

    const leaveMap = {};

    leaveRecords.forEach((leave) => {
      const userId = leave.user.toString();

      if (!leaveMap[userId]) leaveMap[userId] = {};

      let current = new Date(toISTKey(new Date(leave.startDate)) + "T00:00:00");
      const endDate = new Date(toISTKey(new Date(leave.endDate)) + "T00:00:00");

      while (current <= endDate) {
        leaveMap[userId][toISTKey(current)] = leave;
        current.setDate(current.getDate() + 1);
      }
    });

    const result = users.map((user) => {
      const userAttendance = attendanceMap[user._id.toString()] || {};
      const userLeaves = leaveMap[user._id.toString()] || {};

      const monthlyAttendance = dates.map((date) => {
        const jsDate = new Date(date + "T00:00:00");

        // Future Date
        if (date > todayKey) {
          return {
            date,
            status: "NA",
          };
        }

        // Attendance
        if (userAttendance[date]) {
          return {
            date,
            status: userAttendance[date].status,
          };
        }

        // Leave
        if (userLeaves[date]) {
          return {
            date,
            status: "LEAVE",
            leaveType: userLeaves[date].leaveType,
          };
        }

        // Holiday
        if (holidayMap[date]) {
          return {
            date,
            status: "HOLIDAY",
            holidayTitle: holidayMap[date].title,
            holidayType: holidayMap[date].type,
          };
        }

        // Sunday
        if (jsDate.getDay() === 0) {
          return {
            date,
            status: "SUNDAY",
          };
        }

        // Absent
        return {
          date,
          status: "ABSENT",
        };
      });

      return {
        user,
        monthlyAttendance,
      };
    });

    return res.status(200).json({
      month: m,
      year: y,
      range: { start, end },
      users: result,
    });
  } catch (error) {
    console.error("Monthly Attendance Error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

//for user monthly att
export const getMonthlyAttendanceUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "Month and year are required",
      });
    }

    const m = Number(month);
    const y = Number(year);

    // IST month range
    const { start, end } = getISTRangeForMonth(y, m);

    // Today's IST date key
    const todayKey = toISTKey(new Date());

    // Attendance
    const attendanceRecords = await Attendance.find({
      userId,
      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({ date: 1 });

    // Holidays
    const holidays = await Holiday.find({
      date: {
        $gte: start,
        $lte: end,
      },
    });

    // Approved Leaves
    const approvedLeaves = await Leave.find({
      user: userId,
      status: "Approved",
      $or: [
        {
          startDate: {
            $gte: start,
            $lte: end,
          },
        },
        {
          endDate: {
            $gte: start,
            $lte: end,
          },
        },
        {
          startDate: { $lte: start },
          endDate: { $gte: end },
        },
      ],
    });

    const attendanceMap = {};
    attendanceRecords.forEach((record) => {
      attendanceMap[toISTKey(new Date(record.date))] = record;
    });

    const holidayMap = {};
    holidays.forEach((holiday) => {
      holidayMap[toISTKey(new Date(holiday.date))] = holiday;
    });

    const leaveMap = {};

    approvedLeaves.forEach((leave) => {
      const startKey = toISTKey(new Date(leave.startDate));
      const endKey = toISTKey(new Date(leave.endDate));

      let current = new Date(startKey + "T00:00:00");
      const endDate = new Date(endKey + "T00:00:00");

      while (current <= endDate) {
        const key = toISTKey(current);
        leaveMap[key] = leave;
        current.setDate(current.getDate() + 1);
      }
    });

    const daysInMonth = new Date(y, m, 0).getDate();

    const monthlyAttendance = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const jsDate = new Date(`${dateKey}T00:00:00`);

      // Future Date
      if (dateKey > todayKey) {
        monthlyAttendance.push({
          date: dateKey,
          status: "NA",
          clockInTime: null,
          clockOutTime: null,
          workDuration: 0,
        });
        continue;
      }

      // Attendance
      const attendance = attendanceMap[dateKey];

      if (attendance) {
        monthlyAttendance.push({
          date: dateKey,
          status: attendance.status,
          clockInTime: attendance.clockInTime,
          clockOutTime: attendance.clockOutTime,
          workDuration: attendance.workDuration,
        });
        continue;
      }

      // Approved Leave
      if (leaveMap[dateKey]) {
        monthlyAttendance.push({
          date: dateKey,
          status: "LEAVE",
          leaveType: leaveMap[dateKey].leaveType,
          clockInTime: null,
          clockOutTime: null,
          workDuration: 0,
        });
        continue;
      }

      // Holiday
      if (holidayMap[dateKey]) {
        monthlyAttendance.push({
          date: dateKey,
          status: "HOLIDAY",
          holidayTitle: holidayMap[dateKey].title,
          holidayType: holidayMap[dateKey].type,
          clockInTime: null,
          clockOutTime: null,
          workDuration: 0,
        });
        continue;
      }

      // Sunday
      if (jsDate.getDay() === 0) {
        monthlyAttendance.push({
          date: dateKey,
          status: "SUNDAY",
          clockInTime: null,
          clockOutTime: null,
          workDuration: 0,
        });
        continue;
      }

      // Absent
      monthlyAttendance.push({
        date: dateKey,
        status: "ABSENT",
        clockInTime: null,
        clockOutTime: null,
        workDuration: 0,
      });
    }

    return res.status(200).json({
      month: m,
      year: y,
      monthlyAttendance,
    });
  } catch (error) {
    console.error("User Monthly Attendance Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

//for user monthly att for admin
export const getMonthlyAttendanceByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "Month and year are required",
      });
    }

    const m = Number(month);
    const y = Number(year);

    // IST month range
    const { start, end } = getISTRangeForMonth(y, m);

    // Today's IST date key
    const todayKey = toISTKey(new Date());

    // Attendance
    const attendanceRecords = await Attendance.find({
      userId,
      date: {
        $gte: start,
        $lte: end,
      },
    }).sort({ date: 1 });

    // Holidays
    const holidays = await Holiday.find({
      date: {
        $gte: start,
        $lte: end,
      },
    });

    // Approved Leaves
    const approvedLeaves = await Leave.find({
      user: userId,
      status: "Approved",
      $or: [
        {
          startDate: {
            $gte: start,
            $lte: end,
          },
        },
        {
          endDate: {
            $gte: start,
            $lte: end,
          },
        },
        {
          startDate: { $lte: start },
          endDate: { $gte: end },
        },
      ],
    });

    const attendanceMap = {};
    attendanceRecords.forEach((record) => {
      attendanceMap[toISTKey(new Date(record.date))] = record;
    });

    const holidayMap = {};
    holidays.forEach((holiday) => {
      holidayMap[toISTKey(new Date(holiday.date))] = holiday;
    });

    const leaveMap = {};

    approvedLeaves.forEach((leave) => {
      const startKey = toISTKey(new Date(leave.startDate));
      const endKey = toISTKey(new Date(leave.endDate));

      let current = new Date(startKey + "T00:00:00");
      const endDate = new Date(endKey + "T00:00:00");

      while (current <= endDate) {
        const key = toISTKey(current);
        leaveMap[key] = leave;
        current.setDate(current.getDate() + 1);
      }
    });

    const daysInMonth = new Date(y, m, 0).getDate();

    const monthlyAttendance = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const jsDate = new Date(`${dateKey}T00:00:00`);

      // Future Date
      if (dateKey > todayKey) {
        monthlyAttendance.push({
          date: dateKey,
          status: "NA",
          clockInTime: null,
          clockOutTime: null,
          workDuration: 0,
        });
        continue;
      }

      // Attendance
      const attendance = attendanceMap[dateKey];

      if (attendance) {
        monthlyAttendance.push({
          date: dateKey,
          status: attendance.status,
          clockInTime: attendance.clockInTime,
          clockOutTime: attendance.clockOutTime,
          workDuration: attendance.workDuration,
        });
        continue;
      }

      // Approved Leave
      if (leaveMap[dateKey]) {
        monthlyAttendance.push({
          date: dateKey,
          status: "LEAVE",
          leaveType: leaveMap[dateKey].leaveType,
          clockInTime: null,
          clockOutTime: null,
          workDuration: 0,
        });
        continue;
      }

      // Holiday
      if (holidayMap[dateKey]) {
        monthlyAttendance.push({
          date: dateKey,
          status: "HOLIDAY",
          holidayTitle: holidayMap[dateKey].title,
          holidayType: holidayMap[dateKey].type,
          clockInTime: null,
          clockOutTime: null,
          workDuration: 0,
        });
        continue;
      }

      // Sunday
      if (jsDate.getDay() === 0) {
        monthlyAttendance.push({
          date: dateKey,
          status: "SUNDAY",
          clockInTime: null,
          clockOutTime: null,
          workDuration: 0,
        });
        continue;
      }

      // Absent
      monthlyAttendance.push({
        date: dateKey,
        status: "ABSENT",
        clockInTime: null,
        clockOutTime: null,
        workDuration: 0,
      });
    }

    return res.status(200).json({
      month: m,
      year: y,
      monthlyAttendance,
    });
  } catch (error) {
    console.error("User Monthly Attendance Error:", error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

//edit Status
export const updateAttendanceStatus = async (req, res) => {
  try {
    const { userId, status, clockInTime, clockOutTime, id } = req.body;
    const actionBy = req.user.id;
    let attendance;

    if (id) {
      attendance = await Attendance.findById(id);
    }

    if (!attendance) {
      const userShift = await UserExtraDetail.findOne({ userId });
      let lateBy = 0;
      let finalStatus = status || "PRESENT";
      if (clockInTime && userShift) {
        const result = calculateLateAndStatus(new Date(clockInTime), userShift);
        lateBy = result.lateBy;
        finalStatus = result.status;
      }
      const today = new Date(clockInTime || new Date());
      today.setHours(0, 0, 0, 0);
      attendance = await Attendance.create({
        userId,
        date: today,
        status: finalStatus,
        clockInTime,
        clockOutTime,
        lateBy,
        clockStatus: "CLOCKED_IN",
      });

    } else {
      const userShift = await UserExtraDetail.findOne({
        userId: attendance.userId,
      });

      let lateBy = attendance.lateBy;
      if (clockInTime && userShift) {
        const result = calculateLateAndStatus(new Date(clockInTime), userShift);
        lateBy = result.lateBy;
      }

      attendance.status = status || attendance.status;
      attendance.clockInTime = clockInTime || attendance.clockInTime;
      attendance.clockOutTime = clockOutTime || attendance.clockOutTime;
      attendance.lateBy = lateBy;
      await attendance.save();
    }

    const employee = await User.findById(attendance.userId);
    const actionUser = await User.findById(actionBy);
    const admins = await User.find({
      role: { $in: ["Admin", "Sub Admin"] },
      officialEmail: { $exists: true, $ne: "" },
    });

    const adminEmails = admins.map(admin => admin.officialEmail);

    if (adminEmails.length) {
      await mailTransporter.sendMail({
        from: `"HRMS Portal" <${process.env.MAIL_USER}>`,
        to: adminEmails.join(","),
        subject: `Attendance Updated - ${employee.username}`,
        html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
            <h2 style="color:#2563eb">
                Attendance Updated
            </h2>

            <p>An attendance record has been ${id ? "updated" : "created"}.</p>
            <table style="border-collapse:collapse;width:100%;margin-top:20px">
                <tr>
                    <td style="border:1px solid #ddd;padding:8px"><b>Employee</b></td>
                    <td style="border:1px solid #ddd;padding:8px">${employee.username}</td>
                </tr>

                <tr>
                    <td style="border:1px solid #ddd;padding:8px"><b>Email</b></td>
                    <td style="border:1px solid #ddd;padding:8px">${employee.officialEmail || "-"}</td>
                </tr>

                <tr>
                    <td style="border:1px solid #ddd;padding:8px"><b>Date</b></td>
                    <td style="border:1px solid #ddd;padding:8px">
                        ${attendance.date.toISOString().split("T")[0]}
                    </td>
                </tr>

                <tr>
                    <td style="border:1px solid #ddd;padding:8px"><b>Status</b></td>
                    <td style="border:1px solid #ddd;padding:8px">${attendance.status}</td>
                </tr>

                <tr>
                    <td style="border:1px solid #ddd;padding:8px"><b>Clock In</b></td>
                    <td style="border:1px solid #ddd;padding:8px">
                        ${attendance.clockInTime ? new Date(attendance.clockInTime).toLocaleString() : "-"}
                    </td>
                </tr>

                <tr>
                    <td style="border:1px solid #ddd;padding:8px"><b>Clock Out</b></td>
                    <td style="border:1px solid #ddd;padding:8px">
                        ${attendance.clockOutTime ? new Date(attendance.clockOutTime).toLocaleString() : "-"}
                    </td>
                </tr>

                <tr>
                    <td style="border:1px solid #ddd;padding:8px"><b>Late By</b></td>
                    <td style="border:1px solid #ddd;padding:8px">
                        ${attendance.lateBy || 0} minutes
                    </td>
                </tr>

                <tr>
                    <td style="border:1px solid #ddd;padding:8px">
                    <b>Updated By</b>
                    </td>
                    <td style="border:1px solid #ddd;padding:8px">
                    ${actionUser?.username || "-"}
                    </td>
                </tr>
            </table>
        </div>
        `,
      });
    }

    res.status(200).json({
      message: "Attendance saved successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("Attendance update error:", error);
    res.status(500).json({ message: "Failed to update attendance" });
  }
};