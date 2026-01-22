import { Mail, Phone, Camera, Pencil, Facebook, Linkedin, Instagram } from "lucide-react";
import { useEffect, useState } from "react";
import { BaseUrl } from "../../BaseApi/Api";
import "./Profile.css"
import toast from "react-hot-toast";
export default function MyProfile() {
    const UserId = localStorage.getItem("userId")
    const [userData, setUserData] = useState();
    const [editText, setEditText] = useState("");

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

    return (
        <div className="w-full px-3 py-4">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-3">
                    <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
                        <div className="relative w-28 h-28 mx-auto mb-3">
                            <img
                                src="https://via.placeholder.com/150"
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover border"
                            />
                            <label className="absolute bottom-1 right-1 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition">
                                <Camera size={16} className="text-white" />
                                <input type="file" className="hidden" />
                            </label>
                        </div>

                        <h2 className="text-lg font-semibold text-gray-800">{userData?.username || "User Name"}</h2>
                        <p className="text-sm text-gray-500 mt-1">{userData?.designation || "Job Designation"}</p>
                        <p className="text-sm text-gray-500">{userData?.email || "Email.com"}</p>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-6 space-y-4">
                    <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition">
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
                                    <p className="value">{userData?.dob.toString().split("T")[0] || "-"}</p>
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

                    <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition">
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

                    <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition">
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

                <div className="col-span-12 md:col-span-3">
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
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
            </div>
        </div>
    );
}
