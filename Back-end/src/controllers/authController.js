import { User } from '../models/User.js';
import { UserEducation } from '../models/UserEdu.js';
import { UserWork } from '../models/UserWork.js';
import { UserExtraDetail } from '../models/UserExtraDetails.js';
import { UserPayroll } from '../models/UserPayroll.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

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

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🍪 SET COOKIE
    res.cookie("token", token, {
      httpOnly: true,      // cannot be accessed by JS
      secure: false,       // true in production (HTTPS)
      sameSite: "strict",  // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      // httpOnly: true,
      // secure: true,        // ✅ required on HTTPS (Vercel)
      // sameSite: "none",    // ✅ allow cross-site cookies
      // maxAge: 24 * 60 * 60 * 1000,
      // path: "/"
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: user._id,
        username: user.username,
        // email: user.email,
        role: user.role,
      },
    });
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
    // console.log("Found user:", user);

    if (!user) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,        // 🔥 REQUIRED
      sameSite: "none",    // 🔥 REQUIRED
      path: "/",
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//logout
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,   // true in prod
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

//find user
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//find user
export const getUserByAdmin = async (req, res) => {
  const id = req.params.id
  try {
    const user = await User.findById(id).select("-password");
    // console.log(user, id, req.params.id)
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
    const users = await User.aggregate([
      {
        $lookup: {
          from: "userworks",
          localField: "_id",
          foreignField: "userWorkId",
          as: "userWork"
        }
      },
      { $unwind: { path: "$userWork", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "users",
          let: { managerId: "$userWork.managerId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$managerId"] } } },
            { $project: { username: 1, email: 1 } }
          ],
          as: "manager"
        }
      },
      { $unwind: { path: "$manager", preserveNullAndEmptyArrays: true } },

      {
        $addFields: {
          "userWork.manager": "$manager"
        }
      },

      {
        $project: {
          password: 0,
          manager: 0
        }
      },

      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};

//Add new user
export const addNewUser = async (req, res) => {
  const { username, email, password, role, contact } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User Mail already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ username, email, password: hashedPassword, role, contact });
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
    const id = req.user.id;

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

//update user
export const updateUserByAdmin = async (req, res) => {
  try {
    const id = req.params.id;

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

//add education
export const educationUserById = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      qualificationType,
      courseName,
      courseType,
      stream,
      courseStartDate,
      courseEndDate,
      collegeName,
      universityName,
    } = req.body;

    const education = new UserEducation({
      userEduId: userId,
      qualificationType,
      courseName,
      courseType,
      stream,
      courseStartDate,
      courseEndDate,
      collegeName,
      universityName,
    });

    const savedEducation = await education.save();

    res.status(201).json({
      success: true,
      message: "Education added successfully",
      education: savedEducation,
    });

  } catch (error) {
    console.error("Education save error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//get Edu
export const getEducationByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const educationList = await UserEducation.find({ userEduId: userId });

    res.status(200).json({
      success: true,
      data: educationList,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch education" });
  }
};

//add education
export const educationUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      qualificationType,
      courseName,
      courseType,
      stream,
      courseStartDate,
      courseEndDate,
      collegeName,
      universityName,
    } = req.body;

    const education = new UserEducation({
      userEduId: userId,
      qualificationType,
      courseName,
      courseType,
      stream,
      courseStartDate,
      courseEndDate,
      collegeName,
      universityName,
    });

    const savedEducation = await education.save();

    res.status(201).json({
      success: true,
      message: "Education added successfully",
      education: savedEducation,
    });

  } catch (error) {
    console.error("Education save error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//get Edu
export const getEducationByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    const educationList = await UserEducation.find({ userEduId: userId });

    res.status(200).json({
      success: true,
      data: educationList,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch education" });
  }
};

//add work
export const workUserById = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = {};

    const fields = [
      "empId",
      "joiningDate",
      "empType",
      "workLocation",
      "designation",
      "department",
      "subDepartment",
      "workExperince",
      "managerId",
    ];

    fields.forEach((field) => {
      if (
        req.body[field] !== undefined &&
        req.body[field] !== null &&
        req.body[field] !== ""
      ) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided",
      });
    }

    updateData.userWorkId = userId;

    const work = await UserWork.findOneAndUpdate(
      { userWorkId: userId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Work data saved successfully",
      work,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//get work
export const getWorkByUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const workList = await UserWork.find({ userWorkId: userId }).populate("managerId", "username email");

    res.status(200).json({
      success: true,
      data: workList,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch education" });
  }
};

//add work history
export const workHistoryUserById = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      department,
      designation,
      from,
      to,
      orgName,
      orgLocation,
    } = req.body;

    // validation
    if (!department || !designation || !from || !orgName) {
      return res.status(400).json({
        message: "department, designation, from, orgName are required",
      });
    }

    const historyItem = {
      department,
      designation,
      from,
      to,
      orgName,
      orgLocation,
    };

    let userWork = await UserWork.findOne({ userWorkId: userId });

    if (!userWork) {
      // create base doc if not exists
      userWork = new UserWork({
        userWorkId: userId,
        workHistory: [historyItem],
      });
    } else {
      userWork.workHistory.push(historyItem);
    }

    const saved = await userWork.save();

    res.status(201).json({
      success: true,
      message: "Work history added successfully",
      history: saved.workHistory,
    });

  } catch (error) {
    console.error("Add history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add work history",
      error: error.message,
    });
  }
};

