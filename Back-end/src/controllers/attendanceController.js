import { Attendance } from '../models/Attendance.js';
import { User } from '../models/User.js';
import { UserExtraDetail } from "../models/UserExtraDetails.js";

const OFFICE_LOCATION = {
  latitude: 28.69865783085182,
  longitude: 77.11480389734629,
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

const calculateLateAndStatus = (clockInUTC, userShift) => {
  const clockInMinutes = getISTMinutes(clockInUTC);

  const shiftStart = convertToMinutes(userShift.shiftStartTime); // "09:30"
  const graceMinutes = convertToMinutes(userShift.inTimeGrace); // "00:15" → 15

  const graceLimit = shiftStart + graceMinutes; // 09:45

  let lateBy = 0;
  let status = "PRESENT";

  // ❌ Beyond grace → ANOMALIES + lateBy starts after grace
  if (clockInMinutes > graceLimit) {
    status = "ANOMALIES";
    lateBy = clockInMinutes - graceLimit; // 🔥 smart late count
  } else {
    // ✅ Within grace → PRESENT + no late
    status = "PRESENT";
    lateBy = 0;
  }

  return { lateBy, status };
};

const calculateClockOutStatus = (clockOutUTC, workDuration, userShift) => {
  const clockOutMinutes = getISTMinutes(clockOutUTC);

  const shiftOut = convertToMinutes(userShift.shiftOutTime);   // "18:30"
  const outGrace = convertToMinutes(userShift.outTimeGrace);  // "00:15"
  const graceLimit = shiftOut + outGrace;                      // 18:45

  const halfDayMinutes = convertToMinutes(userShift.halfDay); // "04:30" → 270

  let status = "PRESENT";

  // 🌓 Half Day Rule
  if (workDuration < halfDayMinutes) {
    return "HALF_DAY";
  }

  // ❌ Early out OR late out beyond grace
  if (clockOutMinutes < shiftOut || clockOutMinutes > graceLimit) {
    return "ANOMALIES";
  }

  return status;
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
    const { lateBy, status } = calculateLateAndStatus(clockInTimeUTC, userShift);

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
      return res.status(400).json({ message: "Month and year are required" });
    }

    const m = Number(month); // 1-12
    const y = Number(year);

    // 🔒 Timezone-locked IST range
    const { start, end } = getISTRangeForMonth(y, m);

    const users = await User.find({}, "username email employeeId");

    const attendanceRecords = await Attendance.find({
      date: { $gte: start, $lte: end },
    });

    const daysInMonth = new Date(y, m, 0).getDate();

    const dates = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      dates.push(key);
    }

    const result = users.map((user) => {
      const userAttendance = attendanceRecords.filter(
        (a) => a.userId.toString() === user._id.toString()
      );

      const attendanceMap = {};

      userAttendance.forEach((a) => {
        const key = toISTKey(new Date(a.date));
        attendanceMap[key] = a;
      });

      const monthlyAttendance = dates.map((date) => {
        const record = attendanceMap[date];
        if (!record) return { date, status: "ABSENT" };
        return { date, status: record.status };
      });

      return { user, monthlyAttendance };
    });

    res.status(200).json({
      month: m,
      year: y,
      range: { start, end },
      users: result,
    });

  } catch (error) {
    console.error("Monthly Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//for user monthly att
export const getMonthlyAttendanceUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year are required" });
    }

    const m = Number(month); // 1-12
    const y = Number(year);

    // 🔒 IST-locked range
    const { start, end } = getISTRangeForMonth(y, m);

    const records = await Attendance.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: 1 });

    const daysInMonth = new Date(y, m, 0).getDate();

    // Generate IST calendar days
    const dates = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${y}-${String(m).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      dates.push(key);
    }

    const attendanceMap = {};
    records.forEach((r) => {
      const key = toISTKey(new Date(r.date));
      attendanceMap[key] = r;
    });

    const monthlyAttendance = dates.map((date) => {
      const record = attendanceMap[date];

      if (!record) {
        return {
          date,
          status: "ABSENT",
          clockInTime: null,
          clockOutTime: null,
          workDuration: 0,
        };
      }

      return {
        date,
        status: record.status,
        clockInTime: record.clockInTime,
        clockOutTime: record.clockOutTime,
        workDuration: record.workDuration,
      };
    });

    res.status(200).json({
      month: m,
      year: y,
      range: { start, end },
      monthlyAttendance,
    });

  } catch (error) {
    console.error("User Monthly Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};