
import express from 'express';
import userRoutes from './userRoutes.js'
import { signup, login, getUserById, getAllUsers, addNewUser, updateUserById } from '../controllers/authController.js';
const router = express.Router();

router.post('/signup', signup);
router.post('/newUser', addNewUser);
router.post('/login', login);
router.get("/user/:id", getUserById);
router.get("/users", getAllUsers);
router.patch("/user/:id", updateUserById);
router.use('/user', userRoutes)
export default router;
