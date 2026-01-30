import { Attendance } from '../models/Attendance.js';
import { User } from '../models/User.js';

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

const OFFICE_START_TIME = "09:30";
const ANOMALY_TIME = "10:00";

const isAnomaly = (clockInTime) => {
  const [h, m] = ANOMALY_TIME.split(":");
  const anomalyTime = new Date(clockInTime);
  anomalyTime.setHours(h, m, 0, 0);

  return clockInTime > anomalyTime;
};

const calculateLateMinutes = (clockInTime) => {
  const [h, m] = OFFICE_START_TIME.split(":");

  const officeTime = new Date(clockInTime);
  officeTime.setHours(h, m, 0, 0);

  const diff = clockInTime - officeTime;
  return diff > 0 ? Math.floor(diff / (1000 * 60)) : 0;
};

//Clock in
export const clockIn = async (req, res) => {
  try {
    const { userId } = req.params;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "User location is required",
      });
    }

    const distance = getDistanceInMeters(
      latitude,
      longitude,
      OFFICE_LOCATION.latitude,
      OFFICE_LOCATION.longitude
    );

    if (distance > OFFICE_LOCATION.radius) {
      return res.status(403).json({
        message: "You are not inside the office location",
      });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const alreadyClockedIn = await Attendance.findOne({
      userId,
      clockInTime: { $gte: todayStart },
    });

    if (alreadyClockedIn) {
      return res.status(400).json({
        message: "You have already clocked in today",
      });
    }

    const clockInTime = new Date();
    const lateBy = calculateLateMinutes(clockInTime);
    let status = "PRESENT";
    if (isAnomaly(clockInTime)) {
      status = "ANOMALIES";
    }

    const attendance = await Attendance.create({
      userId,
      date: todayStart,
      clockInTime,
      lateBy,
      status,
      clockStatus: "CLOCKED_IN",
      userLocation: {
        latitude,
        longitude,
      },

      officeLocation: {
        latitude: OFFICE_LOCATION.latitude,
        longitude: OFFICE_LOCATION.longitude,
        radius: OFFICE_LOCATION.radius,
      },
    });

    res.status(201).json({
      message: "Clock In successful",
      data: attendance,
    });
  } catch (error) {
    console.error("Clock In Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

//find today's attendance
export const getTodayAttendance = async (req, res) => {
  try {
    const { userId } = req.params;

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
export const clockOut = async (req, res) => {
  try {
    const { userId } = req.params;

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
      clockStatus: "CLOCKED_IN",
      clockInTime: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!attendance) {
      return res.status(400).json({
        message: "No active clock-in found",
      });
    }

    const workDuration = Math.floor(
      (istNow - attendance.clockInTime) / (1000 * 60)
    );

    attendance.clockOutTime = istNow;
    attendance.workDuration = workDuration;
    attendance.clockStatus = "CLOCKED_OUT";

    await attendance.save();

    res.status(200).json({
      message: "Clock out successful",
      workDuration,
    });

  } catch (error) {
    console.error(error);
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
export const getMonthlyAttendanceAdmin = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "Month and year are required",
      });
    }

    // Month: 1–12 (from frontend)
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

    // 1️⃣ Get all users
    const users = await User.find({}, "username email employeeId");

    // 2️⃣ Get all attendance for that month
    const attendanceRecords = await Attendance.find({
      // date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    // 3️⃣ Create date list of month
    const daysInMonth = new Date(year, month, 0).getDate();
    const dates = Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(year, month - 1, i + 1);
      d.setHours(0, 0, 0, 0);
      return d.toISOString().split("T")[0];
    });

    // console.log(attendanceRecords, "llll");
    // 4️⃣ Map attendance user-wise
    const result = users.map((user) => {
      const userAttendance = attendanceRecords.filter(
        (a) => a.userId.toString() === user._id.toString()
      );

      const attendanceMap = {};

      userAttendance.forEach((a) => {
        const key = a.date.toISOString().split("T")[0];
        attendanceMap[key] = a;
      });

      const monthlyAttendance = dates.map((date) => {
        const record = attendanceMap[date];
        // console.log(date, record);
        if (!record) {
          return {
            date,
            status: "ABSENT",
          };
        }

        return {
          date,
          status: record.status,
          clockInTime: record.clockInTime,
          clockOutTime: record.clockOutTime,
          workDuration: record.workDuration,
          lateBy: record.lateBy,
        };
      });
      // console.log(user);
      return {
        user,
        monthlyAttendance,
      };
    });

    res.status(200).json({
      month,
      year,
      users: result,
    });

  } catch (error) {
    console.error("Monthly Attendance Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
