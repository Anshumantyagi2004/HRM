import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

// Signup
export const signup = async (req, res) => {
  const { username, email, password, role, contact } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPassword, role, contact });
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ result: user, token });
  } catch (error) {
    console.log("err", error);
    res.status(500).json({ message: 'Something went wrong', err: error });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ result: user, token });

  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//find user
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//find All user
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

//Add new user
export const addNewUser = async (req, res) => {
  const { username, email, password, role, contact, designation } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User Mail already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPassword, role, contact, designation });
    await user.save();

    // const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ result: user });
  } catch (error) {
    console.log("err", error);
    res.status(500).json({ message: 'Something went wrong', err: error });
  }
};

//update user
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fields allowed to update
    const updateData = {
      username: req.body.username,
      dob: req.body.dob,
      gender: req.body.gender,
      bloodGroup: req.body.bloodGroup,
      maritalStatus: req.body.maritalStatus,
      email: req.body.email,
      officialEmail: req.body.officialEmail,
      contact: req.body.contact,
      altContact: req.body.altContact,
      address: req.body.address,
      permanentAddress: req.body.permanentAddress,
    };

    // Remove undefined fields (very important)
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        new: true,        // return updated document
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

    // Duplicate email handling
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
