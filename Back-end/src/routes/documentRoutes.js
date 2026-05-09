import express from "express";
import { upload } from "../middleware/upload.js";
import { deletePolicy, deleteUserDocument, getAllPolicy, getDocsUser, getDocsUserByAdmin, getPolicyAdmin, getPolicyUser, uploadPolicy, uploadProfileImage, uploadProfileImageByAdmin, uploadUserDocument } from "../controllers/documentController.js";
// import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post(
    "/upload-profile",
    upload.single("image"),
    uploadProfileImage
);

router.get("/proxy-image", async (req, res) => {
    try {
        const imageUrl = req.query.url;

        if (!imageUrl) {
            return res.status(400).send("Image URL required");
        }

        const response = await fetch(imageUrl);

        if (!response.ok) {
            return res.status(400).send("Failed to fetch image");
        }

        const contentType = response.headers.get("content-type");

        const arrayBuffer = await response.arrayBuffer();

        const buffer = Buffer.from(arrayBuffer);

        res.setHeader("Content-Type", contentType);

        return res.send(buffer);

    } catch (error) {
        console.log(error);

        return res.status(500).send("Server Error");
    }
});

router.post(
    "/upload-document",
    upload.single("file"),
    uploadUserDocument
);

router.delete(
    "/delete-document/:id",
    deleteUserDocument
);

router.post(
    "/upload-policy",
    upload.single("file"),
    uploadPolicy
);

router.delete(
    "/delete-policy/:id",
    deletePolicy
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
