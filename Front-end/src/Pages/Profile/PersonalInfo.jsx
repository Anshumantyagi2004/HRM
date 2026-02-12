import React from 'react'
import { Mail, Phone, Pencil, User, Contact, Calendar1, VenusAndMars, Droplet, HeartHandshake, LocationEdit, MapPinHouse, } from "lucide-react";

export default function PersonalInfo(props) {
    const {
        handleSavePersonal,
        setEditText,
        editText,
        userData,
        handleChange,
        formData
    } = props

    return (<>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <User size={18} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 h-8 w-8 p-1 rounded-full" />
                    Personal Information
                </h2>

                <button
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    onClick={() => setEditText("PersonalInfo")}
                >
                    <Pencil size={18} className="text-gray-600" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm p-2">
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <User size={18} className="text-indigo-600" />
                        Full Name
                    </label>
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
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Calendar1 size={18} className="text-indigo-600" />
                        DOB
                    </label>
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
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <VenusAndMars size={18} className="text-indigo-600" />
                        Gender
                    </label>
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
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Droplet size={18} className="text-indigo-600" />
                        Blood Group
                    </label>
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
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <HeartHandshake size={18} className="text-indigo-600" />
                        Marital Status
                    </label>
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

                    <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleSavePersonal}>
                        Save
                    </button>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <Contact size={20} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 h-9 w-9 p-1.5 rounded-full" />
                    Contact Information
                </h2>

                <button
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    onClick={() => setEditText("ContactInfo")}
                >
                    <Pencil size={18} className="text-gray-600" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm p-2">
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Mail size={16} className="text-indigo-600" /> Personal Email
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
                        <Mail size={16} className="text-indigo-600" /> Company Email
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
                        <Phone size={16} className="text-indigo-600" /> Contact
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
                        <Phone size={16} className="text-indigo-600" /> Alternate Contact
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

                        <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleSavePersonal}>
                            Save
                        </button>
                    </div>
                </>}
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <LocationEdit size={18} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 h-8 w-8 p-1.5 rounded-full" />
                    Addresses
                </h2>

                <button
                    className="p-2 rounded-full hover:bg-gray-100 transition"
                    onClick={() => setEditText("Address")}
                >
                    <Pencil size={18} className="text-gray-600" />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm p-2">
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <MapPinHouse size={16} className="text-indigo-600" />
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
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <MapPinHouse size={16} className="text-indigo-600" />
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

                        <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" onClick={handleSavePersonal}>
                            Save
                        </button>
                    </div>
                </>}
            </div>
        </div>
    </>)
}
