import { Check, Eye, X } from 'lucide-react'
import React, { useState } from 'react'
import BgVerification from "../../Assets/PolicyDocs/Background Verification Consent Form.pdf"
import HrPolicy from "../../Assets/PolicyDocs/HR Policy.pdf"
import ConfidentailandNonDiscolure from "../../Assets/PolicyDocs/CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT.pdf"
import ITandSocialMedia from "../../Assets/PolicyDocs/IT & Social Media Policy Agreement.pdf"
import PoshPolicy from "../../Assets/PolicyDocs/POSH Policy.pdf"
import toast from 'react-hot-toast'

export default function Policy(props) {
    const {
        user,
    } = props

    const [allDocs, setAllDocs] = useState([
        { docName: "Background Verification", src: BgVerification, status: "Pending", date: "" },
        { docName: "HR Policy", src: HrPolicy, status: "Pending", date: "" },
        { docName: "Confidentiality & NON Disclosure", src: ConfidentailandNonDiscolure, status: "Pending", date: "" },
        { docName: "IT & Social Media", src: ITandSocialMedia, status: "Pending", date: "" },
        { docName: "POSH Policy", src: PoshPolicy, status: "Pending", date: "" }
    ])

    const [showPDF, setShowPDF] = useState(false);
    const [verifyPDF, setVerifyPDF] = useState(false);
    const [activePDF, setActivePDF] = useState(null);
    const [accepted, setAccepted] = useState(false);
    const handleViewPDF = (pdfSrc) => {
        setActivePDF(pdfSrc);
        setShowPDF(true);
    };

    const handleVerifyPDF = (pdfSrc) => {
        setVerifyPDF(true)
        setActivePDF(pdfSrc);
        setShowPDF(true);
    };

    const handleSendOTP = () => {
        toast.success("OTP Sent for:", activePDF?.docName);
    };

    return (<>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                    Policy
                </h2>
            </div>

            <div className="mt-2">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-indigo-600 text-white text-left">
                            <th className="px-4 py-3">Document Name</th>
                            <th className="px-4 py-3">Policy Accepeted Date</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {allDocs.map((i, idx) => (
                            <tr className="border-b hover:bg-gray-50">
                                <td className="p-2">
                                    {i?.docName}
                                </td>
                                <td className="p-2">
                                    {i?.date}
                                </td>
                                <td className="p-2">
                                    {i?.status}
                                </td>
                                <td className="p-2">
                                    <div className='flex items-center gap-2 justify-center'>
                                        <button
                                            onClick={() => handleVerifyPDF(i)}
                                            className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                        bg-green-50 text-green-600 hover:bg-green-100 transition"
                                        >
                                            <Check size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleViewPDF(i)}
                                            className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                        bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>)
                        )}
                    </tbody>
                </table>
            </div>

            {showPDF && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="absolute inset-0 backdrop-blur-sm" onClick={() => { setShowPDF(false); setVerifyPDF(false); setAccepted(false) }} />
                    <div className="relative bg-white w-[80%] h-[90%] rounded-xl shadow-xl overflow-hidden flex flex-col z-10">
                        <div className="flex items-center justify-between px-4 py-3 border-b">
                            <h2 className="font-semibold text-lg">{activePDF?.docName}</h2>
                            <button onClick={() => { setShowPDF(false); setVerifyPDF(false); }}
                                className="text-gray-600 hover:text-red-500 text-xl font-bold">
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <iframe
                                src={activePDF?.src}
                                className="w-full h-full"
                                title="PDF Viewer"
                            />
                        </div>

                        {verifyPDF && (
                            <div className="border-t p-2 bg-gray-50">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        className="mt-0.5 h-5 w-5"
                                        checked={accepted}
                                        onChange={(e) => setAccepted(e.target.checked)}
                                    />

                                    <p className="text-base font-semibold">
                                        I, <span className="font-bold">{user?.username},</span> acknowledge and accept the{" "}
                                        <span className="font-bold">{activePDF?.docName}</span> of
                                        Promozione Branding Private Limited.
                                    </p>
                                </div>
                                <div className="flex justify-center mt-2">
                                    <button disabled={!accepted} onClick={handleSendOTP}
                                        className={`px-4 py-2 rounded-md text-white transition ${accepted ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}>
                                        Send OTP
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>)}
        </div>
    </>)
}
