import { Mail, Phone, Camera, Pencil, Facebook, Linkedin, Instagram, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BaseUrl } from "../../BaseApi/Api";
import "./Profile.css"
import Modal from "../../Components/Modal/Modal";
import toast from "react-hot-toast";

export default function MyProfile() {
    const [UserId, setUserId] = useState(localStorage.getItem("userId"))
    const [userData, setUserData] = useState();
    const [editText, setEditText] = useState("");
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [documentModal, setDocumentModal] = useState(false);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        const formData = new FormData();
        formData.append("image", file);

        try {
            setLoading(true);
            const res = await fetch(
                `${BaseUrl}api/upload-profile/${UserId}`,
                {
                    method: "POST",
                    body: formData, // ✅ FormData directly
                    // headers: {
                    //   Authorization: `Bearer ${token}`, // only if required
                    // },
                }
            );
            const data = await res.json();

            if (res.ok) {
                toast.success("Image uploaded successfully");
            } else {
                toast.error(data.message || "Upload failed");
            }

            setUserData((prev) => ({
                ...prev,
                profileImage: data.imageUrl,
            }));

        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Image upload failed");
        } finally {
            setLoading(false);
        }
    };

    const [formData, setFormData] = useState({
        username: "",
        dob: "",
        gender: "",
        bloodGroup: "",
        maritalStatus: "",
        email: "",
        officialEmail: "",
        contact: "",
        altContact: "",
        address: "",
        permanentAddress: "",
    });

    useEffect(() => {
        if (userData) {
            setPreview(userData?.profileImage || "")
            setFormData({
                username: userData.username || "",
                dob: userData.dob ? userData.dob.split("T")[0] : "",
                gender: userData.gender || "",
                bloodGroup: userData.bloodGroup || "",
                maritalStatus: userData.maritalStatus || "",
                email: userData.email || "",
                officialEmail: userData.officialEmail || "",
                contact: userData.contact || "",
                altContact: userData.altContact || "",
                address: userData.address || "",
                permanentAddress: userData.permanentAddress || "",
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        async function fetchMyProfile() {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch(BaseUrl + "user" + "/" + UserId, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setUserData(data);
            } catch (error) {
                console.error("Fetch profile error:", error);
                throw error;
            }
        };
        fetchMyProfile()
    }, [UserId])

    const handleSave = async () => {
        try {
            // const token = localStorage.getItem("token");
            const res = await fetch(`${BaseUrl}user/${UserId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data?.message)
                // throw new Error(data.message);
            }
            toast.success(data?.message)
            setUserData(data.user);   // update view
            setEditText("");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDocuments = () => {
        setDocumentModal(true)
    }

    const [documentType, setDocumentType] = useState("");
    const [file, setFile] = useState(null);
    const [previewDoc, setPreviewDoc] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        // Preview for images only
        if (selectedFile.type.startsWith("image/")) {
            setPreviewDoc(URL.createObjectURL(selectedFile));
        } else {
            setPreviewDoc(null);
        }
    };

    const uploadDocument = async () => {
        if (!file || !documentType) {
            toast.error("Select document type and file");
            return;
        }
        const formData = new FormData();
        formData.append("file", file); // must match multer
        formData.append("documentType", documentType);
        try {
            const res = await fetch(
                `${BaseUrl}api/upload-document/${UserId}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            const data = await res.json();
            if (!res.ok) return toast.error(data.message || "Error uploading document");
            setDocumentModal(false)
            setDocumentType("")
            setFile(null);
            setPreviewDoc(null);
            const token = localStorage.getItem("token");
            const res1 = await fetch(BaseUrl + "user" + "/" + UserId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data1 = await res1.json();
            setUserData(data1);
            toast.success("Document uploaded successfully");
        } catch (err) {
            console.error(err);
            toast.error("Upload failed");
        }
    };

    return (
        <div className="w-full px-3 py-4">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-3">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6">
                        <div className="relative w-28 h-28 mx-auto mb-3">
                            <img
                                src={preview}
                                alt="Add Profile"
                                className="w-full h-full rounded-full object-cover border"
                            />

                            <label className="absolute bottom-1 right-1 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 z-10 transition">
                                <Camera size={16} className="text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>

                            {loading && (
                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full text-sm">
                                    Uploading...
                                </div>
                            )}
                        </div>

                        <h2 className="text-lg font-semibold text-gray-800 text-center">{userData?.username || "User Name"}</h2>
                        <p className="text-sm text-gray-500 mt-1 text-center">{userData?.designation || "Job Designation"}</p>
                        <p className="text-sm text-gray-500 text-center">{userData?.email || "Email.com"}</p>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-6 space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Personal Information
                            </h2>

                            <button
                                className="p-2 rounded-full hover:bg-gray-100 transition"
                                onClick={() => setEditText("PersonalInfo")}
                            >
                                <Pencil size={18} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Form Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-500">Full Name</label>
                                {editText === "PersonalInfo" ? (
                                    <input
                                        // value={formData.username || ""}
                                        name="username"
                                        onChange={handleChange}
                                        value={formData?.username || userData?.username || ""}
                                        className="input"
                                    />
                                ) : (
                                    <p className="value">{userData?.username || "User Name"}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-500">DOB</label>
                                {editText === "PersonalInfo" ? (
                                    <input
                                        type="date"
                                        name="dob"
                                        onChange={handleChange}
                                        value={formData?.dob || userData?.dob || ""}
                                        className="input"
                                    />
                                ) : (
                                    <p className="value">{userData?.dob?.toString()?.split("T")[0] || "-"}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-500">Gender</label>
                                {editText === "PersonalInfo" ? (
                                    <select className="input"
                                        name="gender"
                                        onChange={handleChange}
                                        value={formData?.gender || userData?.gender || ""}>
                                        <option value="">Select</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                ) : (
                                    <p className="value">{userData?.gender || "-"}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-500">Blood Group</label>
                                {editText === "PersonalInfo" ? (
                                    <select className="input"
                                        name="bloodGroup"
                                        onChange={handleChange}
                                        value={formData?.bloodGroup || userData?.bloodGroup || ""}>
                                        <option value="">Select</option>
                                        <option>A+</option>
                                        <option>A-</option>
                                        <option>B+</option>
                                        <option>B-</option>
                                        <option>O+</option>
                                        <option>O-</option>
                                        <option>AB+</option>
                                        <option>AB-</option>
                                    </select>
                                ) : (
                                    <p className="value">{userData?.bloodGroup || "-"}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-500">Marital Status</label>
                                {editText === "PersonalInfo" ? (
                                    <select className="input"
                                        name="maritalStatus"
                                        onChange={handleChange}
                                        value={formData?.maritalStatus || userData?.maritalStatus || ""}>
                                        <option value="">Select</option>
                                        <option>Single</option>
                                        <option>Married</option>
                                    </select>
                                ) : (
                                    <p className="value">{userData?.maritalStatus || "-"}</p>
                                )}
                            </div>

                            <div className={`flex justify-end gap-3 items-end transition-all duration-300
                                ${editText === "PersonalInfo"
                                    ? "opacity-100 pointer-events-auto"
                                    : "opacity-0 pointer-events-none"
                                }`}>
                                <button onClick={() => setEditText("")}
                                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
                                    Cancel
                                </button>

                                <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleSave}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Contact Information
                            </h2>

                            <button
                                className="p-2 rounded-full hover:bg-gray-100 transition"
                                onClick={() => setEditText("ContactInfo")}
                            >
                                <Pencil size={18} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-500 flex items-center gap-1">
                                    <Mail size={14} /> Personal Email
                                </label>

                                {editText === "ContactInfo" ? (
                                    <input
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        value={formData?.email || userData?.email || ""}
                                        className="input"
                                    />
                                ) : (
                                    <p className="value">{userData?.email || "-"}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-500 flex items-center gap-1">
                                    <Mail size={14} /> Company Email
                                </label>

                                {editText === "ContactInfo" ? (
                                    <input
                                        type="email"
                                        name="officialEmail"
                                        onChange={handleChange}
                                        value={formData?.officialEmail || userData?.officialEmail || ""}
                                        className="input"
                                    />
                                ) : (
                                    <p className="value">{userData?.officialEmail || "-"}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-500 flex items-center gap-1">
                                    <Phone size={14} /> Contact
                                </label>

                                {editText === "ContactInfo" ? (
                                    <input
                                        type="tel"
                                        name="contact"
                                        onChange={handleChange}
                                        value={formData?.contact || userData?.contact || ""}
                                        className="input"
                                    />
                                ) : (
                                    <p className="value">{userData?.contact || "-"}</p>
                                )}
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-500 flex items-center gap-1">
                                    <Phone size={14} /> Alternate Contact
                                </label>

                                {editText === "ContactInfo" ? (
                                    <input
                                        type="tel"
                                        name="altContact"
                                        onChange={handleChange}
                                        value={formData?.altContact || userData?.altContact || ""}
                                        className="input"
                                    />
                                ) : (
                                    <p className="value">{userData?.altContact || "-"}</p>
                                )}
                            </div>
                            {editText === "ContactInfo" && <>
                                <div></div>
                                <div className={`flex justify-end gap-3 items-center transition-all duration-300
                                    ${editText === "ContactInfo" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                                    <button onClick={() => setEditText("")}
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
                                        Cancel
                                    </button>

                                    <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleSave}>
                                        Save
                                    </button>
                                </div>
                            </>}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Addresses
                            </h2>

                            <button
                                className="p-2 rounded-full hover:bg-gray-100 transition"
                                onClick={() => setEditText("Address")}
                            >
                                <Pencil size={18} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-500">
                                    Current Address
                                </label>

                                {editText === "Address" ? (
                                    <textarea
                                        rows={3}
                                        name="address"
                                        onChange={handleChange}
                                        value={formData?.address || userData?.address || ""}
                                        className="border border-gray-300 rounded-md px-3 py-2 resize-none 
                                            focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                ) : (
                                    <p className="text-gray-800 font-medium min-h-[3rem]">
                                        {userData?.address || "-"}
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="font-medium text-gray-500">
                                    Permanent Address
                                </label>

                                {editText === "Address" ? (
                                    <textarea
                                        rows={3}
                                        name="permanentAddress"
                                        onChange={handleChange}
                                        value={formData?.permanentAddress || userData?.permanentAddress || ""}
                                        className="border border-gray-300 rounded-md px-3 py-2 resize-none 
                                        focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                ) : (
                                    <p className="text-gray-800 font-medium min-h-[3rem]">
                                        {userData?.permanentAddress || "-"}
                                    </p>
                                )}
                            </div>
                            {editText === "Address" && <>
                                <div></div>
                                <div className={`flex justify-end gap-3 items-center transition-all duration-300
                                    ${editText === "Address" ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                                    <button onClick={() => setEditText("")}
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
                                        Cancel
                                    </button>

                                    <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleSave}>
                                        Save
                                    </button>
                                </div>
                            </>}
                        </div>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-3 space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Documents
                            </h2>
                            <button className="p-2 rounded-full hover:bg-gray-100 transition" onClick={handleDocuments}>
                                <Pencil size={18} />
                            </button>
                        </div>

                        <div className="mt-4 space-y-3">
                            {userData?.documents?.length > 0 ? (
                                userData.documents.map((doc, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                                                📄
                                            </div>

                                            <span className="font-medium text-gray-800">
                                                {doc.type}
                                            </span>
                                        </div>

                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-blue-600 hover:underline"
                                        >
                                            View
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <X />
                                        </div>

                                        <span className="font-medium text-gray-800 text-sm">
                                            No documents uploaded yet.
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleDocuments}
                                        className="text-sm font-medium text-blue-600 hover:underline"
                                    >
                                        Add
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Social Media
                            </h2>
                            <button className="p-2 rounded-full hover:bg-gray-100 transition">
                                <Pencil size={18} />
                            </button>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                                <Facebook size={18} />
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
                                <Linkedin size={18} />
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition">
                                <Instagram size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                <Modal open={documentModal} onClose={() => setDocumentModal(false)}>
                    <Modal.Header title="Add Documents Here" />
                    <Modal.Body>
                        <div className="bg-white w-full max-w-md">
                            <select
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                className="input w-full mb-3"
                            >
                                <option value="">Select Document Type</option>
                                <option value="aadhaar">Aadhaar</option>
                                <option value="marksheet_10">Marksheet 10</option>
                                <option value="marksheet_12">Marksheet 12</option>
                                <option value="degree">Degree</option>
                                <option value="certificate">Certificate</option>
                            </select>

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

                            {file && (
                                <div className="mt-4 border rounded-lg p-3">
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Selected:</span> {file.name}
                                    </p>

                                    {previewDoc ? (
                                        <img
                                            src={previewDoc}
                                            alt="Preview"
                                            className="w-full h-40 object-contain rounded"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500">PDF preview not available</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex justify-end gap-2 w-full">
                            <button
                                onClick={() => setDocumentModal(false)}
                                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                Close
                            </button>

                            <button
                                onClick={() => uploadDocument()}
                                className="px-4 py-2 border rounded-lg text-white hover:bg-indigo-700 bg-indigo-600"
                            >
                                Add
                            </button>

                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}
