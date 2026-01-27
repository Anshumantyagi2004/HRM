import { Eye, Search } from "lucide-react";
import React, { useState } from "react";
import Calendar from "../../Components/Calendar/Calendar";

export default function Attendance() {
    const [text, setText] = useState("Daily")
    const role = localStorage.getItem("userRole")

    const months = [
        { name: "January", id: 0 },
        { name: "February", id: 1 },
        { name: "March", id: 2 },
        { name: "April", id: 3 },
        { name: "May", id: 4 },
        { name: "June", id: 5 },
        { name: "July", id: 6 },
        { name: "August", id: 7 },
        { name: "September", id: 8 },
        { name: "October", id: 9 },
        { name: "November", id: 10 },
        { name: "December", id: 11 },
    ];

    const years = [2022, 2023, 2024, 2025, 2026];
    const [year, setYear] = useState(2026);
    const [month, setMonth] = useState(0);

    const getDaysInMonth = (year, month) => {
        const days = [];
        const totalDays = new Date(year, month + 1, 0).getDate();

        for (let day = 1; day <= totalDays; day++) {
            const date = new Date(year, month, day);
            days.push({
                dayNumber: day,
                dayName: date.toLocaleString("default", { weekday: "short" }),
            });
        }

        return days;
    };

    const monthDays = getDaysInMonth(year, month);
    const hours = [
        "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM",
        "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM"
    ];

    const DailyAdmin = [
        { name: "Anshuman", status: "A", inTime: "-", location: "-", designation: "Web Developer" },
        { name: "Test", status: "P", inTime: "9:45", location: "Office", designation: "Seo" },
        { name: "Test2", status: "P", inTime: "9:17", location: "Office", designation: "Sales" },
    ];

    return (<>{role == "Employee" ?
        <div className="w-full px-1 md:px-3">
            <div className="bg-white shadow-md rounded-xl hover:shadow-lg transition md:p-5 p-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Attendance log</h2>
                    <div className="relative w-full sm:w-64">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-2 rounded-md"
                                onClick={() => setText("Daily")}>
                                Daily Log
                            </button>
                            <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-2 rounded-md"
                                onClick={() => setText("Monthly")}>
                                Monthly Log
                            </button>
                        </div>
                        <div>
                            {text == "Daily" ?
                                <input type="date"
                                    className="input" />
                                :
                                <div className="flex gap-2">
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
                                </div>}
                        </div>
                    </div>
                    {text == "Daily" && (
                        <div className="w-full bg-white p-6 rounded-lg shadow">
                            <div className="relative border rounded-lg p-6">
                                <div className="absolute inset-0 grid grid-cols-12 gap-0">
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <div key={i} className="border-r border-dashed border-gray-200" />
                                    ))}
                                </div>

                                <div className="relative z-10 flex justify-between">

                                    <div>
                                        <p className="italic text-sm mb-2">Anomalies</p>
                                        <div className="w-64 h-10 bg-blue-100 rounded"></div>
                                    </div>

                                    <div>
                                        <p className="italic text-sm mb-2 text-right">Summary</p>
                                        <div className="bg-blue-100 p-4 rounded flex gap-8 text-sm">
                                            <div>
                                                <p className="font-medium">Work Duration</p>
                                                <p className="text-center">-</p>
                                            </div>
                                            <div>
                                                <p className="font-medium">Break Duration</p>
                                                <p className="text-center">-</p>
                                            </div>
                                            <div>
                                                <p className="font-medium">Overtime Duration</p>
                                                <p className="text-center">-</p>
                                            </div>
                                        </div>

                                        {/* Legend */}
                                        <div className="mt-4 space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 bg-blue-600 inline-block"></span>
                                                No Anomalies
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 bg-pink-500 inline-block"></span>
                                                Clockin-Clockout IP Mismatch
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-3 h-3 bg-orange-400 inline-block"></span>
                                                Auto Logged Out
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="relative mt-12">
                                    <div className="h-2 bg-gray-200 rounded"></div>
                                    <div className="absolute top-0 left-[5%] w-[70%] h-2 bg-blue-600 rounded"></div>
                                </div>

                                <div className="flex justify-between text-xs mt-3 text-gray-600">
                                    {hours.map((h) => (
                                        <span key={h}>{h}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-indigo-600 text-white">
                                            <th className="px-4 py-3 text-left">Sl No</th>
                                            <th className="px-4 py-3 text-left">Time</th>
                                            <th className="px-4 py-3 text-left">Type</th>
                                            <th className="px-4 py-3 text-left">IP Address</th>
                                            <th className="px-4 py-3 text-left">Location</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t">
                                            <td className="px-4 py-3">1</td>
                                            <td className="px-4 py-3">09:15 AM</td>
                                            <td className="px-4 py-3">Clock In</td>
                                            <td className="px-4 py-3">192.168.1.1</td>
                                            <td className="px-4 py-3">Delhi</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>)}

                    {text == "Monthly" && (
                        <div className="mt-4 overflow-auto h-80">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-indigo-600 text-white text-left sticky top-0">
                                        <th className="px-4 py-3 border-r border-indigo-400">Date</th>
                                        <th className="px-4 py-3 border-r border-indigo-400">Status</th>
                                        <th className="px-4 py-3 border-r border-indigo-400">In Time</th>
                                        <th className="px-4 py-3 border-r border-indigo-400">Out Time</th>
                                        <th className="px-4 py-3 border-r border-indigo-400">Work Duration</th>
                                        <th className="px-4 py-3 text-center border-r border-indigo-400">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {monthDays.map((i, idx) => (
                                        <tr className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{i?.dayNumber} {i?.dayName}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>)}
                </div>
            </div>
        </div>
        :
        <div className="w-full px-1 md:px-3">
            <div className="bg-white shadow-md rounded-xl hover:shadow-lg transition md:p-5 p-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Attendance log</h2>
                    <div className="relative w-full sm:w-64">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-2 rounded-md"
                                onClick={() => setText("Daily")}>
                                Daily Log
                            </button>
                            <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-2 rounded-md"
                                onClick={() => setText("Monthly")}>
                                Monthly Log
                            </button>
                        </div>
                        <div>
                            {text == "Daily" ?
                                <input type="date"
                                    className="input" />
                                :
                                <div className="flex gap-2">
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
                                </div>}
                        </div>
                    </div>
                    {text == "Daily" && (
                        <div className="mt-4">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-indigo-600 text-white text-left">
                                            <th className="px-4 py-3">Emp Name</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3">In Time</th>
                                            <th className="px-4 py-3">Out Time</th>
                                            <th className="px-4 py-3">Work Duration</th>
                                            <th className="px-4 py-3">Location</th>
                                            <th className="px-4 py-3">Designation</th>
                                            <th className="px-4 py-3">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {DailyAdmin.map((i, idx) => (
                                            <tr className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3">{i?.name}</td>
                                                <td className="px-4 py-3">
                                                    <button className={`${i?.status == "A" && "bg-red-600 text-white h-6 w-6 rounded-md"} ${i?.status == "P" && "bg-green-600 text-white h-6 w-6 rounded-md"}`}>
                                                        {i?.status}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3">{i?.inTime}</td>
                                                <td className="px-4 py-3">{i?.outTime || "-"}</td>
                                                <td className="px-4 py-3">{i?.outTime || "-"}</td>
                                                <td className="px-4 py-3">{i?.location}</td>
                                                <td className="px-4 py-3">{i?.designation}</td>
                                                <td className="px-4 py-3"><Eye /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>)}

                    {text == "Monthly" && (
                        <div className="mt-4">
                            <div className="w-full overflow-x-auto border rounded-lg">
                                <table className="min-w-max text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-indigo-600 text-white">
                                            {/* Sticky Header */}
                                            <th
                                                className="px-4 py-3 text-left sticky left-0 z-20 bg-indigo-600 border-r border-indigo-400"
                                            >
                                                Emp Name
                                            </th>

                                            {monthDays.map((d) => (
                                                <th
                                                    key={d.dayNumber}
                                                    className="px-4 py-3 text-center whitespace-nowrap border-r border-indigo-400"
                                                >
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">{d.dayNumber}</span>
                                                        <span className="text-xs">{d.dayName}</span>
                                                    </div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {["Anshuman Tyagi", "Test", "Test1"].map((emp) => (
                                            <tr key={emp} className="border-b hover:bg-gray-50">
                                                <td
                                                    className="px-1 py-2 font-medium sticky left-0 bg-white z-10"
                                                >
                                                    {emp}
                                                </td>

                                                {monthDays.map((d) => (
                                                    <td
                                                        key={d.dayNumber}
                                                        className="px-1 py-2 text-center justify-center justify-items-center"
                                                    >
                                                        <div className="w-7 h-7 rounded-md bg-green-500 text-white flex justify-center items-center">P</div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>)}
                </div>
            </div>
        </div>}
    </>);
}
