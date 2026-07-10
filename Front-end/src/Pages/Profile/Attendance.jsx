import { Eye } from 'lucide-react'
import React from 'react'
import { months, years } from '../../Data/data';

export default function Attendance({ user, userAttendance, year, setYear, month, setMonth }) {
    const formatDateTime = (date) => {
        if (!date) return "--";
        return new Date(date).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatWorkDuration = (minutes) => {
        if (!minutes) return "--";
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };
    // console.log(userAttendance)
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-end gap-2">
                <select
                    className="input"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                >
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>

                <select
                    className="input"
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                >
                    {months.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className='h-80 mt-2 overflow-x-scroll'>
                <table className="w-full text-sm">
                    <thead className='top-0 sticky z-50'>
                        <tr className="bg-gray-800 text-white text-left sticky top-0">
                            <th className="px-4 py-3 border-r border-indigo-400">Date</th>
                            <th className="px-4 py-3 border-r border-indigo-400">Status</th>
                            <th className="px-4 py-3 border-r border-indigo-400">In Time</th>
                            <th className="px-4 py-3 border-r border-indigo-400">Out Time</th>
                            <th className="px-4 py-3 border-r border-indigo-400">Work Duration</th>
                            {/* <th className="px-4 py-3 text-center border-r border-indigo-400">Action</th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {userAttendance.map((item, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                <td className="p-2 border-r">
                                    {item.date}
                                </td>
                                <td className="p-2 border-r font-semibold flex items-center gap-2">
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold text-white
                                    ${item.status === "PRESENT" ? "bg-emerald-500"
                                            : item.status === "ANOMALIES" ? "bg-amber-500"
                                                : item.status === "HALF_DAY" ? "bg-indigo-500"
                                                    : item.status === "LEAVE" ? "bg-blue-500"
                                                        : item.status === "HOLIDAY" ? "bg-purple-500"
                                                            : item.status === "SUNDAY" ? "bg-orange-500"
                                                                : item.status === "NA" ? "bg-gray-400"
                                                                    : "bg-rose-500"}`}>
                                        {item.status === "LEAVE" ? item.leaveType : item.status === "HOLIDAY" ? "Holiday" : item.status === "SUNDAY" ? "Sunday" : item.status}
                                    </span>

                                    {item.status === "HOLIDAY" && item.holidayTitle && (
                                        <div className="text-[10px] text-purple-600">
                                            {item.holidayTitle}
                                        </div>
                                    )}
                                </td>
                                <td className="p-2 border-r">
                                    {formatDateTime(item.clockInTime)}
                                </td>
                                <td className="p-2 border-r">
                                    {formatDateTime(item.clockOutTime)}
                                </td>
                                <td className="p-2 border-r">
                                    {formatWorkDuration(item.workDuration)}
                                </td>
                                {/* <td className="p-2 text-center">
                                    <button
                                        //   onClick={() => handleOpen(emp)}
                                        className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                         bg-indigo-50 text-gray-800 hover:bg-indigo-100 transition">
                                        <Eye size={18} />
                                    </button>
                                </td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
