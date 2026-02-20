import { Eye, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { BaseUrl } from "../../BaseApi/Api";
import Modal from '../../Components/Modal/Modal';

export default function Payroll() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [text, setText] = useState(user.role != "Employee" ? "Employee" : "PaySlip")
    const [allUsers, setAllUsers] = useState([])
    const [userPayRoll, setUserPayRoll] = useState()

    useEffect(() => {
        if (user.role != "Employee") {
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
        }

        if (user.role == "Employee") {
            async function fetchMyProfile() {
                try {
                    const res = await fetch(BaseUrl + "UserPayDetail", {
                        credentials: "include",
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    const data = await res.json();
                    setUserPayRoll(data.data);
                } catch (error) {
                    console.error("Fetch profile error:", error);
                    throw error;
                }
            };
            fetchMyProfile()
        }
    }, [])

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
    const [open, setOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    console.log(userPayRoll);
    const payrollMap = [
        { label: "CTC", key: "ctc" },
        { label: "Basic", key: "basicPay" },
        { label: "HRA", key: "HRA" },
        { label: "Bonus", key: "bonus" },
        { label: "Special Allowance", key: "specialAllowance" },
        { label: "Medical Allowance", key: "medicalAllowance" },
        { label: "TA/DA", key: "ta" },
        { label: "Overtime", key: "overtime" }, // if not present → fallback
    ];

    return (<>{user.role == "Employee" ?
        <div className='w-full px-3'>
            <div className="bg-white shadow-md rounded-xl hover:shadow-lg transition p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Payroll | {user?.username}</h2>
                    <div className="flex gap-2 flex-wrap">
                        <div className="relative">
                            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="input"
                            />
                        </div>
                    </div>
                </div>
                <div className='flex justify-between mb-4'>
                    <div className='flex gap-2 items-center'>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-2 rounded-md"
                            onClick={() => setText("PaySlip")}>
                            Pay Slip
                        </button>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-2 rounded-md"
                            onClick={() => setText("SalaryStructure")}>
                            Salary Structure
                        </button>
                    </div>
                    {text == "PaySlip" &&
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

                {text == "PaySlip" &&
                    <div className="">
                        <div className="bg-white rounded-xl shadow-sm border border-indigo-200 px-6 py-4">
                            <div className="text-center mb-5">
                                <h2 className="text-xl font-bold text-indigo-800">Payslip</h2>
                                <p className="text-sm text-indigo-600">Salary Statement</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 text-sm">
                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 grid grid-cols-1 md:grid-cols-2">
                                    <p><span className="font-medium text-indigo-700">Employee Name:</span> {userPayRoll?.username}</p>
                                    <p><span className="font-medium text-indigo-700">Employee ID:</span> {userPayRoll?.userWork[0]?.empId}</p>
                                    <p><span className="font-medium text-indigo-700">Email Id:</span> {userPayRoll?.email}</p>
                                    <p><span className="font-medium text-indigo-700">Contact:</span> {userPayRoll?.contact}</p>
                                    <p><span className="font-medium text-indigo-700">Department:</span> {userPayRoll?.userWork[0]?.department}</p>
                                    <p><span className="font-medium text-indigo-700">Designation:</span> {userPayRoll?.userWork[0]?.designation}</p>
                                </div>

                                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 grid grid-cols-1 md:grid-cols-2">
                                    <p><span className="font-medium text-indigo-700">Pay Month:</span> Jan 2026</p>
                                    <p><span className="font-medium text-indigo-700">Bank Name:</span> {userPayRoll?.userPayroll[0]?.bankName}</p>
                                    <p><span className="font-medium text-indigo-700">Branch Name:</span> {userPayRoll?.userPayroll[0]?.branchName}</p>
                                    <p><span className="font-medium text-indigo-700">Account No.:</span> {userPayRoll?.userPayroll[0]?.accountNumber}</p>
                                    <p><span className="font-medium text-indigo-700">Bank Name:</span> {userPayRoll?.userPayroll[0]?.ifscCode}</p>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm border border-indigo-200 rounded-lg overflow-hidden">
                                    <thead className="bg-indigo-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-semibold text-indigo-700">Earnings</th>
                                            <th className="px-4 py-2 text-right font-semibold text-indigo-700">Amount</th>
                                            <th className="px-4 py-2 text-left font-semibold text-indigo-700">Deductions</th>
                                            <th className="px-4 py-2 text-right font-semibold text-indigo-700">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-indigo-100 border-b border-indigo-100">
                                        <tr>
                                            <td className="px-4 py-2">Basic</td>
                                            <td className="px-4 py-2 text-right">{userPayRoll?.userPayroll[0]?.basicPay}</td>
                                            <td className="px-4 py-2">LOP</td>
                                            <td className="px-4 py-2 text-right">{"-"}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2">HRA</td>
                                            <td className="px-4 py-2 text-right">{userPayRoll?.userPayroll[0]?.HRA || "-"}</td>
                                            <td className="px-4 py-2">Sick Leave</td>
                                            <td className="px-4 py-2 text-right">{"-"}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2">Bonus</td>
                                            <td className="px-4 py-2 text-right">{userPayRoll?.userPayroll[0]?.bonus || "-"}</td>
                                            <td className="px-4 py-2">Casual Leave</td>
                                            <td className="px-4 py-2 text-right">{"-"}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2">Special Allowance</td>
                                            <td className="px-4 py-2 text-right">{userPayRoll?.userPayroll[0]?.specialAllowance || "-"}</td>
                                            <td className="px-4 py-2">Half Day</td>
                                            <td className="px-4 py-2 text-right">{"-"}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2">Medical Allowance</td>
                                            <td className="px-4 py-2 text-right">{userPayRoll?.userPayroll[0]?.medicalAllowance || "-"}</td>
                                            <td className="px-4 py-2">Late Arrive</td>
                                            <td className="px-4 py-2 text-right">{"-"}</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2">TA/DA</td>
                                            <td className="px-4 py-2 text-right">{userPayRoll?.userPayroll[0]?.ta || "-"}</td>
                                            <td className="px-4 py-2">Total Deductions</td>
                                            <td className="px-4 py-2 text-right">{"-"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-5 bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                                <p className="text-sm text-indigo-700">Net Pay</p>
                                <p className="text-2xl font-bold text-indigo-800">
                                    {(userPayRoll?.userPayroll[0]?.basicPay) + (userPayRoll?.userPayroll[0]?.HRA) + (userPayRoll?.userPayroll[0]?.bonus) + (userPayRoll?.userPayroll[0]?.specialAllowance) +
                                        (userPayRoll?.userPayroll[0]?.medicalAllowance) + (userPayRoll?.userPayroll[0]?.ta)}
                                </p>
                            </div>
                            <div className="mt-5 flex justify-center">
                                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-lg shadow-md transition-all duration-200 flex items-center gap-2">
                                    Download
                                </button>
                            </div>
                        </div>
                    </div>}

                {text == "SalaryStructure" &&
                    <div className="">
                        <div className="bg-white rounded-xl shadow-sm border border-indigo-200 overflow-hidden">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-6 py-4 bg-indigo-50 border-b border-indigo-200">
                                <h2 className="text-lg font-semibold text-indigo-800">Current Salary</h2>
                                <p className="text-sm text-indigo-600">
                                    Effective Date:&nbsp;
                                    <span className="font-medium text-indigo-800">
                                        {new Date(userPayRoll?.userWork[0]?.joiningDate).toLocaleDateString("en-IN")}
                                    </span>
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-indigo-100">
                                        <tr>
                                            <th className="text-left px-6 py-3 font-semibold text-indigo-700">Components</th>
                                            <th className="text-right px-6 py-3 font-semibold text-indigo-700">Monthly</th>
                                            <th className="text-right px-6 py-3 font-semibold text-indigo-700">Annual</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-indigo-100">
                                        {payrollMap.map((item, i) => (
                                            <tr
                                                key={i}
                                                className="hover:bg-indigo-50 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-3 font-medium text-gray-700">
                                                    {item.label}
                                                </td>

                                                {/* Monthly */}
                                                <td className="px-6 py-3 text-right text-indigo-700 font-semibold">
                                                    {userPayRoll?.userPayroll?.[0]?.[item.key] ?? "-"}
                                                </td>

                                                {/* Yearly or duplicate column (if needed same value) */}
                                                <td className="px-6 py-3 text-right text-indigo-700 font-semibold">
                                                    {userPayRoll?.userPayroll?.[0]?.[item.key] ?? "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>}
            </div>
        </div>
        : <div className='w-full px-3'>
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
                                    <th className="px-4 py-3">CTC</th>
                                    <th className="px-4 py-3">Basic Pay</th>
                                    <th className="px-4 py-3">HRA</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allUsers.map((i, idx) => (
                                    <tr key={idx} className="border-b hover:bg-gray-50 text-base">
                                        <td className="p-3 font-medium">
                                            <div className="flex items-center justify-start">
                                                {i?.profileImage ?
                                                    <img src={i?.profileImage} alt={i?.username.slice(0, 1).toUpperCase()} className="w-8 h-8 rounded-full mr-2" />
                                                    : <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-2">
                                                        {i?.username.slice(0, 1).toUpperCase()}
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
                                        <td className="p-3">{"-"}</td>
                                        <td className="p-3">{i?.userPayroll[0]?.ctc || "-"}</td>
                                        <td className="p-3">{i?.userPayroll[0]?.basicPay || "-"}</td>
                                        <td className="p-3">{i?.userPayroll[0]?.HRA || "-"}</td>
                                        <td className="p-3">
                                            <button onClick={() => { setSelectedDetail(i); setOpen(true) }} className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                    bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition">
                                                <Eye size={18} />
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
            </div>
        </div>
    }</>)
}
