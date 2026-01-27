import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// 🔥 DEMO ATTENDANCE DATA
// key = YYYY-MM-DD
const attendanceData = {
    "2026-01-02": "present",
    "2026-01-03": "absent",
    "2026-01-05": "leave",
    "2026-01-08": "present",
    "2026-01-10": "leave",
    "2026-01-12": "absent",
    "2026-01-15": "present",
};

export default function AttendanceCalendar() {
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date());

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const getStatusClass = (status) => {
        if (status === "present") return "bg-green-100 text-green-700";
        if (status === "leave") return "bg-yellow-100 text-yellow-700";
        if (status === "absent") return "bg-red-100 text-red-700";
        return "bg-gray-50";
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg md:p-6 p-2 w-full max-w-3xl mx-auto border">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full border bg-gray-50 hover:bg-indigo-50 transition"
                >
                    <ArrowLeft size={18} />
                </button>

                <h2 className="text-xl font-semibold text-gray-800">
                    {currentDate.toLocaleString("default", { month: "long" })} {year}
                </h2>

                <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-full border bg-gray-50 hover:bg-indigo-50 transition"
                >
                    <ArrowRight size={18} />
                </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-3">
                {days.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-7 gap-3">
                {/* Empty cells */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={i} />
                ))}

                {/* Days */}
                {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const status = attendanceData[dateKey];

                    const isToday =
                        day === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear();

                    return (
                        <div
                            key={day}
                            className={`h-20 rounded-xl flex flex-col items-center justify-center text-sm font-semibold cursor-pointer transition
    border border-gray-200
    ${getStatusClass(status)}
    ${isToday
                                    ? "border-2 border-indigo-500"
                                    : "hover:border-indigo-300 hover:shadow-sm"
                                }
  `}
                        >
                            <span>{day}</span>

                            {status && (
                                <span className="text-[10px] mt-1 capitalize opacity-80">
                                    {status}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-400 rounded-full" />
                    Present
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                    Leave
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-400 rounded-full" />
                    Absent
                </div>
            </div>
        </div>
    );
}
