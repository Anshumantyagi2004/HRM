import { Building2, Download, Eye, Search, User } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { BaseUrl } from "../../BaseApi/Api";
import Modal from '../../Components/Modal/Modal';
import { months, years } from '../../Data/data'
import { generatePayslip } from '../../Components/Payslip/GenratePayslip';

export default function EmployeePayroll({ user }) {
    const [text, setText] = useState("PaySlip")
    const currentDate = new Date();
    const [year, setYear] = useState(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth());
    const [userPayRoll, setUserPayRoll] = useState()

    useEffect(() => {
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
    }, [])
    const [open, setOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState("");
    const payrollMap = [
        { label: "CTC", key: "ctc" },
        { label: "Basic", key: "basicPay" },
        { label: "HRA", key: "HRA" },
        { label: "Bonus", key: "bonus" },
        { label: "Special Allowance", key: "specialAllowance" },
        { label: "Medical Allowance", key: "medicalAllowance" },
        { label: "TA/DA", key: "ta" },
    ];

    const [attendance, setAttendance] = useState({})
    const getDashboardCalendar = async (month, year) => {
        try {
            const res = await fetch(`${BaseUrl}calendar?month=${month + 1}&year=${year}`, {
                credentials: "include"
            })
            const data = await res.json()
            if (data.success) {
                setAttendance(data?.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const calculatePaidDays = (attendance) => {
        let paidDays = 0;

        Object.entries(attendance).forEach(([date, value]) => {
            const day = new Date(date).getDay(); // 0 = Sunday

            // Sunday
            if (day === 0) {
                paidDays += 1;
                return;
            }

            // Holiday
            if (value.type === "holiday") {
                paidDays += 1;
                return;
            }

            // Attendance
            if (value.type === "attendance") {
                if (value.status === "PRESENT" || value.status === "ANOMALIES") {
                    paidDays += 1;
                }

                if (value.status === "HALF_DAY") {
                    paidDays += 0.5;
                }
            }
        });

        return paidDays;
    };
    const totalPaidDays = calculatePaidDays(attendance);

    useEffect(() => {
        getDashboardCalendar(month, year)
    }, [month, year])

    const previewPdf = async () => {
        const url = await generatePayslip(userPayRoll, totalPaidDays, month, year);
        setPdfUrl(url);
        setOpen(true);
    };

    const downloadPayslip = async () => {
        const url = await generatePayslip(userPayRoll, totalPaidDays, month, year);
        const a = document.createElement("a");
        a.href = url;
        a.download = "mothly-payslip.pdf";
        a.click();
    };

    return (<div className='w-full px-3'>
        <div className="bg-white shadow-md rounded-xl hover:shadow-lg transition p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Payroll | {user?.username}</h2>
                <div className="flex gap-2 flex-wrap">
                    <div className="relative w-full sm:w-64">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg border-orange-300
                                 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                    </div>
                </div>
            </div>
            <div className='flex justify-between mb-4'>
                <div className='flex gap-2 items-center'>
                    <button className="btn-color py-2 px-2 rounded-md"
                        onClick={() => setText("PaySlip")}>
                        Pay Slip
                    </button>
                    <button className="btn-color py-2 px-2 rounded-md"
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
                    <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Payslip</h2>
                                <p className="text-lg text-gray-700">Salary Statement</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={downloadPayslip}
                                    className="p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-gray-800 transition"
                                >
                                    <Download size={20} />
                                </button>

                                <button
                                    onClick={previewPdf}
                                    className="p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-gray-800 transition"
                                >
                                    <Eye size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                            {/* Employee Details */}
                            <div className="bg-indigo-50/70 p-4 rounded-lg border border-indigo-100">
                                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                                    <User size={16} /> Employee Details
                                </h3>
                                <div className="grid grid-cols-2 gap-y-2 text-gray-800">
                                    <span className="font-medium text-gray-600">Name</span>
                                    <span>{userPayRoll?.username}</span>

                                    <span className="font-medium text-gray-600">Employee ID</span>
                                    <span>{userPayRoll?.userWork[0]?.empId}</span>

                                    <span className="font-medium text-gray-600">Email</span>
                                    <span className="truncate">{userPayRoll?.email}</span>

                                    <span className="font-medium text-gray-600">Contact</span>
                                    <span>{userPayRoll?.contact}</span>

                                    <span className="font-medium text-gray-600">Department</span>
                                    <span>{userPayRoll?.userWork[0]?.department}</span>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="bg-indigo-50/70 p-4 rounded-lg border border-indigo-100">
                                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                                    <Building2 size={16} /> Payment Details
                                </h3>
                                <div className="grid grid-cols-2 gap-y-2 text-gray-800">
                                    <span className="font-medium text-gray-600">Acc. Holder</span>
                                    <span>{userPayRoll?.userPayroll[0]?.accountHolderName}</span>

                                    <span className="font-medium text-gray-600">Bank</span>
                                    <span>{userPayRoll?.userPayroll[0]?.bankName}</span>

                                    <span className="font-medium text-gray-600">Branch</span>
                                    <span>{userPayRoll?.userPayroll[0]?.branchName}</span>

                                    <span className="font-medium text-gray-600">Account No</span>
                                    <span>{userPayRoll?.userPayroll[0]?.accountNumber}</span>

                                    <span className="font-medium text-gray-600">IFSC</span>
                                    <span>{userPayRoll?.userPayroll[0]?.ifscCode}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}

            {text == "SalaryStructure" &&
                <div className="">
                    <div className="bg-white rounded-xl shadow-sm border border-indigo-200 overflow-hidden">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-6 py-4 bg-indigo-50 border-b border-indigo-200">
                            <h2 className="text-lg font-semibold text-gray-800">Current Salary</h2>
                            <p className="text-sm text-gray-600">
                                Effective Date:&nbsp;
                                <span className="font-medium text-gray-800">
                                    {new Date(userPayRoll?.userWork[0]?.joiningDate).toLocaleDateString("en-IN")}
                                </span>
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-indigo-100">
                                    <tr>
                                        <th className="text-left px-6 py-3 font-semibold text-gray-700">Components</th>
                                        <th className="text-right px-6 py-3 font-semibold text-gray-700">Monthly</th>
                                        <th className="text-right px-6 py-3 font-semibold text-gray-700">Annual</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-indigo-100">
                                    {payrollMap.map((item, i) => (
                                        <tr
                                            key={i}
                                            className="hover:bg-indigo-50 transition-colors duration-150"
                                        >
                                            <td className="px-6 py-3 font-medium text-gray-800">
                                                {item.label}
                                            </td>

                                            {/* Monthly */}
                                            <td className="px-6 py-3 text-right text-gray-600 font-semibold">
                                                {userPayRoll?.userPayroll?.[0]?.[item.key] ?? "-"}
                                            </td>

                                            {/* Yearly or duplicate column (if needed same value) */}
                                            <td className="px-6 py-3 text-right text-gray-600 font-semibold">
                                                {userPayRoll?.userPayroll?.[0]?.[item.key] * 12 ?? "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>}

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div
                        className="absolute inset-0"
                        onClick={() => setOpen(false)}
                    />

                    <div className="relative bg-white w-[80%] h-[90%] rounded-xl overflow-hidden">
                        <div className="flex justify-between p-3 border-b">
                            <h2 className="font-semibold">ID Card</h2>

                            <button onClick={() => setOpen(false)}>✕</button>
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
