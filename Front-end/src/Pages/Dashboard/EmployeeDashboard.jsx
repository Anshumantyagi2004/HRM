import React, { useEffect, useState } from 'react'
import Calendar from "../../Components/Calendar/Calendar";
import { BaseUrl } from '../../BaseApi/Api';
import { Download, Loader } from 'lucide-react';

export default function EmployeeDashboard(props) {
    const { user } = props

    const [attendance, setAttendance] = useState({})
    const [holidays, setHolidays] = useState([])
    const [loading, setLoading] = useState(true)
    const today = new Date()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    const getDashboardCalendar = async (month, year) => {
        try {
            const res = await fetch(`${BaseUrl}calendar?month=${month}&year=${year}`, {
                credentials: "include"
            })
            const data = await res.json()
            if (data.success) {
                const attendanceMap = {}
                const holidayList = []

                Object.entries(data.data).forEach(([date, value]) => {
                    if (value.type === "attendance") {
                        attendanceMap[date] = value.status
                    }
                    if (value.type === "holiday") {
                        holidayList.push({
                            title: value.name || value.title || value.holidayName || "Holiday",
                            date
                        })
                    }
                })
                setAttendance(attendanceMap)
                setHolidays(holidayList)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const [rulesInfo, setRulesInfo] = useState();
    const fetchRules = async () => {
        try {
            const response = await fetch(`${BaseUrl}userRules`, { credentials: "include", });
            if (!response.ok) {
                console.info("no data found");
            } else {
                const data = await response.json();
                setRulesInfo(data)
            }
        } catch (error) {
            toast.error("Add Error:", error.message);
            console.log(error);

        }
    };

    useEffect(() => {
        getDashboardCalendar(month, year)
        fetchRules()
    }, [])

    return (
        <div className="w-full px-3 mb-4">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-3">
                    <div className="md:p-5 p-2 flex flex-col items-center text-center">
                        <h2 className="mb-2 font-medium text-xl text-indigo-600">Leaves Summary</h2>
                        {rulesInfo?.casualLeaveRemaining &&
                            <div className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 border-l-4 border-green-500">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Casual Leaves
                                    </h3>
                                </div>

                                <div className="flex justify-between items-center gap-2">
                                    <div className="text-sm text-gray-800 space-y-2 w-[60%]">
                                        <p className="flex justify-between">
                                            <span className="font-medium">Total Leaves:</span>
                                            <span className="font-semibold">
                                                {rulesInfo?.casualLeave ?? 0}
                                            </span>
                                        </p>

                                        <p className="flex justify-between">
                                            <span className="font-medium">Remaining Leave:</span>
                                            <span className="text-green-600 font-bold">
                                                {rulesInfo?.casualLeaveRemaining ?? 0}
                                            </span>
                                        </p>

                                        <p className="flex justify-between">
                                            <span className="font-medium">Applied Leave:</span>
                                            <span className="text-red-600 font-semibold">
                                                {(rulesInfo?.casualLeave ?? 0) - (rulesInfo?.casualLeaveRemaining ?? 0)}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="w-[40%] flex justify-center">
                                        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-center shadow-sm">
                                            <h1 className="text-3xl font-bold text-green-700 leading-none">
                                                {rulesInfo?.casualLeaveRemaining ?? 0}
                                            </h1>
                                            <p className="text-xs font-medium text-green-700 mt-1">
                                                Leave Balance
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>}

                        {rulesInfo?.sickLeaveRemaining &&
                            <div className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 border-l-4 mt-4 border-blue-500">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Sick Leaves
                                    </h3>
                                </div>

                                <div className="flex justify-between items-center gap-2">
                                    <div className="text-sm text-gray-800 space-y-2 w-[60%]">
                                        <p className="flex justify-between">
                                            <span className="font-medium">Total Leaves:</span>
                                            <span className="font-semibold">
                                                {rulesInfo?.sickLeave ?? 0}
                                            </span>
                                        </p>

                                        <p className="flex justify-between">
                                            <span className="font-medium">Remaining Leave:</span>
                                            <span className="text-green-600 font-bold">
                                                {rulesInfo?.sickLeaveRemaining ?? 0}
                                            </span>
                                        </p>

                                        <p className="flex justify-between">
                                            <span className="font-medium">Applied Leave:</span>
                                            <span className="text-red-600 font-semibold">
                                                {(rulesInfo?.sickLeave ?? 0) - (rulesInfo?.sickLeaveRemaining ?? 0)}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="w-[40%] flex justify-center">
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-center shadow-sm">
                                            <h1 className="text-3xl font-bold text-blue-700 leading-none">
                                                {rulesInfo?.sickLeaveRemaining ?? 0}
                                            </h1>
                                            <p className="text-xs font-medium text-blue-700 mt-1">
                                                Leave Balance
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>}

                        <div className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 border-l-4 mt-4 border-yellow-500">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Comp Off
                                </h3>
                            </div>

                            <div className="flex justify-between items-center gap-2">
                                <div className="text-sm text-gray-800 space-y-2 w-[60%]">
                                    <p className="flex justify-between">
                                        <span className="font-medium">Credited Leaves:</span>
                                        <span className="font-semibold">
                                            {0}
                                        </span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="font-medium">Total Leaves:</span>
                                        <span className="font-semibold">
                                            {0}
                                        </span>
                                    </p>

                                    <p className="flex justify-between">
                                        <span className="font-medium">Remaining Leave:</span>
                                        <span className="text-yellow-600 font-bold">
                                            {0}
                                        </span>
                                    </p>

                                    <p className="flex justify-between">
                                        <span className="font-medium">Applied Leave:</span>
                                        <span className="text-red-600 font-semibold">
                                            {0}
                                        </span>
                                    </p>
                                </div>

                                <div className="w-[40%] flex justify-center">
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-center shadow-sm">
                                        <h1 className="text-3xl font-bold text-yellow-700 leading-none">
                                            {0}
                                        </h1>
                                        <p className="text-xs font-medium text-yellow-700 mt-1">
                                            Leave Balance
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 border-l-4 mt-4 border-red-500">
                            <div className="flex justify-between items-center mb-1">
                                <h3 className="text-lg font-semibold text-gray-800">
                                   Total Leaves
                                </h3>
                            </div>

                            <div className="flex justify-between items-center gap-2">
                                <div className="text-sm text-gray-800 space-y-2 w-[60%]">
                                    <p className="flex justify-between">
                                        <span className="font-medium">Casual Leaves:</span>
                                        <span className="font-semibold">
                                            {0}
                                        </span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="font-medium">Sick Leaves:</span>
                                        <span className="font-semibold">
                                            {0}
                                        </span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="font-medium">Loss of pay:</span>
                                        <span className="text-red-600 font-bold">
                                            {0}
                                        </span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span className="font-medium">Total Deduction:</span>
                                        <span className="text-red-600 font-semibold">
                                            {0}
                                        </span>
                                    </p>
                                </div>

                                <div className="w-[40%] flex justify-center">
                                    <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center shadow-sm">
                                        <h1 className="text-3xl font-bold text-red-700 leading-none">
                                            {0}
                                        </h1>
                                        <p className="text-xs font-medium text-red-700 mt-1">
                                            Total Leaves
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-6">
                    <div className="md:p-5 p-2 flex flex-col items-center text-center">
                        <h2 className="mb-2 font-medium text-xl text-indigo-600">Attendance Calendar</h2>
                        {loading ? (
                            <p className="text-gray-800 flex">Loading calendar <Loader /></p>
                        ) : (
                            <Calendar
                                attendance={attendance}
                                holidays={holidays}
                                getDashboardCalendar={getDashboardCalendar}
                                mode={"dashboard"}
                            />
                        )}
                    </div>
                </div>

                <div className="col-span-12 md:col-span-3">
                    <div className="md:pt-5 p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition">
                        <h2 className="font-medium text-xl text-indigo-600 text-center mb-3">
                            Monthly Attendance
                        </h2>

                        <div className="grid grid-cols-2 gap-3">
                            {(() => {
                                let present = 0
                                let absent = 0
                                let halfDay = 0
                                let late = 0
                                Object.values(attendance).forEach((status) => {
                                    if (status === "PRESENT") present++
                                    else if (status === "ABSENT") absent++
                                    else if (status === "HALF_DAY") halfDay++
                                    else if (status === "ANOMALIES") late++
                                })

                                return (
                                    <>
                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center shadow-sm">
                                            <p className="text-sm text-green-700 font-medium">Present</p>
                                            <h1 className="text-3xl font-bold text-green-700">{present}</h1>
                                        </div>

                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center shadow-sm">
                                            <p className="text-sm text-blue-700 font-medium">Anomaly</p>
                                            <h1 className="text-3xl font-bold text-blue-700">{late}</h1>
                                        </div>

                                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center shadow-sm">
                                            <p className="text-sm text-yellow-700 font-medium">Half Day</p>
                                            <h1 className="text-3xl font-bold text-yellow-700">{halfDay}</h1>
                                        </div>

                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center shadow-sm">
                                            <p className="text-sm text-red-700 font-medium">Absent</p>
                                            <h1 className="text-3xl font-bold text-red-700">{absent}</h1>
                                        </div>
                                    </>
                                )
                            })()}

                        </div>
                    </div>

                    <div className="md:pt-5 p-3 bg-white rounded-xl shadow-md hover:shadow-lg transition mt-4">
                        <h2 className="font-medium text-xl text-indigo-600 mb-3 flex justify-between">
                            Monthly Salary
                            <button className="p-2 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition">
                                <Download size={18} />
                            </button>
                        </h2>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center shadow-sm">
                                <p className="text-sm text-green-700 font-medium">Basic Pay</p>
                                <h1 className="text-3xl font-bold text-green-700">{20000}</h1>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center shadow-sm">
                                <p className="text-sm text-blue-700 font-medium">Bonus</p>
                                <h1 className="text-3xl font-bold text-blue-700">{2000}</h1>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center shadow-sm">
                                <p className="text-sm text-yellow-700 font-medium">Allowance</p>
                                <h1 className="text-3xl font-bold text-yellow-700">{5000}</h1>
                            </div>

                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center shadow-sm">
                                <p className="text-sm text-red-700 font-medium">Deduction</p>
                                <h1 className="text-3xl font-bold text-red-700">{-2000}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
