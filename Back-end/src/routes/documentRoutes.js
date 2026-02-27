import express from "express";
import { upload } from "../middleware/upload.js";
import { getAllPolicy, getDocsUser, getDocsUserByAdmin, getPolicyAdmin, getPolicyUser, uploadPolicy, uploadProfileImage, uploadProfileImageByAdmin, uploadUserDocument, uploadUserDocumentByAdmin } from "../controllers/documentController.js";
// import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post(
    "/upload-profile",
    upload.single("image"),
    uploadProfileImage
);

router.post(
    "/upload-document",
    upload.single("file"),
    uploadUserDocument
);

router.post(
    "/upload-policy",
    upload.single("file"),
    uploadPolicy
);

router.get(
    "/get-document",
    getDocsUser
);

router.get(
    "/get-policy",
    getAllPolicy
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

router.get(
    "/get-policy-byUser",
    getPolicyUser
);

router.get(
    "/get-policy-byAdmin/:id",
    getPolicyAdmin
);

export default router;
