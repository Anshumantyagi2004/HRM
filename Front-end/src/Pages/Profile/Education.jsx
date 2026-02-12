import React from 'react'
import { Pencil, X, University, GraduationCap, Award, NotebookPen, CalendarDays, School, Trash2, BookOpen, BadgePercent, Edit, } from "lucide-react";

export default function Education(props) {
    const {
        userQualification,
        setQualificationModal,
        setFormDataEdu,
        setEduEdit,
        deleteEducation,

    } = props

    return (<>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <NotebookPen size={18} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 h-8 w-8 p-1.5 rounded-full" />
                    Education
                </h2>
                <button className="p-2 rounded-full hover:bg-gray-100 transition" onClick={() => setQualificationModal(true)}>
                    <Pencil size={18} />
                </button>
            </div>

            <div className="mt-2 space-y-2">
                {userQualification?.length > 0 ? (
                    userQualification.map((edu, index) => (
                        <div key={index}
                            className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 
                                         hover:border-indigo-300 hover:shadow-sm transition-all duration-200">
                            <div className="flex items-center justify-between border-b pb-1">
                                <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                                    {edu?.qualificationType === "Certificate" ? (
                                        <Award className="text-indigo-500" size={22} />
                                    ) : (
                                        <GraduationCap className="text-indigo-500" size={22} />
                                    )}
                                    {edu?.qualificationType}
                                </h2>

                                <div className="flex gap-2 items-center">
                                    <button onClick={() => { setQualificationModal(true); setFormDataEdu(edu); setEduEdit(true) }} className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                 bg-indigo-50 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-600 transition"
                                        title="Edit">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => deleteEducation(edu)} className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition"
                                        title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-base text-gray-700">
                                <p className="flex items-center gap-2 font-medium">
                                    <School size={18} className="text-indigo-500" />
                                    {edu?.collegeName}
                                </p>
                                <p className="flex items-center gap-2">
                                    <University size={18} className="text-indigo-500" />
                                    {edu?.universityName}
                                </p>
                                <p className="flex items-center gap-2">
                                    <BookOpen size={18} className="text-indigo-500" />
                                    {edu?.courseName}
                                </p>
                                <p className="flex items-center gap-2">
                                    <GraduationCap size={20} className="text-indigo-500" />
                                    {edu?.courseType}
                                </p>
                                <p className="flex items-center gap-2">
                                    <CalendarDays size={18} className="text-indigo-500" />
                                    {new Date(edu?.courseStartDate)?.toISOString().split("T")[0]} -&nbsp;
                                    {new Date(edu?.courseEndDate)?.toISOString().split("T")[0]}
                                    {/* {edu?.courseStartDate} — {edu?.courseEndDate} */}
                                </p>
                                <p className="flex items-center gap-2">
                                    <BadgePercent size={20} className="text-indigo-500" />
                                    A+
                                </p>
                            </div>
                        </div>))
                ) : (
                    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                                <X />
                            </div>

                            <span className="font-medium text-gray-800 text-sm">
                                No education added yet.
                            </span>
                        </div>

                        <button
                            onClick={() => setQualificationModal(true)}
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            Add
                        </button>
                    </div>
                )}
            </div>
        </div>
    </>)
}
