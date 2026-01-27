
import express from 'express';
import userRoutes from './userRoutes.js'
import { signup, login, getUserById, getAllUsers, addNewUser, updateUserById } from '../controllers/authController.js';
import { applyLeave, getAllLeave, getLeaveByUser, updateLeaveStatus, updateUserLeave } from '../controllers/leaveController.js';
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
router.use('/user', userRoutes)
export default router;
