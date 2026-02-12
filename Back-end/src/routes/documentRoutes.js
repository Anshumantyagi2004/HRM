import express from "express";
import { upload } from "../middleware/upload.js";
import { getDocsUser, getDocsUserByAdmin, uploadProfileImage, uploadProfileImageByAdmin, uploadUserDocument, uploadUserDocumentByAdmin } from "../controllers/documentController.js";
// import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post(
    "/upload-profile",
    upload.single("image"),
    uploadProfileImage
);

router.post(
    "/upload-document",
    upload.single("file"), // 🔥 must be "file"
    uploadUserDocument
);

router.get(
    "/get-document",
    getDocsUser
);

router.post(
    "/upload-profile-ByAdmin/:id",
    upload.single("image"),
    uploadProfileImageByAdmin
);

router.post(
    "/upload-document-ByAdmin/:id",
    upload.single("file"), // 🔥 must be "file"
    uploadUserDocumentByAdmin
);

router.get(
    "/get-document-ByAdmin/:id",
    getDocsUserByAdmin
);

export default router;