//add work by admin
export const workUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = {};

    const fields = [
      "empId",
      "joiningDate",
      "empType",
      "workLocation",
      "designation",
      "department",
      "subDepartment",
      "workExperince",
      "managerId"
    ];

    fields.forEach((field) => {
      if (
        req.body[field] !== undefined &&
        req.body[field] !== null &&
        req.body[field] !== ""
      ) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided",
      });
    }

    updateData.userWorkId = userId;

    const work = await UserWork.findOneAndUpdate(
      { userWorkId: userId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Work data saved successfully",
      work,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//get work by admin
export const getWorkByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    const workList = await UserWork.find({ userWorkId: userId }).populate("managerId", "username email");;

    res.status(200).json({
      success: true,
      data: workList,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch" });
  }
};

//add work history by admin
export const workHistoryUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    const {
      department,
      designation,
      from,
      to,
      orgName,
      orgLocation,
    } = req.body;

    // validation
    if (!department || !designation || !from || !orgName) {
      return res.status(400).json({
        message: "department, designation, from, orgName are required",
      });
    }

    const historyItem = {
      department,
      designation,
      from,
      to,
      orgName,
      orgLocation,
    };

    let userWork = await UserWork.findOne({ userWorkId: userId });

    if (!userWork) {
      // create base doc if not exists
      userWork = new UserWork({
        userWorkId: userId,
        workHistory: [historyItem],
      });
    } else {
      userWork.workHistory.push(historyItem);
    }

    const saved = await userWork.save();

    res.status(201).json({
      success: true,
      message: "Work history added successfully",
      history: saved.workHistory,
    });

  } catch (error) {
    console.error("Add history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add work history",
      error: error.message,
    });
  }
};

