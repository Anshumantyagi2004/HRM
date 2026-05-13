import { User } from '../models/User.js';
import { UserDocuments } from '../models/UserDocs.js';
import { CompanyPolicy } from '../models/CompanyPolicy.js';
import { UserPolicy } from '../models/Policy.js';
import Notification from "../models/Notification.js";
import { uploadToR2 } from "../utils/uploadToR2.js";
import { deleteFromR2 } from "../utils/deleteFromR2.js";

// Profile image upload controller
export const uploadProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }

        // delete old image
        if (user.profileImageField) {
            await deleteFromR2(user.profileImageField);
        }

        // extension
        const ext = req.file.originalname.split(".").pop();

        // unique file name
        const fileName = `${Date.now()}-${user._id}.${ext}`;

        // upload to R2
        const uploaded = await uploadToR2({
            file: req.file.buffer,
            folder: "profile-image",
            fileName,
            contentType: req.file.mimetype,
        });

        // save new data
        user.profileImage = uploaded.url;

        // save key separately
        user.profileImageField = uploaded.key;

        await user.save();

        res.status(200).json({
            message: "Profile image uploaded successfully",
            imageUrl: uploaded.url,
        });
    } catch (error) {
        console.error("Upload error:", error);

        res.status(500).json({
            message: "Upload failed",
        });
    }
};

// Document upload controller
export const uploadUserDocument = async (req, res) => {
    try {
        const { documentType } = req.body;

        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }

        // extension
        const ext = req.file.originalname.split(".").pop();

        // unique filename
        const fileName = `${Date.now()}-${userId}-${documentType}.${ext}`;

        // upload to R2
        const uploaded = await uploadToR2({
            file: req.file.buffer,
            folder: "user-documents",
            fileName,
            contentType: req.file.mimetype,
        });

        // save in db
        const docs = new UserDocuments({
            userDocsId: userId,
            type: documentType,

            // public url
            url: uploaded.url,

            // optional r2 key
            fileField: uploaded.key,
        });

        await docs.save();

        res.status(200).json({
            message: "Document uploaded successfully",

            document: {
                type: documentType,
                url: uploaded.url,
            },
        });

    } catch (error) {

        console.error("Upload error:", error);

        res.status(500).json({
            message: "Document upload failed",
        });
    }
};

// Document Delete controller
export const deleteUserDocument = async (req, res) => {
    try {

        const { id } = req.params;

        const userId = req.user.id;

        const document = await UserDocuments.findOne({
            _id: id,
            userDocsId: userId,
        });

        if (!document) {
            return res.status(404).json({
                message: "Document not found",
            });
        }

        // delete from R2
        if (document.fileField) {
            await deleteFromR2(document.fileField);
        }

        // delete from DB
        await UserDocuments.findByIdAndDelete(id);

        res.status(200).json({
            message: "Document deleted successfully",
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Delete failed",
        });
    }
};

//get docs
export const getDocsUser = async (req, res) => {
    try {
        const userId = req.user.id;

        const DocsList = await UserDocuments.find({ userDocsId: userId });

        res.status(200).json({
            success: true,
            data: DocsList,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch education" });
    }
};

// Profile image upload controller
export const uploadProfileImageByAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }

        // delete old image
        if (user.profileImageField) {
            await deleteFromR2(user.profileImageField);
        }

        // extension
        const ext = req.file.originalname.split(".").pop();

        // unique file name
        const fileName = `${Date.now()}-${user._id}.${ext}`;

        // upload to R2
        const uploaded = await uploadToR2({
            file: req.file.buffer,
            folder: "profile-image",
            fileName,
            contentType: req.file.mimetype,
        });

        // save new data
        user.profileImage = uploaded.url;

        // save key separately
        user.profileImageField = uploaded.key;

        await user.save();

        res.status(200).json({
            message: "Profile image uploaded successfully",
            imageUrl: uploaded.url,
        });
    } catch (error) {
        console.error("Upload error:", error);

        res.status(500).json({
            message: "Upload failed",
        });
    }
};

//get docs
export const getDocsUserByAdmin = async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);

        const DocsList = await UserDocuments.find({ userDocsId: userId });

        res.status(200).json({
            success: true,
            data: DocsList,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch education" });
    }
};

