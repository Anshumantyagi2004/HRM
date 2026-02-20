import { Eye, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import Calendar from "../../Components/Calendar/Calendar";
import { BaseUrl } from "../../BaseApi/Api";
import { Link } from "react-router-dom";

export default function Attendance() {
    const UserId = localStorage.getItem("userId")
    const [text, setText] = useState("Daily")
    const [todayAttendance, setTodayAttendance] = useState()
    const [allTodayAttendance, setAllTodayAttendance] = useState([])
    const [date, setdate] = useState(new Date().toISOString().split('T')[0]);
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

    const currentDate = new Date();
    const [year, setYear] = useState(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth());

    const hours = [
        "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM",
        "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM"
    ];

    const fetchAttendanceByDate = async (getDate = date) => {
        try {
            const res = await fetch(`${BaseUrl}attendanceByDate/${UserId}?date=${getDate}`);
            const data = await res.json();

            if (res.ok && data.attendance) {
                setTodayAttendance(data.attendance);
            } else {
                setTodayAttendance();
            }

        } catch (error) {
            console.info("Failed to fetch attendance");
        }
    };

    useEffect(() => {
        if (role == "Employee") {
            fetchAttendanceByDate();
        } else {
            fetchAdminAllAttendance()
        }
    }, [date])

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

    const formatDate = (date) => {
        if (!date) return "--";
        return new Date(date).toLocaleDateString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const formatWorkDuration = (minutes) => {
        if (!minutes) return "--";
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m`;
    };

    const formatLateBy = (minutes) => {
        if (!minutes || minutes <= 0) return "--";
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    const OFFICE_LOCATION = {
        latitude: 28.69865783085182,
        longitude: 77.11480389734629,
        radius: 100, // meters
    };

    const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3;
        const toRad = (v) => (v * Math.PI) / 180;

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

        return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const formatLocation = (loc) => {
        if (!loc) return "--";

        const distance = getDistanceInMeters(
            loc.latitude,
            loc.longitude,
            OFFICE_LOCATION.latitude,
            OFFICE_LOCATION.longitude
        );

        if (distance <= OFFICE_LOCATION.radius) {
            return "Registered Office";
        }

        return `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`;
    };

    const fetchAdminAllAttendance = async (getDate = date) => {
        try {
            const res = await fetch(`${BaseUrl}allUserAttendance/byDate?date=${getDate}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json", },
                }
            );
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Failed to fetch attendance");
            } else {
                // console.log(data);
                setAllTodayAttendance(data.data);
            }

        } catch (error) {
            console.info("Admin attendance error:", error);
            toast.error(error.message);
        }
    };

    const [attendanceList, setAttendanceList] = useState([]);
    const fetchMonthlyAttendance = async (year, month) => {
        try {
            const res = await fetch(`${BaseUrl}admin/attendance/month?year=${year}&month=${month + 1}`,
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json", },
                }
            );
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Failed to fetch attendance");
            } else {
                console.log(data);
                setAttendanceList(data.users);
            }

        } catch (error) {
            toast.error("Fetch Monthly Attendance Error:", error);
        }
    };

    const getMonthDays = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        return Array.from({ length: daysInMonth }, (_, i) => {
            const date = new Date(year, month, i + 1);
            return {
                day: i + 1,
                label: date.toLocaleDateString("en-IN", {
                    weekday: "short",
                }), // Mon, Tue
                key: date.toISOString().split("T")[0],
            };
        });
    };

    const monthDays = getMonthDays(year, month);
    const styles = {
        PRESENT: "bg-emerald-500",
        ABSENT: "bg-rose-500",
        ANOMALIES: "bg-amber-500",
        HALF_DAY: "bg-blue-500",
        WORK_FROM_HOME: "bg-indigo-500",
    };

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
                                    value={date}
                                    onChange={(e) => setdate(e.target.value)}
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
                    {text == "Daily" && (<>
                        {/* // <div className="w-full bg-white p-6 rounded-lg shadow"> */}
                        {/* <div className="relative border rounded-lg p-6">
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
                            </div> */}

                        <div className="mt-4 border rounded-lg overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-indigo-600 text-white">
                                        <th className="px-4 py-3 text-left">S No</th>
                                        <th className="px-4 py-3 text-left">ClockIn Time</th>
                                        <th className="px-4 py-3 text-left">ClockOut Time</th>
                                        <th className="px-4 py-3 text-left">Status</th>
                                        <th className="px-4 py-3 text-left">Date</th>
                                        <th className="px-4 py-3 text-left">Late by</th>
                                        <th className="px-4 py-3 text-left">Location</th>
                                        <th className="px-4 py-3 text-left">Work Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t">
                                        <td className="px-4 py-3">{todayAttendance ? "1" : "--"}</td>
                                        <td className="px-4 py-3">
                                            {formatDateTime(todayAttendance?.clockInTime)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatDateTime(todayAttendance?.clockOutTime)}
                                        </td>
                                        <td className="px-4 py-3 font-semibold">
                                            {todayAttendance?.status || "--"}
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatDate(todayAttendance?.clockInTime)}
                                        </td>
                                        <td className="px-4 py-3 text-red-600">
                                            {formatLateBy(todayAttendance?.lateBy)}
                                        </td>
                                        <td className="px-4 py-3">
                                            {formatLocation(todayAttendance?.userLocation)}
                                        </td>
                                        <td className="px-4 py-3 text-green-600">
                                            {formatWorkDuration(todayAttendance?.workDuration)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>)}

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
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-2 rounded-md"
                                onClick={() => setText("Daily")}>
                                Daily Log
                            </button>
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-2 rounded-md"
                                onClick={() => { setText("Monthly"); fetchMonthlyAttendance(year, month) }}>
                                Monthly Log
                            </button>
                        </div>
                        <div>
                            {text == "Daily" ?
                                <input
                                    type="date"
                                    className="input"
                                    value={date}
                                    onChange={(e) => setdate(e.target.value)}
                                />
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
                        <div className="mt-4 overflow-x-auto border rounded-lg">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-indigo-600 text-white text-left">
                                        <th className="px-4 py-3" style={{ width: "200px" }}>Emp Name</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">In Time</th>
                                        <th className="px-4 py-3">Late by</th>
                                        <th className="px-4 py-3">Out Time</th>
                                        <th className="px-4 py-3">Work Duration</th>
                                        <th className="px-4 py-3">Location</th>
                                        <th className="px-4 py-3">Designation</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {allTodayAttendance.map((i, idx) => (
                                        <tr className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 font-semibold text-md">
                                                <Link to={`/userProfile/${i?._id}`} className="flex items-center justify-start">
                                                    {i?.profileImage ?
                                                        <img src={i?.profileImage} alt={i?.username.slice(0, 1).toUpperCase()} className="w-8 h-8 rounded-full mr-2" />
                                                        : <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-2">
                                                            {i?.username.slice(0, 1).toUpperCase()}
                                                        </div>}
                                                    {i?.username}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button title={`${i?.attendance == null ? "Absent" : i?.attendance?.status == "ANOMALIES" ? "Late Arrive" : "Present"}`}
                                                    className={`h-8 w-8 rounded-full text-white text-sm font-bold flex items-center justify-center shadow-md
                                                            ${i?.attendance?.status == "PRESENT" ? "bg-emerald-500 hover:bg-emerald-600" : i?.attendance?.status == "ANOMALIES" ? "bg-yellow-400 hover:bg-yellow-500" : "bg-rose-500 hover:bg-rose-600"}`}>
                                                    {i?.attendance ? (i?.attendance?.status == "PRESENT" ? "P" : "AN") : "A"}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">{formatDateTime(i?.attendance?.clockInTime)}</td>
                                            <td className="px-4 py-3 text-red-600">{formatLateBy(i?.attendance?.lateBy)}</td>
                                            <td className="px-4 py-3">{formatDateTime(i?.attendance?.clockOutTime)}</td>
                                            <td className="px-4 py-3 text-green-600">{formatWorkDuration(i?.attendance?.workDuration)}</td>
                                            <td className="px-4 py-3">{formatLocation(i?.attendance?.userLocation)}</td>
                                            <td className="px-4 py-3">{i?.designation || "-"}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    //   onClick={() => handleOpen(emp)}
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                         bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition">
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>)}

                    {text == "Monthly" && (
                        <div className="mt-4">
                            <div className="w-full overflow-x-auto border rounded-lg">
                                <table className="min-w-max text-sm border-collapse">
                                    <thead>
                                        <tr className="bg-indigo-600 text-white">
                                            {/* Sticky Employee Column */}
                                            <th className="px-4 py-3 text-left sticky left-0 z-20 bg-indigo-600 border-r border-indigo-400">
                                                Emp Name
                                            </th>

                                            {/* Month Days */}
                                            {monthDays.map((d) => (
                                                <th
                                                    key={d.key}
                                                    className="px-3 py-2 text-center border-r border-indigo-400"
                                                >
                                                    <div className="text-xs">{d.day}</div>
                                                    <div className="text-[10px] opacity-80">{d.label}</div>
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {attendanceList.map((u, idx) => (
                                            <tr key={idx} className="border-b hover:bg-indigo-50">
                                                <td className="px-4 py-2 sticky left-0 bg-white z-10 border-r font-medium whitespace-nowrap">
                                                    {u.user.username}
                                                </td>

                                                {/* Attendance Cells */}
                                                {u.monthlyAttendance.map((d) => {
                                                    // const record = u.monthlyAttendance.find(
                                                    //     (a) => a.date === d.key
                                                    // );

                                                    return (
                                                        <td
                                                            // key={d.key}
                                                            className="px-2 py-2 text-center border-r"
                                                        >
                                                            <span
                                                                title={d?.status || "ABSENT"}
                                                                className={`h-7 w-7 rounded-full text-white text-xs font-bold
                                                                flex items-center justify-center shadow-sm
                                                                ${styles[d?.status || "ABSENT"] || "bg-gray-400"}`}>
                                                                {d?.status?.[0]}
                                                            </span>
                                                            {/* <StatusBadge status={record?.status || "ABSENT"} /> */}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>)}
                </div>
            </div>
        </div>
    }
    </>);
}