//Add Rules
export const rulesById = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = {};
    const existing = await UserExtraDetail.findOne({ userId });
    const fields = [
      "shiftStartTime",
      "shiftOutTime",
      "inTimeGrace",
      "outTimeGrace",
      "fullDay",
      "halfDay",
      "casualLeave",
      "sickLeave",
      "lossOfPay",
      "compOff",
    ];

    fields.forEach((field) => {
      if (
        req.body[field] !== undefined &&
        req.body[field] !== null &&
        req.body[field] !== ""
      ) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided",
      });
    }

    updateData.userId = userId;

    if (req.body.casualLeave !== undefined) {
      const newTotal = Number(req.body.casualLeave) || 0;
      const oldTotal = existing?.casualLeave || 0;
      const oldRemaining = existing?.casualLeaveRemaining || 0;

      const diff = newTotal - oldTotal;

      updateData.casualLeave = newTotal;
      updateData.casualLeaveRemaining = Math.max(oldRemaining + diff, 0);
    }

    // Sick Leave
    if (req.body.sickLeave !== undefined) {
      const newTotal = Number(req.body.sickLeave) || 0;
      const oldTotal = existing?.sickLeave || 0;
      const oldRemaining = existing?.sickLeaveRemaining || 0;

      const diff = newTotal - oldTotal;

      updateData.sickLeave = newTotal;
      updateData.sickLeaveRemaining = Math.max(oldRemaining + diff, 0);
    }

    const rules = await UserExtraDetail.findOneAndUpdate(
      { userId: userId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Rules data saved successfully",
      rules,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//Find Rule
export const getRuleById = async (req, res) => {
  try {
    const userId = req.user.id;

    const rules = await UserExtraDetail.findOne({ userId });
    console.log(userId, rules);

    if (!rules) {
      return res.status(404).json({ message: "not found" });
    }

    res.status(200).json(rules);

  } catch (error) {
    console.log("Get user error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//Add Rules ByAdmin
export const rulesByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = {};
    const existing = await UserExtraDetail.findOne({ userId });
    const fields = [
      "shiftStartTime",
      "shiftOutTime",
      "inTimeGrace",
      "outTimeGrace",
      "fullDay",
      "halfDay",
      "casualLeave",
      "sickLeave",
      "lossOfPay",
      "compOff",
    ];

    fields.forEach((field) => {
      if (
        req.body[field] !== undefined &&
        req.body[field] !== null &&
        req.body[field] !== ""
      ) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided",
      });
    }

    updateData.userId = userId;

    if (req.body.casualLeave !== undefined) {
      const newTotal = Number(req.body.casualLeave) || 0;
      const oldTotal = existing?.casualLeave || 0;
      const oldRemaining = existing?.casualLeaveRemaining || 0;

      const diff = newTotal - oldTotal;

      updateData.casualLeave = newTotal;
      updateData.casualLeaveRemaining = Math.max(oldRemaining + diff, 0);
    }

    // Sick Leave
    if (req.body.sickLeave !== undefined) {
      const newTotal = Number(req.body.sickLeave) || 0;
      const oldTotal = existing?.sickLeave || 0;
      const oldRemaining = existing?.sickLeaveRemaining || 0;

      const diff = newTotal - oldTotal;

      updateData.sickLeave = newTotal;
      updateData.sickLeaveRemaining = Math.max(oldRemaining + diff, 0);
    }

    const rules = await UserExtraDetail.findOneAndUpdate(
      { userId: userId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Rules data saved successfully",
      rules,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//Find Rule ByAdmin
export const getRuleByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    const rules = await UserExtraDetail.findOne({ userId });

    if (!rules) {
      return res.status(404).json({ message: "not found" });
    }

    res.status(200).json(rules);

  } catch (error) {
    console.log("Get user error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

//add payroll
export const addOrUpdatePayroll = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = {};

    const fields = [
      "accountHolderName",
      "bankName",
      "accountNumber",
      "branchName",
      "city",
      "ifscCode",
      "accountType",
      "pfNumber",
      "panNumber",
      "basicPay",
      "HRA",
      "bonus",
      "specialAllowance",
      "ta",
      "medicalAllowance",
      "variable",
      "EPF",
      "ctc",
    ];

    fields.forEach((field) => {
      if (
        req.body[field] !== undefined &&
        req.body[field] !== null &&
        req.body[field] !== ""
      ) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided",
      });
    }

    updateData.user = userId;

    const payroll = await UserPayroll.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        upsert: true,           // auto create if not exists
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Payroll details saved successfully",
      payroll,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//find payroll
export const getUserPayroll = async (req, res) => {
  try {
    const userId = req.user.id;
    const payroll = await UserPayroll.findOne({ user: userId });

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll details not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payroll fetched successfully",
      payroll,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//add payroll by admin
export const addOrUpdatePayrollByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = {};

    const fields = [
      "accountHolderName",
      "bankName",
      "accountNumber",
      "branchName",
      "city",
      "ifscCode",
      "accountType",
      "pfNumber",
      "panNumber",
      "basicPay",
      "HRA",
      "bonus",
      "specialAllowance",
      "ta",
      "medicalAllowance",
      "variable",
      "EPF",
      "ctc",
    ];

    fields.forEach((field) => {
      if (
        req.body[field] !== undefined &&
        req.body[field] !== null &&
        req.body[field] !== ""
      ) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided",
      });
    }

    updateData.user = userId;

    const payroll = await UserPayroll.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        upsert: true,           // auto create if not exists
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Payroll details saved successfully",
      payroll,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//find payroll by admin
export const getUserPayrollByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;
    const payroll = await UserPayroll.findOne({ user: userId });

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Payroll details not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payroll fetched successfully",
      payroll,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

//findall for payroll
export const getAllUsersPayroll = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "userworks",
          localField: "_id",
          foreignField: "userWorkId",
          as: "userWork"
        }
      },
      {
        $lookup: {
          from: "userpayrolls",
          localField: "_id",
          foreignField: "user",
          as: "userPayroll"
        }
      },
      {
        $project: {
          password: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};

//findone user for payroll
export const findUserPayroll = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id)
        }
      },
      {
        $lookup: {
          from: "userworks",
          localField: "_id",
          foreignField: "userWorkId",
          as: "userWork"
        }
      },
      {
        $lookup: {
          from: "userpayrolls",
          localField: "_id",
          foreignField: "user",
          as: "userPayroll"
        }
      },
      {
        $project: {
          password: 0
        }
      }
    ]);

    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user[0]   // return single user object
    });

  } catch (error) {
    console.error("Get user payroll error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user payroll"
    });
  }
};

//findall for leave
export const getAllUsersLeave = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "userworks",
          localField: "_id",
          foreignField: "userWorkId",
          as: "userWork"
        }
      },
      {
        $lookup: {
          from: "userextradetails",
          localField: "_id",
          foreignField: "userId",
          as: "userExtraDetail"
        }
      },
      {
        $project: {
          password: 0
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};
