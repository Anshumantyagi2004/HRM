import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { uploadToR2 } from "../utils/uploadToR2.js";

/* Download PDF from URL using native fetch */
export const downloadPdfBuffer = async (pdfUrl) => {
    const res = await fetch(pdfUrl);
    if (!res.ok) throw new Error("Failed to download PDF");

    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
};

/* Add signature text to last page */
export const signPdfBuffer = async ({
    pdfBuffer,
    signedBy,
    signedOn,
    remark
}) => {
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const { width } = lastPage.getSize();

    const text = `Signed by: ${signedBy}
Signed on: ${signedOn}
Remark: ${remark}`;

    lastPage.drawText(text, {
        x: width - 240,
        y: 150,
        size: 12,
        font,
        color: rgb(0, 0, 0),
        lineHeight: 14
    });

    const signedPdfBytes = await pdfDoc.save();
    return signedPdfBytes;
};

/*Upload signed PDF to Cloudinary */
export const uploadSignedPdfToCloudinary = async (
    buffer,
    fileName
) => {

    const uploaded = await uploadToR2({
        file: buffer,

        folder: "user-accepted-policies",

        fileName: `${fileName}.pdf`,

        contentType: "application/pdf",
    });

    return uploaded;
};