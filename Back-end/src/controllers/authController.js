import { User } from '../models/User.js';
import { UserEducation } from '../models/UserEdu.js';
import { UserWork } from '../models/UserWork.js';
import { UserExtraDetail } from '../models/UserExtraDetails.js';
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
    // console.log(user, "llll", req.user.id);

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
      "workExperince",
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

    const workList = await UserWork.find({ userWorkId: userId });

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
      "workExperince",
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

    const workList = await UserWork.find({ userWorkId: userId });

    res.status(200).json({
      success: true,
      data: workList,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch education" });
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