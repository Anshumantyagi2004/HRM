import express from "express";
import { upload } from "../middleware/upload.js";
import { uploadProfileImage, uploadUserDocument } from "../controllers/documentController.js";
// import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post(
    "/upload-profile/:id",
    upload.single("image"),
    uploadProfileImage
);

router.post(
    "/upload-document/:id",
    upload.single("file"), // 🔥 must be "file"
    uploadUserDocument
);

export default router;
