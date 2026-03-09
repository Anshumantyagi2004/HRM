import express from 'express';
import { authenticateJWT } from '../middleware/authMiddleware.js';
import { sendLoginOTP, verifyLoginOTP, signup, login, logout, getUserById, getAllUsers, addNewUser, updateUserById, educationUserById, getEducationByUser, workUserById, getWorkByUser, workHistoryUserById, updateUserByAdmin, getUserByAdmin, educationUserByAdmin, getEducationByAdmin, workUserByAdmin, getWorkByAdmin, workHistoryUserByAdmin, rulesById, getRuleById, rulesByAdmin, getRuleByAdmin, addOrUpdatePayroll, getUserPayroll, addOrUpdatePayrollByAdmin, getUserPayrollByAdmin, getAllUsersPayroll, findUserPayroll, getAllUsersLeave } from '../controllers/authController.js';
import { applyLeave, getAllLeave, getLeaveByUser, updateLeaveStatus, updateUserLeave } from '../controllers/leaveController.js';
import documentRoutes from "./documentRoutes.js";
import { clockIn, clockOut, getAdminAttendanceByDate, getAttendanceByDate, getMonthlyAttendanceAdmin, getMonthlyAttendanceUser, getTodayAttendance } from '../controllers/attendanceController.js';
import { addRules, getAllInfo } from '../controllers/CompanyController.js';
import { sendPolicyOTP, verifyOtpAndSignPolicy } from '../controllers/policyOtpController.js';
import { addHoliday, getHolidays, updateHoliday, deleteHoliday, } from "../controllers/holidayController.js";
import { getDashboardCalendar } from '../controllers/dashboardController.js';
import { adminSendNotification, deleteNotification, getUnreadCount, getUserNotifications, markAllAsRead, markAsRead } from '../controllers/notificationController.js';

const router = express.Router();

// RESIGTER API
router.post('/signup', signup);
router.post('/newUser', addNewUser);
router.post('/login', login);
router.post("/logout", logout);
router.post("/send-otp", sendLoginOTP);
router.post("/verify-otp", verifyLoginOTP);

// USER API
router.get("/user", authenticateJWT, getUserById);
router.get("/users", getAllUsers);
router.patch("/user", authenticateJWT, updateUserById);
router.get("/userById/:id", getUserByAdmin);// for Admin
router.patch("/user/:id", updateUserByAdmin); //for admin

// USER EDUCATION
router.post("/userEducation", authenticateJWT, educationUserById);
router.get("/userEducation", authenticateJWT, getEducationByUser);
router.post("/userEducationAdd/:id", educationUserByAdmin); //for admin
router.get("/userEducationGet/:id", getEducationByAdmin); //for Admin

// USER WORK
router.patch("/userWork", authenticateJWT, workUserById);
router.get("/userWork", authenticateJWT, getWorkByUser);
router.post("/userWorkHistory", authenticateJWT, workHistoryUserById);
router.patch("/userWorkByAdmin/:id", workUserByAdmin); //for admin
router.get("/userWorkByAdmin/:id", getWorkByAdmin);//for admin
router.post("/userWorkHistoryByAdmin/:id", workHistoryUserByAdmin);//for admin

// USER RULES
router.post("/addRules", authenticateJWT, addRules);
router.get("/getRules", authenticateJWT, getAllInfo);
router.patch("/userRules", authenticateJWT, rulesById);
router.get("/userRules", authenticateJWT, getRuleById);
router.patch("/userRules/:id", authenticateJWT, rulesByAdmin); //for Admin
router.get("/userRules/:id", authenticateJWT, getRuleByAdmin); //For Admin

// LEAVE
router.post("/applyLeave", authenticateJWT, applyLeave);
router.get("/allLeave", getAllLeave);
router.get("/allUserLeaveInfo", getAllUsersLeave);
router.get("/userLeave", authenticateJWT, getLeaveByUser);
router.patch("/leaveStatus/:id", updateLeaveStatus);
router.patch("/editLeave/:id", updateUserLeave);

// DOCS 
router.use("/api", authenticateJWT, documentRoutes);

// ATTENDANCE
router.post("/clock-in", authenticateJWT, clockIn);
router.get("/attendance/today", authenticateJWT, getTodayAttendance);
router.get("/attendanceByDate/:userId", getAttendanceByDate);
router.post("/clock-out", authenticateJWT, clockOut);
router.get("/allUserAttendance/byDate", getAdminAttendanceByDate);
router.get("/admin/attendance/month", getMonthlyAttendanceAdmin);
router.get("/attendance/monthly", authenticateJWT, getMonthlyAttendanceUser);

// PAYROLL
router.patch("/userPayroll", authenticateJWT, addOrUpdatePayroll);
router.get("/userPayroll", authenticateJWT, getUserPayroll);
router.patch("/userPayroll/:id", authenticateJWT, addOrUpdatePayrollByAdmin);
router.get("/userPayroll/:id", authenticateJWT, getUserPayrollByAdmin);
router.get("/allUserPayroll", authenticateJWT, getAllUsersPayroll);
router.get("/UserPayDetail", authenticateJWT, findUserPayroll);

// POLICY API
router.post("/send", authenticateJWT, sendPolicyOTP);
router.post("/verifyOtp", authenticateJWT, verifyOtpAndSignPolicy);

// Holiday
router.post("/holidays", authenticateJWT, addHoliday);
router.get("/holidays", authenticateJWT, getHolidays);
router.put("/holidays/:id", authenticateJWT, updateHoliday);
router.delete("/holidays/:id", authenticateJWT, deleteHoliday);

// Dashboard
router.get("/calendar", authenticateJWT, getDashboardCalendar);

//Notification
router.get("/notifications", authenticateJWT,getUserNotifications);
router.get("/notifications/unread-count",authenticateJWT, getUnreadCount);
router.patch("/notifications/read/:id", markAsRead);
router.patch("/notifications/read-all", markAllAsRead);
router.delete("/notifications/:id", deleteNotification);
router.post("/notifications/admin-send", adminSendNotification);

export default router;
