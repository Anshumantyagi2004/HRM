import { User } from '../models/User.js';
import { UserDocuments } from '../models/UserDocs.js';

// Profile image upload controller
export const uploadProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        user.profileImage = req.file.path;
        await user.save();

        res.status(200).json({
            message: "Profile image uploaded successfully",
            imageUrl: req.file.path,
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Upload failed" });
    }
};

// Document upload controller
export const uploadUserDocument = async (req, res) => {
    try {
        const { documentType } = req.body;
        const userId = req.user.id;

        const docs = new UserDocuments({
            userDocsId: userId,
            type: documentType,
            url: req.file.path,
        });

        const UserDocs = await docs.save();

        res.status(200).json({
            message: "Document uploaded successfully",
            document: {
                type: documentType,
                url: req.file.path,
            },
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Document upload failed" });
    }
};

//get docs
export const getDocsUser = async (req, res) => {
    try {
        const userId = req.user.id;
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

// Profile image upload controller
export const uploadProfileImageByAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        user.profileImage = req.file.path;
        await user.save();

        res.status(200).json({
            message: "Profile image uploaded successfully",
            imageUrl: req.file.path,
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Upload failed" });
    }
};

// Document upload controller
export const uploadUserDocumentByAdmin = async (req, res) => {
    try {
        const { documentType } = req.body;
        const userId = req.params.id;

        const docs = new UserDocuments({
            userDocsId: userId,
            type: documentType,
            url: req.file.path,
        });

        const UserDocs = await docs.save();

        res.status(200).json({
            message: "Document uploaded successfully",
            document: {
                type: documentType,
                url: req.file.path,
            },
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Document upload failed" });
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