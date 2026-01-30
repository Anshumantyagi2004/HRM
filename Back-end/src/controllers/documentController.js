import { User } from '../models/User.js';

// Profile image upload controller
export const uploadProfileImage = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // multer-cloudinary already uploaded the image
        user.profileImage = req.file.path; // this is secure_url
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
        const userId = req.params.id;

        if (!documentType) {
            return res.status(400).json({ message: "Document type is required" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "File is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Upload to Cloudinary
        // const result = await cloudinary.uploader.upload(req.file.path, {
        //     folder: "user_documents",
        //     resource_type: "auto", // 🔥 important for PDF + image
        // });

        // Push document into array
        user.documents.push({
            type: documentType,
            url: req.file.path,
        });

        await user.save();

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