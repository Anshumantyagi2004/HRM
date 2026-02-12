import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { signup, login, logout, getUserById, getAllUsers, addNewUser, updateUserById, educationUserById, getEducationByUser, workUserById, getWorkByUser, workHistoryUserById, updateUserByAdmin, getUserByAdmin, educationUserByAdmin, getEducationByAdmin, workUserByAdmin, getWorkByAdmin, workHistoryUserByAdmin, rulesById, getRuleById, rulesByAdmin, getRuleByAdmin } from '../controllers/authController.js';
import { applyLeave, getAllLeave, getLeaveByUser, updateLeaveStatus, updateUserLeave } from '../controllers/leaveController.js';
import documentRoutes from "./documentRoutes.js";
import { clockIn, clockOut, getAdminAttendanceByDate, getAttendanceByDate, getMonthlyAttendanceAdmin, getTodayAttendance } from '../controllers/attendanceController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/newUser', addNewUser);
router.post('/login', login);
router.post("/logout", logout);
router.get("/user", authenticateJWT, getUserById);
router.get("/userById/:id", getUserByAdmin);// for Admin
router.get("/users", getAllUsers);
router.patch("/user", authenticateJWT, updateUserById);
router.patch("/user/:id", updateUserByAdmin); //for admin
router.post("/userEducation", authenticateJWT, educationUserById);
router.get("/userEducation", authenticateJWT, getEducationByUser);
router.post("/userEducationAdd/:id", educationUserByAdmin); //for admin
router.get("/userEducationGet/:id", getEducationByAdmin); //for Admin
router.patch("/userWork", authenticateJWT, workUserById);
router.get("/userWork", authenticateJWT, getWorkByUser);
router.patch("/userRules", authenticateJWT, rulesById);
router.get("/userRules", authenticateJWT, getRuleById);
router.patch("/userRules/:id", authenticateJWT, rulesByAdmin); //for Admin
router.get("/userRules/:id", authenticateJWT, getRuleByAdmin); //For Admin
router.post("/userWorkHistory", authenticateJWT, workHistoryUserById);
router.patch("/userWorkByAdmin/:id", workUserByAdmin); //for admin
router.get("/userWorkByAdmin/:id", getWorkByAdmin);//for admin
router.post("/userWorkHistoryByAdmin/:id", workHistoryUserByAdmin);//for admin
router.post("/applyLeave", applyLeave);
router.get("/allLeave", getAllLeave);
router.get("/userLeave/:user", getLeaveByUser);
router.patch("/leaveStatus/:id", updateLeaveStatus);
router.patch("/editLeave/:id", updateUserLeave);
router.use("/api", authenticateJWT, documentRoutes);
router.post("/clock-in", authenticateJWT, clockIn);
router.get("/attendance/today", authenticateJWT, getTodayAttendance);
router.get("/attendanceByDate/:userId", getAttendanceByDate);
router.post("/clock-out", authenticateJWT, clockOut);
router.get("/allUserAttendance/byDate", getAdminAttendanceByDate);
router.get("/admin/attendance/month", getMonthlyAttendanceAdmin);
export default router;
