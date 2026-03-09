import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AttendanceCalendar({
    attendance = {},
    holidays = [],
    getDashboardCalendar,
    mode,
}) {

    const holidayMap = {};
    holidays.forEach((h) => {
        const key = new Date(h.date).toISOString().split("T")[0];
        holidayMap[key] = h.title;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [currentDate, setCurrentDate] = useState(new Date());
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    const handlePrevMonth = () => {
        const newDate = new Date(year, month - 1, 1);
        setCurrentDate(newDate);

        if (getDashboardCalendar) {
            getDashboardCalendar(newDate.getMonth() + 1, newDate.getFullYear());
        }
    };

    const handleNextMonth = () => {
        const newDate = new Date(year, month + 1, 1);
        setCurrentDate(newDate);

        if (getDashboardCalendar) {
            getDashboardCalendar(newDate.getMonth() + 1, newDate.getFullYear());
        }
    };

    const getStatusClass = (status) => {
        if (status === "HOLIDAY")
            return "bg-orange-100 text-orange-700 border-orange-300";

        if (status === "SUNDAY")
            return "bg-orange-50 text-orange-700 border-orange-200";

        if (status === "PRESENT")
            return "bg-green-100 text-green-700";

        if (status === "ANOMALIES")
            return "bg-blue-100 text-blue-700";

        if (status === "HALF_DAY")
            return "bg-yellow-100 text-yellow-700";

        if (status === "ABSENT")
            return "bg-red-100 text-red-700";

        if (status === "NA")
            return "bg-white text-gray-700";

        return "bg-gray-50";
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg md:p-6 p-2 w-full max-w-3xl mx-auto border">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handlePrevMonth}
                    className="p-2 rounded-full border bg-gray-50 hover:bg-indigo-50 transition"
                >
                    <ArrowLeft size={18} />
                </button>

                <h2 className="text-2xl font-semibold text-gray-800">
                    {currentDate.toLocaleString("default", { month: "long" })} {year}
                </h2>

                <button
                    onClick={handleNextMonth}
                    className="p-2 rounded-full border bg-gray-50 hover:bg-indigo-50 transition"
                >
                    <ArrowRight size={18} />
                </button>
            </div>

            <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-3">
                {days.map((day) => (
                    <div key={day}>{day}</div>
                ))}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-7 gap-3">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={i} />
                ))}

                {/* Days */}
                {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const holiday = holidayMap[dateKey];
                    const statusFromDB = attendance[dateKey];
                    const cellDate = new Date(year, month, day);
                    const isSunday = cellDate.getDay() === 0;
                    let status = null;

                    if (mode === "holiday") {
                        if (holiday) {
                            status = "HOLIDAY";
                        }
                    } else {
                        if (holiday) {
                            status = "HOLIDAY";
                        }
                        else if (statusFromDB && !(isSunday && statusFromDB === "ABSENT")) {
                            // If attendance exists and it's not Sunday ABSENT
                            status = statusFromDB;
                        }
                        else if (cellDate > today) {
                            status = "NA";
                        }
                        else if (isSunday) {
                            // Any Sunday without valid attendance should show Sunday
                            status = "SUNDAY";
                        }
                        else if (cellDate < today) {
                            status = "ABSENT";
                        }
                    }

                    const isToday =
                        day === today.getDate() &&
                        month === today.getMonth() &&
                        year === today.getFullYear();

                    return (
                        <div key={day}
                            className={`h-20 rounded-xl flex flex-col items-center justify-center text-sm font-semibold cursor-pointer transition border border-gray-200
                        ${status ? getStatusClass(status) : "bg-white"} ${isToday ? "border-2 border-indigo-500" : "hover:border-indigo-300 hover:shadow-sm"}`}>

                            <span>{day}</span>

                            {status === "HOLIDAY" && (
                                <span className="text-[10px] mt-1 font-semibold text-orange-600">
                                    {holiday}
                                </span>
                            )}

                            {status === "SUNDAY" && (
                                <span className="text-[10px] mt-1 text-orange-500">
                                    Sunday
                                </span>
                            )}

                            {status === "PRESENT" && (
                                <span className="text-[10px] mt-1 text-green-600">
                                    Present
                                </span>
                            )}

                            {status === "HALF_DAY" && (
                                <span className="text-[10px] mt-1 text-yellow-600">
                                    Half Day
                                </span>
                            )}

                            {status === "ANOMALIES" && (
                                <span className="text-[10px] mt-1 text-blue-600">
                                    Anomalies
                                </span>
                            )}

                            {status === "ABSENT" && (
                                <span className="text-[10px] mt-1 text-red-600">
                                    Absent
                                </span>
                            )}

                            {status === "NA" && (
                                <span className="text-[10px] mt-1 text-gray-400">
                                    NA
                                </span>
                            )}

                        </div>
                    );
                })}
            </div>

            {mode === "dashboard" && Object.keys(attendance).length !== 0 && (
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
            )}
        </div>
    );
}