//policy
export const uploadPolicy = async (req, res) => {
    try {

        const {
            documentName,
            assignedUsers
        } = req.body;

        if (!req.file) {
            return res.status(400).json({
                message: "No file uploaded",
            });
        }

        // parse assigned users
        let parsedUsers = [];

        if (assignedUsers) {
            parsedUsers = JSON.parse(assignedUsers);
        }

        // extension
        const ext = req.file.originalname
            .split(".")
            .pop();

        // unique filename
        const fileName =
            `${Date.now()}-${documentName}.${ext}`;

        // upload to R2
        const uploaded = await uploadToR2({
            file: req.file.buffer,

            folder: "company-policies",

            fileName,

            contentType: req.file.mimetype,
        });

        // save policy
        const docs = new CompanyPolicy({

            documentName,

            url: uploaded.url,

            fileField: uploaded.key,

            assignedUsers: parsedUsers,
        });

        await docs.save();

        // notification users
        let users = [];

        // if selected users exist
        if (parsedUsers.length > 0) {

            users = await User.find(
                {
                    _id: { $in: parsedUsers }
                },
                "_id"
            );

        } else {

            // send to all users
            users = await User.find({}, "_id");
        }

        const notifications = users.map((user) => ({
            receiver: user._id,

            title: "New Policy Added",

            message:
                `${documentName} has been added in policy section. Check it out.`,

            type: "reminder",

            link: "/myProfile",
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        return res.status(200).json({

            message: "Policy uploaded successfully",

            document: {
                documentName,
                url: uploaded.url,
                assignedUsers: parsedUsers,
            },
        });

    } catch (error) {

        console.error("Upload error:", error);

        return res.status(500).json({
            message: "Document upload failed",
        });
    }
};

// delete policy
export const deletePolicy = async (req, res) => {
    try {

        const { id } = req.params;

        const policy = await CompanyPolicy.findById(id);

        if (!policy) {
            return res.status(404).json({
                message: "Policy not found",
            });
        }

        // delete from R2
        if (policy.fileField) {
            await deleteFromR2(policy.fileField);
        }

        // delete from DB
        await CompanyPolicy.findByIdAndDelete(id);

        res.status(200).json({
            message: "Policy deleted successfully",
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Delete failed",
        });
    }
};

export const getAllPolicy = async (req, res) => {
    try {
        const DocsList = await CompanyPolicy.find();

        res.status(200).json({
            success: true,
            data: DocsList,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch education" });
    }
};

export const getPolicyUser = async (req, res) => {
    try {

        const userId = req.user.id;

        // company policies visible to user
        const companyPolicies = await CompanyPolicy.find({

            $or: [

                // public policy
                {
                    assignedUsers: {
                        $size: 0
                    }
                },

                // assigned policy
                {
                    assignedUsers: userId
                }
            ]
        });

        // signed policies
        const userPolicies = await UserPolicy.find({
            userId
        });

        // merge
        const mergedPolicies = companyPolicies.map((policy) => {

            const signed = userPolicies.find(
                (u) =>
                    u.documentName === policy.documentName
            );

            if (signed) {

                return {
                    ...policy.toObject(),

                    status: "VERIFIED",

                    url: signed.url,

                    signedBy: signed.signedBy,

                    signedAt: signed.signedAt,

                    remark: signed.remark,

                    isSigned: true,
                };
            }

            return {
                ...policy.toObject(),

                status: "PENDING",

                isSigned: false,
            };
        });

        res.status(200).json({
            success: true,
            data: mergedPolicies,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch policies"
        });
    }
};

export const getPolicyAdmin = async (req, res) => {
    try {
        const userId = req.params.id;

        // company policies visible to user
        const companyPolicies = await CompanyPolicy.find({

            $or: [

                // public policy
                {
                    assignedUsers: {
                        $size: 0
                    }
                },

                // assigned policy
                {
                    assignedUsers: userId
                }
            ]
        });

        // signed policies
        const userPolicies = await UserPolicy.find({
            userId
        });

        // merge
        const mergedPolicies = companyPolicies.map((policy) => {

            const signed = userPolicies.find(
                (u) =>
                    u.documentName === policy.documentName
            );

            if (signed) {

                return {
                    ...policy.toObject(),

                    status: "VERIFIED",

                    url: signed.url,

                    signedBy: signed.signedBy,

                    signedAt: signed.signedAt,

                    remark: signed.remark,

                    isSigned: true,
                };
            }

            return {
                ...policy.toObject(),

                status: "PENDING",

                isSigned: false,
            };
        });

        res.status(200).json({
            success: true,
            data: mergedPolicies || [],
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to fetch policies"
        });
    }
};