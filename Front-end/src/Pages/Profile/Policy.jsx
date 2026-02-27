import { Check, ClipboardList, Eye, Trash2, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { BaseUrl } from '../../BaseApi/Api'
import Modal from '../../Components/Modal/Modal'

export default function Policy(props) {
    const {
        user,
        userId,
        fetchPolicy,
        userPolicies,
    } = props
    const [loading, setLoading] = useState(false);
    const [documentModal, setDocumentModal] = useState(false);
    const [file, setFile] = useState(null);
    const [documentName, setDocumentName] = useState(null);
    const [allDocs, setAllDocs] = useState([])
    const [adminPolicies, setAdminPolicies] = useState([])

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;
        setFile(selectedFile);
    };

    const uploadPolicy = async () => {
        if (loading) return;

        if (!file) {
            toast.error("Select document file");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentName", documentName);
        try {
            setLoading(true)
            const res = await fetch(`${BaseUrl}api/upload-policy`, { method: "POST", body: formData, credentials: "include", });
            const data = await res.json();
            if (!res.ok) return toast.error(data.message || "Error uploading document");
            setDocumentModal(false)
            setFile(null);
            fetchDocs()
            fetchPolicy()
            toast.success("Document uploaded successfully");
        } catch (err) {
            console.error(err);
            toast.error("Upload failed");
        }
        finally {
            setLoading(false)
        }
    };

    const fetchDocs = async () => {
        try {
            const response = await fetch(`${BaseUrl}api/get-policy`, { credentials: "include", });
            if (!response.ok) {
                toast.error("No policy Available");
            } else {
                const data = await response.json();
                setAdminPolicies(data?.data)
            }
        } catch (error) {
            toast.error("Add Education Error:", error.message);
        }
    };

    useEffect(() => {
        fetchDocs()
        fetchPolicy()
    }, [])

    useEffect(() => {
        const mergePolicies = (adminPolicies, userPolicies) => {
            return adminPolicies.map((adminDoc) => {
                const signed = userPolicies.find(
                    (u) => u.documentName === adminDoc.documentName
                );

                if (signed) {
                    // user has verified this policy
                    return {
                        ...adminDoc,
                        status: "VERIFIED",
                        url: signed.url,                 // signed pdf
                        signedBy: signed.signedBy,
                        signedAt: signed.signedAt,
                        remark: signed.remark,
                        isSigned: true
                    };
                } else {
                    // not verified yet
                    return {
                        ...adminDoc,
                        status: "PENDING",
                        isSigned: false
                    };
                }
            });
        };
        const mergedData = mergePolicies(adminPolicies, userPolicies);
        setAllDocs(mergedData);
    }, [adminPolicies, userPolicies])

    const [showPDF, setShowPDF] = useState(false);
    const [verifyPDF, setVerifyPDF] = useState(false);
    const [activePDF, setActivePDF] = useState(null);
    const [accepted, setAccepted] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState("");

    const handleViewPDF = (pdfSrc) => {
        setActivePDF(pdfSrc);
        setShowPDF(true);
    };

    const handleVerifyPDF = (pdfSrc) => {
        setVerifyPDF(true)
        setActivePDF(pdfSrc);
        setShowPDF(true);
    };

    const handleSendOTP = async () => {
        if (otpLoading) return;

        setOtpLoading(true);
        const sendPromise = fetch(`${BaseUrl}send`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                policyId: activePDF?._id,
                policyName: activePDF?.documentName,
                email: user?.email
            })
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        });

        toast.promise(sendPromise, {
            loading: "Sending OTP to your email...",
            success: `OTP sent to your email: ${user?.email}`,
            error: (err) => err.message || "Failed to send OTP"
        });
        sendPromise.finally(() => { setOtpLoading(false); setOtpSent(true); setVerifyPDF(false) });
    };

    const handleVerifyOTP = async () => {
        if (otpLoading) return;
        setOtpLoading(true);

        const verifyPromise = fetch(`${BaseUrl}verifyOtp`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: user?.username,
                otp,
                policyId: activePDF?._id,
                policyName: activePDF?.documentName,
                pdfPath: activePDF?.url
            })
        }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message);
            } else {
                return data;
            }
        });

        toast.promise(verifyPromise, {
            loading: "Verifying OTP & signing policy...",
            success: "Policy verified & signed successfully ✅",
            error: (err) => err.message || "OTP verification failed"
        });

        verifyPromise.finally(() => {
            setOtpLoading(false);
            setOtp("");
            setOtpSent(false);
            setVerifyPDF(false);
            setShowPDF(false);
            setAccepted()
            fetchPolicy()
        });
    };

    return (<>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <ClipboardList onClick={() => user.role == "Admin" && setDocumentModal(true)} size={18} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 h-8 w-8 p-1 rounded-full" />
                    Policy
                </h2>
            </div>

            <div className="mt-4">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-indigo-600 text-white text-left">
                            <th className="px-2 py-3">Document Name</th>
                            <th className="px-2 py-3">Added Date</th>
                            <th className="px-2 py-3">Accepeted Date</th>
                            <th className="px-2 py-3">Status</th>
                            <th className="px-2 py-3 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {allDocs.map((i, idx) => (
                            <tr className="border-b hover:bg-gray-50">
                                <td className="p-2 font-semibold w-56" title={i?.documentName}>
                                    {i?.documentName?.toString().length > 24 ? i?.documentName?.slice(0, 24) + "..." : i?.documentName}
                                </td>
                                <td className="p-2">
                                    {i?.createdAt?.toString()?.split("T")[0]}
                                </td>
                                <td className="p-2">
                                    {i?.signedAt?.toString()?.split("T")[0] || "-"}
                                </td>
                                <td className={`p-2 ${i?.status == "VERIFIED" ? "text-green-600" : "text-red-600"} font-semibold`}>
                                    {i?.status}
                                </td>
                                <td className="p-2">
                                    <div className='flex items-center gap-2 justify-center'>
                                        {(!userId && i?.status != "VERIFIED") &&
                                            <button onClick={() => handleVerifyPDF(i)}
                                                className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                        bg-green-50 text-green-600 hover:bg-green-100 transition border border-green-400"
                                            >
                                                <Check size={18} />
                                            </button>}
                                        <button onClick={() => handleViewPDF(i)}
                                            className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                        bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition border border-indigo-400"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        {user.role == "Admin" &&
                                            <button onClick={() => ""}
                                                className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                        bg-red-50 text-red-600 hover:bg-red-100 transition border border-red-400"
                                            >
                                                <Trash2 size={18} />
                                            </button>}
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
                            <h2 className="font-semibold text-lg">{activePDF?.documentName}</h2>
                            <button onClick={() => { setShowPDF(false); setVerifyPDF(false); }}
                                className="text-gray-600 hover:text-red-500 text-xl font-bold">
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <iframe
                                src={activePDF?.url}
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
                                        <span className="font-bold">{activePDF?.documentName}</span> of
                                        Promozione Branding Private Limited.
                                    </p>
                                </div>
                                <div className="flex justify-center mt-2">
                                    <button disabled={!accepted || otpLoading} onClick={handleSendOTP}
                                        className={`px-4 py-2 rounded-md text-white transition ${accepted && !otpLoading ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}>
                                        {otpLoading ? "Sending OTP..." : "Send OTP"}
                                    </button>
                                </div>
                            </div>)}

                        {otpSent && (
                            <div className="mt-3 flex flex-col items-center gap-2">
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                    className="border px-3 py-2 rounded-md w-48 text-center tracking-widest"
                                />

                                <button disabled={otpLoading} onClick={handleVerifyOTP}
                                    className={`px-4 py-2 rounded-md text-white transition ${!otpLoading ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"}`}>
                                    {otpLoading ? "Verifying OTP..." : "Verify OTP"}
                                </button>
                            </div>)}
                    </div>
                </div>)}

            <Modal open={documentModal} onClose={() => setDocumentModal(false)}>
                <Modal.Header title="Add Policy Here" />
                <Modal.Body>
                    <div className="bg-white w-full max-w-md">
                        <input type="text" className='input mb-2 w-full'
                            placeholder='Enter Policy Name Here'
                            onChange={(e) => setDocumentName(e.target.value)} />
                        <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-600
                                                file:mr-3 file:py-2 file:px-4
                                                file:rounded-lg file:border-0
                                                file:text-sm file:font-medium
                                               file:bg-indigo-600 file:text-white
                                                hover:file:bg-indigo-700 cursor-pointer"
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex justify-end gap-2 w-full">
                        <button onClick={() => setDocumentModal(false)} className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100">
                            Close
                        </button>

                        <button onClick={() => uploadPolicy()} disabled={loading}
                            className={`px-4 py-2 border rounded-lg text-white hover:bg-indigo-700 bg-indigo-600 ${loading && "cursor-not-allowed"}`}>
                            {loading ? "Adding..." : "Add"}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    </>)
}
