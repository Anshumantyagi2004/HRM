import React from 'react'
import { Pencil, X, CalendarDays, Trash2, Building2, Edit, Calendar1, LocationEdit, BriefcaseBusiness, IdCardLanyard, MonitorCog, Briefcase, CalendarClock, Computer, } from "lucide-react";

export default function Work(props) {
    const {
        setEditText,
        editText,
        workInfo,
        addWork,
        handleChangeWorkInfo,
        workInfoForm,
        setWorkModal,
        setWorkHistoryForm,
        setWorkEdit
    } = props

    return (<>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <BriefcaseBusiness size={18} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 h-8 w-8 p-1.5 rounded-full" />
                    Work Info
                </h2>
                <button className="p-2 rounded-full hover:bg-gray-100 transition" onClick={() => setEditText("workInfo")}>
                    <Pencil size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm p-2">
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <IdCardLanyard size={18} className="text-indigo-600" />
                        Employee ID
                    </label>
                    {editText === "workInfo" ? (
                        <input
                            name="empId"
                            onChange={handleChangeWorkInfo}
                            value={workInfoForm?.empId || workInfo?.empId || ""}
                            className="input"
                        />
                    ) : (
                        <p className="value">{workInfo?.empId || "-"}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Calendar1 size={18} className="text-indigo-600" />
                        Date of Joining
                    </label>
                    {editText === "workInfo" ? (
                        <input
                            type="date"
                            name="joiningDate"
                            onChange={handleChangeWorkInfo}
                            value={workInfoForm?.joiningDate || workInfo?.joiningDate || ""}
                            className="input"
                        />
                    ) : (
                        <p className="value">{workInfo?.joiningDate || "-"}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <MonitorCog size={18} className="text-indigo-600" />
                        Employee Type
                    </label>
                    {editText === "workInfo" ? (
                        <select className="input"
                            name="empType"
                            onChange={handleChangeWorkInfo}
                            value={workInfoForm?.empType || workInfo?.empType || ""}
                        >
                            <option value="" disabled>Select</option>
                            <option>Full Time</option>
                            <option>Part Time</option>
                            <option>Intern</option>
                        </select>
                    ) : (
                        <p className="value">{workInfo?.empType || "-"}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <LocationEdit size={18} className="text-indigo-600" />
                        Work Location
                    </label>
                    {editText === "workInfo" ? (
                        <input
                            type="text"
                            name="workLocation"
                            onChange={handleChangeWorkInfo}
                            value={workInfoForm?.workLocation || workInfo?.workLocation || ""}
                            className="input"
                        />
                    ) : (
                        <p className="value">{workInfo?.workLocation || "-"}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Briefcase size={18} className="text-indigo-600" />
                        Designation
                    </label>
                    {editText === "workInfo" ? (
                        <select className="input"
                            name="designation"
                            onChange={handleChangeWorkInfo}
                            value={workInfoForm?.designation || workInfo?.designation || ""}
                        >
                            <option value="" disabled>Select</option>
                            <option value="Web Solutions">Web Solutions</option>
                            <option value="SEO">SEO</option>
                            <option value="Ads Manger">Ads Manger</option>
                            <option value="Social Media">Social Media</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="Other">Other</option>
                        </select>
                    ) : (
                        <p className="value">{workInfo?.designation || "-"}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Briefcase size={18} className="text-indigo-600" />
                        Department
                    </label>
                    {editText === "workInfo" ? (
                        <select className="input"
                            name="department"
                            onChange={handleChangeWorkInfo}
                            value={workInfoForm?.department || workInfo?.department || ""}
                        >
                            <option value="" disabled>Select</option>
                            <option value="Full Stack Developer">Full Stack Developer</option>
                            <option value="Wordpress Developer">Wordpress Developer</option>
                            <option value="SEO">SEO</option>
                            <option value="Ads Manger">Ads Manger</option>
                            <option value="Social Media">Social Media</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="Other">Other</option>
                        </select>
                    ) : (
                        <p className="value">{workInfo?.department || "-"}</p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <CalendarClock size={18} className="text-indigo-600" />
                        Work Experince
                    </label>
                    {editText === "workInfo" ? (
                        <input
                            type="input"
                            name="workExperince"
                            onChange={handleChangeWorkInfo}
                            value={workInfoForm?.workExperince || workInfo?.workExperince || ""}
                            className="input"
                        />
                    ) : (
                        <p className="value">{workInfo?.workExperince || "-"}</p>
                    )}
                </div>

                <div className={`flex justify-end gap-3 items-end transition-all duration-300
                                ${editText === "workInfo"
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}>
                    <button onClick={() => setEditText("")}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
                        Cancel
                    </button>

                    <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" onClick={addWork}>
                        Save
                    </button>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                    Work History
                </h2>
                <button className="p-2 rounded-full hover:bg-gray-100 transition" onClick={() => setWorkModal(true)}>
                    <Pencil size={18} />
                </button>
            </div>

            <div className="mt-2 space-y-2">
                {workInfo?.workHistory?.length > 0 ? (
                    workInfo?.workHistory.map((i, idx) => (
                        <div key={idx} className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 
                                         hover:border-indigo-300 hover:shadow-sm transition-all duration-200">
                            <div className="flex items-center justify-between border-b pb-1">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                                    <Building2 className="text-indigo-500" size={22} />
                                    {i?.orgName}
                                </h2>

                                <div className="flex gap-2 items-center">
                                    <button onClick={() => { setWorkModal(true); setWorkHistoryForm(i); setWorkEdit(true) }} className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                 bg-indigo-50 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-600 transition"
                                        title="Edit">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => ""} className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition"
                                        title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-base text-gray-700">
                                <p className="flex items-center gap-2 font-medium">
                                    <Computer size={18} className="text-indigo-500" />
                                    {i?.department}
                                </p>
                                <p className="flex items-center gap-2">
                                    <Briefcase size={18} className="text-indigo-500" />
                                    {i?.designation}
                                </p>
                                <p className="flex items-center gap-2">
                                    <CalendarDays size={18} className="text-indigo-500" />
                                    {new Date(i?.from)?.toISOString().split("T")[0]} -&nbsp;
                                    {new Date(i?.to)?.toISOString().split("T")[0]}
                                </p>
                                <p className="flex items-center gap-2">
                                    <LocationEdit size={20} className="text-indigo-500" />
                                    {i?.orgLocation}
                                </p>
                            </div>
                        </div>
                    )))
                    : <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                                <X />
                            </div>

                            <span className="font-medium text-gray-800 text-sm">
                                No work history added yet.
                            </span>
                        </div>

                        <button
                            onClick={() => setWorkModal(true)}
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            Add
                        </button>
                    </div>}
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                    Resignation Info
                </h2>
                <button className="p-2 rounded-full hover:bg-gray-100 transition" onClick={() => ""}>
                    <Pencil size={18} />
                </button>
            </div>

            <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                            <X />
                        </div>

                        <span className="font-medium text-gray-800 text-sm">
                            No resignation info added yet.
                        </span>
                    </div>

                    <button
                        // onClick={() => setQualificationModal(true)}
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    </>)
}
