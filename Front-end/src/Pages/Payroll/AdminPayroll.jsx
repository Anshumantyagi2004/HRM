import { Download, Eye, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { BaseUrl } from "../../BaseApi/Api";
import Modal from '../../Components/Modal/Modal';
import { months, years } from '../../Data/data'
import { generatePayslip } from '../../Components/Payslip/GenratePayslip';

export default function AdminPayroll({ user }) {
    const [text, setText] = useState("Employee")
    const currentDate = new Date();
    const [year, setYear] = useState(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth());
    const [allUsers, setAllUsers] = useState([])
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);

    useEffect(() => {
        async function fetchMyProfile() {
            try {
                const res = await fetch(BaseUrl + "allUserPayroll", {
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
        fetchMyProfile()
        fetchMonthlyAttendance(year, month)
    }, [year, month])

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
                setAttendanceList(data.users);
            }

        } catch (error) {
            toast.error("Fetch Monthly Attendance Error:", error);
        }
    };

    const calculatePaidDays = (monthlyAttendance) => {
        let paidDays = 0;

        monthlyAttendance.forEach((record) => {
            const day = new Date(record.date).getDay(); // Sunday = 0
            // Sunday
            if (day === 0) {
                paidDays += 1;
                return;
            }

            // Holiday
            if (record.status === "HOLIDAY") {
                paidDays += 1;
                return;
            }

            // Attendance
            if (record.status === "PRESENT" || record.status === "ANOMALIES") {
                paidDays += 1;
            }

            if (record.status === "HALF_DAY") {
                paidDays += 0.5;
            }
        });
        return paidDays;
    };

    useEffect(() => {
        if (attendanceList.length && allUsers.length) {
            const updatedUsers = allUsers.map((user) => {
                const attendanceUser = attendanceList.find(
                    (a) => a.user._id === user._id
                );

                return {
                    ...user,
                    paidDays: attendanceUser
                        ? calculatePaidDays(attendanceUser.monthlyAttendance)
                        : 0
                };
            });
            setAllUsers(updatedUsers);
        }
    }, [attendanceList]);

    const [pdfUrl, setPdfUrl] = useState("");
    const previewPdf = async (i) => {
        const url = await generatePayslip(i, i?.paidDays, month, year);
        setPdfUrl(url);
        setOpen1(true);
    };

    return (<div className='w-full px-3'>
        <div className="bg-white shadow-md rounded-xl hover:shadow-lg transition p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Employees Payroll</h2>
                <div className="flex gap-2 flex-wrap">
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
                    </div>
                </div>
            </div>
            <div className='flex justify-between mb-4'>
                <div className='flex gap-2 items-center'>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-2 rounded-md"
                        onClick={() => setText("Employee")}>
                        Employee
                    </button>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-2 rounded-md"
                        onClick={() => setText("Overview")}>
                        Overview
                    </button>
                </div>
                {text == "Employee" &&
                    <div className="relative">
                        <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className="input"
                        />
                    </div>}
            </div>

            {text == "Employee" &&
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-indigo-600 text-white text-left">
                                <th className="px-4 py-3">Emp Name</th>
                                <th className="px-4 py-3">Location</th>
                                <th className="px-4 py-3">Designation</th>
                                <th className="px-4 py-3">Department</th>
                                <th className="px-4 py-3">Bank Name</th>
                                <th className="px-4 py-3">IFSC Code</th>
                                <th className="px-4 py-3">Account No.</th>
                                <th className="px-4 py-3">Total Working Day</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {allUsers.map((i, idx) => (
                                <tr key={idx} className="border-b hover:bg-gray-50 text-base">
                                    <td className="p-3 font-medium">
                                        <div className="flex items-center justify-start">
                                            {i?.profileImage ?
                                                <img src={i?.profileImage} alt={i?.username?.slice(0, 1)?.toUpperCase()} className="w-8 h-8 rounded-full mr-2" />
                                                : <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-2">
                                                    {i?.username?.slice(0, 1).toUpperCase()}
                                                </div>}
                                            {i?.username}
                                        </div>
                                    </td>
                                    <td className="p-3">{i?.userPayroll[0]?.city || "-"}</td>
                                    <td className="p-3">{i?.userWork[0]?.designation || "-"}</td>
                                    <td className="p-3">{i?.userWork[0]?.department || "-"}</td>
                                    <td className="p-3">{i?.userPayroll[0]?.bankName || "-"}</td>
                                    <td className="p-3">{i?.userPayroll[0]?.ifscCode || "-"}</td>
                                    <td className="p-3">{i?.userPayroll[0]?.accountNumber || "-"}</td>
                                    <td className="p-3">{i?.paidDays}</td>
                                    <td className="p-3">
                                        <button onClick={() => { setSelectedDetail(i); setOpen(true) }} className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                      bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition">
                                            <Eye size={18} />
                                        </button>
                                        <button onClick={() => { previewPdf(i); setOpen1(true) }} className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                      bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition ml-2">
                                            <Download size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}

            {text == "Overview" &&
                <div className="border border-indigo-200 bg-indigo-50 rounded-xl py-3 px-2 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 text-center">

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-sm text-indigo-500 font-medium">Total Employees</p>
                            <p className="text-2xl font-bold text-indigo-700">{allUsers?.length}</p>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-sm text-indigo-500 font-medium">Payroll Completed</p>
                            <p className="text-2xl font-bold text-indigo-700">0</p>
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
                </div>}

            <Modal open={open} onClose={() => setOpen(false)}>
                <Modal.Header title="Payroll Details" />
                <Modal.Body>
                    {selectedDetail && <>
                        <div className="flex justify-center mb-2">
                            {selectedDetail?.profileImage ?
                                <img src={selectedDetail?.profileImage} alt={"Image"} className="w-24 h-24 rounded-full" />
                                : <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-4xl">
                                    {selectedDetail?.username.slice(0, 1).toUpperCase()}
                                </div>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 text-sm">
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">Name</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.username || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">Bank Name</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.userPayroll[0]?.bankName || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">Account Number</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.userPayroll[0]?.accountNumber || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">Account Type</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.userPayroll[0]?.accountType || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">Branch Number</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.userPayroll[0]?.branchName || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">Pan Number</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.userPayroll[0]?.panNumber || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">IFSC Code</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.userPayroll[0]?.ifscCode || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">PF Number</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.userPayroll[0]?.pfNumber || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">CTC</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.userPayroll[0]?.ctc || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">Basic Pay</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.userPayroll[0]?.basicPay || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">Bonus</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.userPayroll[0]?.bonus || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">HRA</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.userPayroll[0]?.HRA || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">Medical Allowance</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.userPayroll[0]?.medicalAllowance || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">Special Allowance</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.userPayroll[0]?.specialAllowance || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">TA/DA</p>
                                    <p className="font-medium text-gray-800">
                                        {selectedDetail?.userPayroll[0]?.ta || "-"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div>
                                    <p className="text-gray-500">Net Gross</p>
                                    <p className="font-medium text-gray-800">
                                        {"-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>}
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex justify-end w-full gap-2">
                        <button
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                            Close
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>

            {open1 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div
                        className="absolute inset-0"
                        onClick={() => setOpen1(false)}
                    />

                    <div className="relative bg-white w-[80%] h-[90%] rounded-xl overflow-hidden">
                        <div className="flex justify-between p-3 border-b">
                            <h2 className="font-semibold">ID Card</h2>

                            <button onClick={() => setOpen1(false)}>✕</button>
                        </div>

                        <iframe
                            src={pdfUrl}
                            className="w-full h-full"
                            title="PDF Viewer"
                        />
                    </div>
                </div>
            )}
        </div>
    </div>)
}
