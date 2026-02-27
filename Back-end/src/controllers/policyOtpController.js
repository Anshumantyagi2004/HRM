// controllers/policyOtp.controller.js
import PolicyOtpLog from "../models/PolicyOtpLogs.js";
import { generateOTP, hashOTP } from "../middleware/otpService.js";
import { mailTransporter } from "../config/mail.js";
import { UserPolicy } from '../models/Policy.js';
import {
    downloadPdfBuffer,
    signPdfBuffer,
    uploadSignedPdfToCloudinary
} from "../services/pdfSigner.service.js";
import bcrypt from 'bcryptjs';
import PolicyOtpLogs from "../models/PolicyOtpLogs.js";

//send
export const sendPolicyOTP = async (req, res) => {
    try {
        const { policyId, policyName, email } = req.body;
        const user = req.user;

        const otp = generateOTP();
        const otpHash = await hashOTP(otp);

        await PolicyOtpLog.create({
            userId: user.id,
            policyId,
            otpHash,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await mailTransporter.sendMail({
            from: `"Promozione Branding" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Policy Verification Code",
            html: `
        <h2>HRM Policy Verification OTP</h2>
        <h4><b>Policy:</b> ${policyName}</h4>
        <p>Your OTP:</p>
        <h2>${otp}</h2>
        <p>Valid for 5 minutes</p>
        <p><b>Do not share this code</b></p>
      `
        });

        res.json({ success: true, message: "OTP sent on mail" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "OTP send failed" });
    }
};

//verify
export const verifyOtpAndSignPolicy = async (req, res) => {
    try {
        const user = req.user;
        const { policyId, policyName, otp, pdfPath,username } = req.body;
        
        if (!otp || !policyId || !pdfPath) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // 1️⃣ Find OTP
        const otpRecord = await PolicyOtpLogs.findOne({
            userId: user.id,
            policyId,
            status: "ACTIVE"
        }).sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({ message: "OTP not found or expired" });
        }

        // 2️⃣ Expiry check
        if (new Date() > otpRecord.expiresAt) {
            otpRecord.status = "EXPIRED";
            await otpRecord.save();
            return res.status(400).json({ message: "OTP expired" });
        }

        // 3️⃣ Attempt limit
        if (otpRecord.attempts >= 5) {
            otpRecord.status = "EXPIRED";
            await otpRecord.save();
            return res.status(403).json({ message: "Too many attempts. OTP blocked." });
        }

        // 4️⃣ OTP match (hash compare)
        const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

        if (!isValid) {
            otpRecord.attempts += 1;
            await otpRecord.save();
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // 5️⃣ Mark OTP as USED
        otpRecord.status = "USED";
        await otpRecord.save();

        // ================= PDF PROCESS =================

        // 6️⃣ Download original PDF
        const pdfBuffer = await downloadPdfBuffer(pdfPath);

        // 7️⃣ Sign PDF
        const signedPdfBytes = await signPdfBuffer({
            pdfBuffer,
            signedBy: username,
            signedOn: new Date().toLocaleString("en-IN"),
            remark: "Signed using Email OTP"
        });

        // 8️⃣ Upload signed PDF
        const fileName = `policy_${user.id}_${policyId}_${Date.now()}`;
        const uploadResult = await uploadSignedPdfToCloudinary(
            Buffer.from(signedPdfBytes),
            fileName
        );

        const signedPdfUrl = uploadResult.secure_url;
        await UserPolicy.create({
            userId: user.id,
            documentName: policyName,
            url: signedPdfUrl,
            status: "VERIFIED",
            signedAt: new Date(),
            signedBy: username,
            remark: "Signed using Email OTP"
        });

        return res.status(200).json({
            message: "Policy verified & signed successfully",
            signedPdfUrl
        });

    } catch (error) {
        console.error("VERIFY + SIGN ERROR:", error);
        res.status(500).json({ message: "Verification failed" });
    }
};