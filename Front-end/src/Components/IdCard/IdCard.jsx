import { useState } from "react";
import { Eye, Download } from "lucide-react";
import { generatePdf } from "./GenratePdf";

export default function IdCard({ employee, workInfo }) {
    const [open, setOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");

    const previewPdf = async () => {
        const url = await generatePdf(employee, workInfo);
        setPdfUrl(url);
        setOpen(true);
    };

    const downloadPdf = async () => {
        const url = await generatePdf(employee, workInfo);

        const link = document.createElement("a");
        link.href = url;
        link.download = "employee-id-card.pdf";
        link.click();
    };

    return (
        <>
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Id Card</h2>
                    <div className="flex gap-2">
                        <button onClick={previewPdf} className="p-2 rounded-full text-[#f45a06] bg-orange-50 border border-orange-100">
                            <Eye size={18} />
                        </button>

                        <button onClick={downloadPdf} className="p-2 rounded-full text-[#f45a06] bg-orange-50 border border-orange-100">
                            <Download size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div
                        className="absolute inset-0"
                        onClick={() => setOpen(false)}
                    />

                    <div className="relative bg-white w-[80%] h-[90%] rounded-xl overflow-hidden">
                        <div className="flex justify-between p-3 border-b">
                            <h2 className="font-semibold">ID Card</h2>

                            <button onClick={() => setOpen(false)}>✕</button>
                        </div>

                        <iframe
                            src={pdfUrl}
                            className="w-full h-full"
                            title="PDF Viewer"
                        />
                    </div>
                </div>
            )}
        </>
    );
}