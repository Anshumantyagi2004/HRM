import React, { useEffect, useState } from 'react'
import Calendar from "../../Components/Calendar/Calendar";
import { BaseUrl } from "../../BaseApi/Api";
import { Link } from 'react-router-dom';
import {
    ToggleButton,
    ToggleButtonGroup,
    FormControl,
    Select,
    MenuItem
} from "@mui/material";
import PayrollGraph from '../../Components/Dashboard/Graph';

export default function AdminDashboard(props) {
    const { user } = props

    const [allTodayAttendance, setAllTodayAttendance] = useState([])
    const [date, setdate] = useState(new Date().toISOString().split('T')[0]);
    const [allUsers, setAllUsers] = useState([])

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
                console.log(data.message || "Failed to fetch attendance");
            } else {
                setAllTodayAttendance(data.data);
            }

        } catch (error) {
            console.info("Admin attendance error:", error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchAdminAllAttendance()
        async function fetchLeaveBal() {
            try {
                const res = await fetch(BaseUrl + "allUserLeaveInfo", {
                    credentials: "include",
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
                setAllUsers(data.data);
            } catch (error) {
                console.error("Fetch profile error:", error);
                throw error;
            }
        };
        fetchLeaveBal()
    }, [date])

    const presentCount = allTodayAttendance.filter(
        (i) => i?.attendance?.status === "PRESENT"
    ).length;

    const anomalyCount = allTodayAttendance.filter(
        (i) => i?.attendance?.status === "ANOMALIES"
    ).length;

    const leaveCount = allTodayAttendance.filter(
        (i) => i?.attendance?.status === "LEAVE"
    ).length;

    const absentCount = allTodayAttendance.filter(
        (i) => !i?.attendance
    ).length;

    console.log(allUsers)

    const [view, setView] = useState("monthly");
    const mainLabel = view === "monthly" ? "₹ CTC" : "₹ Salary";

    const handleViewChange = (e, val) => {
        if (val !== null) setView(val);
    };

    const monthlyData = {
        rahul: [50000, 52000, 50000, 54000, 53000, 55000, 53000, 50000, 53000, 55000, 53000, 50000],
        neha: [45000, 46000, 47000, 48000, 47000, 49000],
        amit: [60000, 62000, 61000, 63000, 64000, 65000],
    };

    const yearlyData = {
        rahul: [240000, 24000, 12000, 12000, 12000, 0, 0, 0],
        neha: [540000],
        amit: [720000],
    };

    const dataset = view === "monthly" ? monthlyData["rahul"] : yearlyData["rahul"];

    const labels =
        view === "monthly"
            ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Semp", "Oct", "Nov", "Dec"]
            : ["Basic Pay", "HRA", "Bonus", "Special Allo", "TA/DA", "Med Allo", "Variable", "EPF"];

    return (
        <div className="w-full px-3 mb-4">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-3">
                    <div className="bg-white shadow-md rounded-xl md:p-5 p-3 transition hover:shadow-lg">
                        <h2 className="mb-4 font-medium text-xl text-indigo-600 text-center">
                            Today Attendance
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center shadow-sm">
                                <p className="text-sm text-green-700 font-medium">Present</p>
                                <h1 className="text-3xl font-bold text-green-700">{presentCount}</h1>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center shadow-sm">
                                <p className="text-sm text-blue-700 font-medium">Anomaly</p>
                                <h1 className="text-3xl font-bold text-blue-700">{anomalyCount}</h1>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center shadow-sm">
                                <p className="text-sm text-yellow-700 font-medium">Leave</p>
                                <h1 className="text-3xl font-bold text-yellow-700">{leaveCount}</h1>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center shadow-sm">
                                <p className="text-sm text-red-700 font-medium">Absent</p>
                                <h1 className="text-3xl font-bold text-red-700">{absentCount}</h1>
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto space-y-2 mt-4">
                            {allTodayAttendance.map((i, idx) => {
                                const status = i?.attendance?.status
                                const getStatus = () => {
                                    if (!i?.attendance) return { label: "A", color: "bg-red-500", title: "Absent" }
                                    if (status === "PRESENT") return { label: "P", color: "bg-emerald-500", title: "Present" }
                                    if (status === "ANOMALIES") return { label: "AN", color: "bg-yellow-400", title: "Anomalies" }
                                    if (status === "HALF_DAY") return { label: "HD", color: "bg-blue-500", title: "Half Day" }
                                    return { label: "A", color: "bg-red-500", title: "Absent" }
                                }
                                const s = getStatus()

                                return (
                                    <div key={idx}
                                        className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-lg px-3 py-2 border">
                                        <Link to={`/userProfile/${i?._id}`} className="flex items-center gap-2">
                                            {i?.profileImage ? (
                                                <img
                                                    src={i.profileImage}
                                                    alt={i?.username}
                                                    className="w-9 h-9 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                                                    {i?.username?.slice(0, 1).toUpperCase()}
                                                </div>
                                            )}

                                            <span className="text-sm font-medium text-gray-700">
                                                {i?.username}
                                            </span>
                                        </Link>

                                        <button className={`h-8 w-8 rounded-full text-white text-xs font-bold flex items-center justify-center shadow ${s.color}`} title={s.title}>
                                            {s.label}
                                        </button>
                                    </div>)
                            })}
                        </div>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-6">
                    <div className="bg-white shadow-md rounded-xl md:p-5 p-3 flex flex-col transition hover:shadow-lg">
                        <h2 className="mb-4 font-medium text-xl text-indigo-600 flex justify-between items-center">
                            Payroll
                            <div className='flex items-center gap-2'>
                                <select name="" className='input text-sm font-normal' id="">
                                    {allUsers.map((i, idx) => (
                                        <option value="" key={idx}>{i?.username}</option>
                                    ))}
                                </select>
                                <ToggleButtonGroup
                                    size="small"
                                    value={view}
                                    exclusive
                                    onChange={handleViewChange}
                                >
                                    <ToggleButton value="monthly">Monthly</ToggleButton>
                                    <ToggleButton value="yearly">Yearly</ToggleButton>
                                </ToggleButtonGroup>
                            </div>
                        </h2>
                        <PayrollGraph
                            labels={labels}
                            dataset={dataset}
                            mainLabel={mainLabel}
                        />
                        <div className="border border-indigo-200 bg-indigo-50 rounded-xl py-3 px-2 shadow-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">

                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <p className="text-sm text-indigo-500 font-medium">Total Employees</p>
                                    <p className="text-2xl font-bold text-indigo-700">{allUsers?.length}</p>
                                </div>

                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <p className="text-sm text-indigo-500 font-medium">Gross Pay</p>
                                    <p className="text-2xl font-bold text-indigo-700">₹85,000</p>
                                </div>

                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <p className="text-sm text-indigo-500 font-medium">Net Pay</p>
                                    <p className="text-2xl font-bold text-indigo-700">₹85,000</p>
                                </div>

                                <div className="bg-white rounded-lg p-4 shadow-sm">
                                    <p className="text-sm text-indigo-500 font-medium">Total Payout</p>
                                    <p className="text-2xl font-bold text-indigo-700">0</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-3">
                    <div className="bg-white shadow-md rounded-xl md:p-5 p-2 flex flex-col transition hover:shadow-lg">
                        <h2 className="mb-3 font-medium text-xl text-indigo-600 text-center">
                            Leave Balance
                        </h2>

                        <div className="grid grid-cols-4 text-sm font-semibold text-gray-500 px-3 pb-2 border-b">
                            <p>Employee</p>
                            <p className="text-center">CL</p>
                            <p className="text-center">SL</p>
                            <p className="text-center">CO</p>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto space-y-2 mt-3">
                            {allUsers.map((i, idx) => (
                                <div key={idx}
                                    className="grid grid-cols-4 items-center bg-gray-50 hover:bg-gray-100 transition rounded-lg px-3 py-2 border">
                                    <Link
                                        to={`/userProfile/${i?._id}`}
                                        className="flex items-center gap-2"
                                    >
                                        {/* {i?.profileImage ? (
                                            <img
                                                src={i.profileImage}
                                                alt={i?.username}
                                                className="w-9 h-9 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-semibold">
                                                {i?.username?.slice(0, 1).toUpperCase()}
                                            </div>
                                        )} */}

                                        <span className="text-sm font-medium text-gray-700">
                                            {i?.username}
                                        </span>
                                    </Link>

                                    <p className="text-center font-medium text-green-600">
                                        {i?.userExtraDetail?.[0]?.casualLeaveRemaining ?? "-"}
                                    </p>

                                    <p className="text-center font-medium text-yellow-600">
                                        {i?.userExtraDetail?.[0]?.sickLeaveRemaining ?? "-"}
                                    </p>

                                    <p className="text-center font-medium text-blue-600">
                                        {i?.userExtraDetail?.[0]?.compOffRemaining ?? "-"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
