
import express from 'express';
import userRoutes from './userRoutes.js'
import { signup, login, getUserById, getAllUsers, addNewUser, updateUserById } from '../controllers/authController.js';
import { applyLeave, getAllLeave, getLeaveByUser, updateLeaveStatus, updateUserLeave } from '../controllers/leaveController.js';
import documentRoutes from "./documentRoutes.js";
import { clockIn, clockOut, getAdminAttendanceByDate, getAttendanceByDate, getMonthlyAttendanceAdmin, getTodayAttendance } from '../controllers/attendanceController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/newUser', addNewUser);
router.post('/login', login);
router.get("/user/:id", getUserById);
router.get("/users", getAllUsers);
router.patch("/user/:id", updateUserById);
router.post("/applyLeave", applyLeave);
router.get("/allLeave", getAllLeave);
router.get("/userLeave/:user", getLeaveByUser);
router.patch("/leaveStatus/:id", updateLeaveStatus);
router.patch("/editLeave/:id", updateUserLeave);
router.use("/api", documentRoutes);
router.post("/clock-in/:userId", clockIn);
router.get("/attendance/today/:userId", getTodayAttendance);
router.get("/attendanceByDate/:userId", getAttendanceByDate);
router.post("/clock-out/:userId", clockOut);
router.get("/allUserAttendance/byDate", getAdminAttendanceByDate);
router.get("/admin/attendance/month", getMonthlyAttendanceAdmin);
router.use('/user', userRoutes)
export default router;
