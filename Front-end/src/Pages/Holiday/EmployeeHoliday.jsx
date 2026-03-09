import { Eye, Search, } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { months, years } from '../../Data/data'
import AttendanceCalendar from '../../Components/Calendar/Calendar'
import { BaseUrl } from '../../BaseApi/Api'

export default function EmployeeHoliday(props) {
    const {
        user
    } = props
    const [text, setText] = useState("HolidayCalendar")
    const [holidays, setHolidays] = useState([])

    const getHolidays = async () => {
        try {
            const res = await fetch(`${BaseUrl}holidays`, {
                credentials: "include"
            })

            const data = await res.json()

            if (data.success) {
                setHolidays(data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getHolidays()
    }, [])

    return (<>
        <div className="w-full px-3">
            <div className="bg-white shadow-md rounded-xl hover:shadow-lg transition p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Holiday</h2>
                    <div className="">
                        <div className="relative w-full sm:w-64">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg 
                                focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div className="flex gap-2 items-center">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md"
                            onClick={() => setText("HolidayCalendar")}>
                            Holiday Calendar
                        </button>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md"
                            onClick={() => setText("HolidayList")}>
                            Holiday List
                        </button>
                    </div>
                    <div className="">
                        {text == "HolidayList" &&
                            <div className="flex gap-2 items-center">
                                <select className="input"
                                // value={year} onChange={(e) => setYear(Number(e.target.value))}
                                >
                                    {years.map((y, idx) => (
                                        <option key={idx} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                                <select className="input"
                                // value={year} onChange={(e) => setYear(Number(e.target.value))}
                                >
                                    {months.map((m, idx) => (
                                        <option key={idx} value={m}>
                                            {m?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>}
                    </div>
                </div>

                {text == "HolidayCalendar" &&
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-8">
                            <div className="bg-white shadow-md rounded-xl md:p-5 p-2 flex flex-col items-center text-center transition hover:shadow-lg">
                                <AttendanceCalendar holidays={holidays}  mode = {"holiday"}/>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-4">
                            <div className="bg-white shadow-md rounded-xl md:p-5 p-2 flex flex-col items-center text-center transition hover:shadow-lg">
                                <h2 className="mb-2 font-medium text-xl text-indigo-600">Details</h2>
                            </div>
                        </div>
                    </div>}

                {text == "HolidayList" &&
                    <div className="overflow-x-auto">
                        <table className="w-full text-base">
                            <thead>
                                <tr className="bg-indigo-600 text-white text-left">
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Day</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {holidays.length > 0 ? (
                                    holidays.map((holiday, idx) => (
                                        <tr key={idx} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-medium">{holiday.title}</td>
                                            <td className="p-3">
                                                {new Date(holiday.date).toLocaleDateString()}
                                            </td>
                                            <td className="p-3">
                                                {holiday.day}
                                            </td>
                                            <td className="p-3">
                                                {holiday.type}
                                            </td>
                                            <td className="p-3 flex gap-2">
                                                <button
                                                    // onClick={() => { setFormData(holiday); setIsEdit(true); setOpen(true) }}
                                                    className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                                      bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="p-4 text-center text-gray-900">
                                            No Holidays Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>}
            </div>
        </div>
    </>)
}
