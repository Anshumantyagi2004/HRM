import {
    PDFDocument, StandardFonts, rgb, pushGraphicsState,
    popGraphicsState,
    moveTo,
    lineTo,
    closePath,
    clip,
    endPath
} from "pdf-lib";
import IdCardLayout from "../../Assets/IdCard.pdf";

export const generatePdf = async (employee, workInfo) => {

    const existingPdfBytes = await fetch(IdCardLayout).then(res =>
        res.arrayBuffer()
    );

    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const page = pdfDoc.getPages()[0];

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    /* ---------- HEXAGON PROFILE IMAGE ---------- */
    if (employee?.profileImage) {
        const response = await fetch(
            `${import.meta.env.VITE_BASE_URL}api/proxy-image?url=${encodeURIComponent(employee.profileImage)}`,
            { credentials: "include", }
        );

        const imageBytes = await response.arrayBuffer();
        const contentType = response.headers.get("content-type");
        let image;

        if (contentType.includes("jpeg") || contentType.includes("jpg")) {
            image = await pdfDoc.embedJpg(imageBytes);
        } else if (contentType.includes("png")) {
            image = await pdfDoc.embedPng(imageBytes);
        } else {
            throw new Error("Unsupported image type");
        }

        const centerX = 202;
        const centerY = 375;
        const size = 118;

        const points = [
            [centerX, centerY + size],
            [centerX + size * 0.87, centerY + size / 2],
            [centerX + size * 0.87, centerY - size / 2],
            [centerX, centerY - size],
            [centerX - size * 0.87, centerY - size / 2],
            [centerX - size * 0.87, centerY + size / 2],
        ];

        page.pushOperators(
            pushGraphicsState(),
            moveTo(points[0][0], points[0][1]),
            lineTo(points[1][0], points[1][1]),
            lineTo(points[2][0], points[2][1]),
            lineTo(points[3][0], points[3][1]),
            lineTo(points[4][0], points[4][1]),
            lineTo(points[5][0], points[5][1]),
            closePath(),
            clip(),
            endPath()
        );

        page.drawImage(image, {
            x: centerX - size,
            y: centerY - size,
            width: size * 2,
            height: size * 2,
        });

        page.pushOperators(popGraphicsState());
    }

    /* ---------- NAME ---------- */
    const frontCardWidth = 420;
    const frontCardStartX = 0;

    const name = employee?.username || "";
    const nameSize = 26;

    const textWidth = fontBold.widthOfTextAtSize(name, nameSize);

    page.drawText(name, {
        x: frontCardStartX + (frontCardWidth - textWidth) / 2,
        y: 215,
        size: nameSize,
        font: fontBold,
        color: rgb(0.1, 0.2, 0.4),
    });

    /* ---------- DESIGNATION BACKGROUND ---------- */
    page.drawRectangle({
        x: 120,
        y: 180,
        width: 180,
        height: 22,
        color: rgb(0.9, 0.2, 0.4), // pink background
    });

    /* ---------- DESIGNATION TEXT ---------- */
    const des = workInfo?.subDepartment || "-";
    const desSize = 16;

    const desWidth = fontBold.widthOfTextAtSize(des, desSize);

    page.drawText(des, {
        x: frontCardStartX + (frontCardWidth - desWidth) / 2,
        y: 185,
        size: desSize,
        font: fontBold,
        color: rgb(1, 1, 1),
    });

    /* ---------- ID NUMBER ---------- */
    page.drawText(`ID No : ${workInfo?.empId || "-"}`, {
        x: 30,
        y: 140,
        size: 15,
        font: fontBold,
    });

    /* ---------- EMAIL ---------- */
    page.drawText(`Email : ${employee?.officialEmail || "-"}`, {
        x: 30,
        y: 120,
        size: 15,
        font: fontBold,
    });

    /* ---------- CONTACT ---------- */
    page.drawText(`Contact : ${employee?.contact || ""}`, {
        x: 30,
        y: 100,
        size: 15,
        font: fontBold,
    });

    // BLOOD GROUP
    page.drawText(`Blood Group : ${employee?.bloodGroup || "-"}`, {
        x: 480,
        y: 190,
        size: 16,
        font: fontBold,
        color: rgb(0.1, 0.2, 0.4)
    });

    // EMERGENCY CONTACT
    page.drawText(`Emergency Contact : ${employee?.altContact || "-"}`, {
        x: 480,
        y: 170,
        size: 16,
        font: fontBold,
        color: rgb(0.1, 0.2, 0.4)
    });

    // ID NUMBER HIGHLIGHT
    page.drawRectangle({
        x: 520,
        y: 100,
        width: 240,
        height: 30,
        color: rgb(0.9, 0.2, 0.4) // pink
    });

    page.drawText(`ID Number : ${workInfo?.empId || "-"}`, {
        x: 532,
        y: 108,
        size: 18,
        font: fontBold,
        color: rgb(1, 1, 1)
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    return URL.createObjectURL(blob);
};