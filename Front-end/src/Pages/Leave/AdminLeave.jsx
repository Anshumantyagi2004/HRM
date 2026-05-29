import React, { useEffect, useState } from 'react'
import Modal from "../../Components/Modal/Modal";
import { BaseUrl } from "../../BaseApi/Api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Eye, Search } from 'lucide-react';

export default function AdminLeave(
    {
        user,
        rulesInfo,
        years,
        open,
        setOpen,
        fetchAllLeave,
        allLeave
    }) {
    const [text, setText] = useState("Logs");
    const [leaveDetails, setLeaveDetails] = useState();
    const [open1, setOpen1] = useState(false);
    const [allUsers, setAllUsers] = useState([])

    const handleLeaveAction = async (leaveId, status) => {
        if (user?.role === "Sub Admin" && Number(leaveDetails?.totalDays) > 2 && status === "Approved") {
            toast.error("You can approve leave requests for up to 2 days only.");
            return;
        }
        try {
            await fetch(`${BaseUrl}leaveStatus/${leaveId}`, {
                method: "PATCH", headers: { "Content-Type": "application/json", },
                body: JSON.stringify({
                    status,
                    actionBy: user?._id,
                    actionDate: new Date(),
                }),
            });

            toast.success(`Leave ${status}`);
            setOpen1(false);
            fetchAllLeave()
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };

    const handleOpen = (i, totalDays) => {
        setOpen1(true);
        setLeaveDetails({ ...i, totalDays });
    }

    const fetchMyProfile = async () => {
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

    useEffect(() => {
        fetchAllLeave()
    }, [])

    return (
        <div className="w-full px-3">
            <div className="bg-white shadow-md rounded-xl hover:shadow-lg transition p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">All Leaves</h2>
                    <div className="flex items-center gap-2">
                        <button className="btn-color px-3 py-2 rounded-md"
                            onClick={() => setOpen(true)}>
                            Apply For Leave
                        </button>
                        <div className="relative w-full sm:w-64">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600" />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg border-orange-300
              focus:outline-none focus:ring-1 focus:ring-orange-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div className="flex gap-2 items-center">
                        <button className="btn-color px-3 py-2 rounded-md"
                            onClick={() => setText("Logs")}>
                            Logs
                        </button>
                        <button className="btn-color px-3 py-2 rounded-md"
                            onClick={() => { setText("Balance"); fetchMyProfile(); }}>
                            Balance
                        </button>
                        <button className="btn-color px-3 py-2 rounded-md"
                            onClick={() => setText("Notice")}
                        >
                            Notices
                        </button>
                    </div>
                    <div className="">
                        <div className="flex gap-2">
                            <select
                                className="input"
                            // value={year}
                            // onChange={(e) => setYear(Number(e.target.value))}
                            >
                                {years.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>

                        </div>
                    </div>
                </div>

                {text == "Logs" &&
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-800 text-white text-left">
                                    <th className="p-3">Emp Name</th>
                                    <th className="p-3">Department</th>
                                    <th className="p-3">Designation</th>
                                    <th className="p-3">Leave Type</th>
                                    <th className="p-3">Reason</th>
                                    <th className="p-3">Start Date</th>
                                    <th className="p-3">End Date</th>
                                    <th className="p-3">Days</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allLeave?.map((emp, idx) => {
                                    const start = new Date(emp?.startDate);
                                    const end = new Date(emp?.endDate);
                                    const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
                                    return (<tr key={idx} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">
                                            <Link to={`/userProfile/${emp?.user?._id}`} className="flex items-center justify-start">
                                                {emp?.user?.profileImage ?
                                                    <img src={emp?.user?.profileImage} alt={emp?.user?.username.slice(0, 1).toUpperCase()} className="w-8 h-8 rounded-full mr-2" />
                                                    : <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center mr-2">
                                                        {emp?.user?.username.slice(0, 1).toUpperCase()}
                                                    </div>}
                                                {emp?.user?.username}
                                            </Link>
                                        </td>
                                        <td className="p-3">{emp?.userWork?.designation || "-"}</td>
                                        <td className="p-3">{emp?.userWork?.department || "-"}</td>
                                        <td className="p-3">{emp?.leaveType}</td>
                                        <td className="p-3">{emp?.reason}</td>
                                        <td className="p-3">{emp?.startDate.toString()?.split("T")[0]}</td>
                                        <td className="p-3">{emp?.endDate.toString()?.split("T")[0]}</td>
                                        <td className="p-3">{totalDays}</td>
                                        <td className="p-3">{emp?.status}</td>
                                        <td className="p-3 text-center">
                                            <button onClick={() => handleOpen(emp, totalDays)}
                                                className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                 bg-indigo-50 text-gray-800 hover:bg-indigo-100 transition"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>}

                {text == "Balance" &&
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-800 text-white text-left">
                                    <th className="p-3">Emp Name</th>
                                    <th className="p-3">Designation</th>
                                    <th className="p-3">Department</th>
                                    <th className="p-3">Casual Leave</th>
                                    <th className="p-3">Remain Casual Leave</th>
                                    <th className="p-3">Comp off</th>
                                    <th className="p-3">Sick Leave</th>
                                    <th className="p-3">Remain Sick Leave</th>
                                    <th className="p-3 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {allUsers?.map((emp, idx) => {
                                    return (<tr key={idx} className="border-b hover:bg-gray-50">
                                        <td className="p-3 font-medium">
                                            <Link to={`/userProfile/${emp?._id}`} className="flex items-center justify-start">
                                                {emp?.profileImage ?
                                                    <img src={emp?.profileImage} alt={emp?.username.slice(0, 1).toUpperCase()} className="w-8 h-8 rounded-full mr-2" />
                                                    : <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center mr-2">
                                                        {emp?.username.slice(0, 1).toUpperCase()}
                                                    </div>}
                                                {emp?.username}
                                            </Link>
                                        </td>
                                        <td className="p-3">{emp?.userWork[0]?.designation || "-"}</td>
                                        <td className="p-3">{emp?.userWork[0]?.department || "-"}</td>
                                        <td className="p-3">{emp?.userExtraDetail[0]?.casualLeave || "-"}</td>
                                        <td className="p-3">{emp?.userExtraDetail[0]?.casualLeaveRemaining || "-"}</td>
                                        <td className="p-3">{emp?.userExtraDetail[0]?.compOff || "-"}</td>
                                        <td className="p-3">{emp?.userExtraDetail[0]?.sickLeave || "-"}</td>
                                        <td className="p-3">{emp?.userExtraDetail[0]?.sickLeaveRemaining || "-"}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                // onClick={() => handleOpen(emp)}
                                                className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                 bg-indigo-50 text-gray-800 hover:bg-indigo-100 transition"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>}

                {text === "Notice" && (
                    <div className="space-y-4 max-w-4xl mx-auto px-4">
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 shadow-sm">
                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                                    📌
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-red-800">
                                        Sandwich Leave Policy
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-red-700">
                                        If an employee applies leave before and after a weekly off
                                        or holiday, then the holiday/weekend between those dates
                                        will also be counted as leave.
                                    </p>

                                    <div className="mt-4 rounded-lg border border-red-200 bg-white p-3 text-sm text-gray-700">
                                        <span className="font-semibold">
                                            Example:
                                        </span>

                                        <ul className="mt-2 list-disc pl-5 space-y-1">
                                            <li>
                                                Saturday = Leave
                                            </li>

                                            <li>
                                                Sunday = Weekly Off
                                            </li>

                                            <li>
                                                Monday = Leave
                                            </li>
                                        </ul>

                                        <p className="mt-3">
                                            In this case, Sunday will also be considered as leave.
                                            Total leave count = <span className="font-semibold">3 days</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 shadow-sm">
                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                                    🏥
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-purple-800">
                                        Sick Leave Monthly Policy
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-purple-700">
                                        Employees can apply for a maximum of
                                        <span className="font-semibold"> 2 sick leave days per month</span>.
                                        Additional sick leave requests may be rejected automatically
                                        according to company policy.
                                    </p>

                                    <div className="mt-4 rounded-lg border border-purple-200 bg-white p-3 text-sm text-gray-700">
                                        <span className="font-semibold">
                                            Example:
                                        </span>

                                        <ul className="mt-2 list-disc pl-5 space-y-1">
                                            <li>
                                                Employee already used 1 Sick Leave this month
                                            </li>

                                            <li>
                                                Applying for 2 more Sick Leaves
                                            </li>
                                        </ul>

                                        <p className="mt-3">
                                            Total becomes
                                            <span className="font-semibold"> 3 Sick Leaves</span>,
                                            so the leave request may not be allowed.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-green-200 bg-green-50 p-5 shadow-sm">
                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                                    🔄
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-green-800">
                                        Leave Carry Forward Policy
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-green-700">
                                        Unused leaves may be carried forward to the next year
                                        based on company policy and approval.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                    💰
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-blue-800">
                                        Leave Encashment Policy
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-blue-700">
                                        Remaining paid leaves may be converted into salary payout
                                        based on the employee’s basic pay and company policy.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                                    📅
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-yellow-800">
                                        Monthly Leave Credit
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-yellow-700">
                                        Casual leaves are credited monthly according to company
                                        rules instead of giving all yearly leaves at once.
                                    </p>

                                    <div className="mt-4 rounded-lg border border-yellow-200 bg-white p-3 text-sm text-gray-700">
                                        Example:
                                        <span className="font-semibold">
                                            {" "}18 yearly leaves = 1.5 leaves credited every month.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <Modal open={open1} onClose={() => { setOpen1(false); setLeaveDetails() }}>
                    <Modal.Header title="Employee Leave Details" />
                    <Modal.Body>
                        {leaveDetails &&
                            <div className="space-y-3 text-sm text-gray-700">

                                <div className="grid grid-cols-2 gap-3">
                                    <p><span className="font-medium">Employee:</span> {leaveDetails?.user?.username}</p>
                                    <p><span className="font-medium">Role:</span> {leaveDetails?.user?.designation}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <p><span className="font-medium">Leave Type:</span> {leaveDetails?.leaveType}</p>
                                    <p>
                                        <span className="font-medium">Status:</span>{" "}
                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                                            ${leaveDetails?.status === "Approved"
                                                ? "bg-green-100 text-green-700"
                                                : leaveDetails?.status === "Rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {leaveDetails?.status}
                                        </span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <p>
                                        <span className="font-medium">Start Date:</span>{" "}
                                        {new Date(leaveDetails?.startDate)?.toISOString().split("T")[0]}
                                    </p>
                                    <p>
                                        <span className="font-medium">End Date:</span>{" "}
                                        {new Date(leaveDetails?.endDate)?.toISOString().split("T")[0]}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <p>
                                        <span className="font-medium">Applied On:</span>{" "}
                                        {new Date(leaveDetails?.appliedAt)?.toISOString().split("T")[0]}
                                    </p>

                                    <p>
                                        <span className="font-medium">Total Days:</span>{" "}
                                        {Math.ceil(
                                            (new Date(leaveDetails?.endDate) - new Date(leaveDetails?.startDate)) /
                                            (1000 * 60 * 60 * 24)
                                        ) + 1}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">Reason:</p>
                                    <p className="bg-gray-50 border rounded-lg p-3 mt-1 text-gray-600">
                                        {leaveDetails?.reason || "No reason provided"}
                                    </p>
                                </div>
                                {leaveDetails?.status != "Pending" &&
                                    <div className="grid grid-cols-2 gap-3">
                                        <p>
                                            <span className="font-medium">Actioned By:</span>{" "}
                                            {leaveDetails?.actionBy?.username}
                                        </p>

                                        <p>
                                            <span className="font-medium">Actioned Date:</span>{" "}
                                            {new Date(leaveDetails?.actionDate)?.toISOString().split("T")[0]}
                                        </p>
                                    </div>}

                            </div>}
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex justify-between w-full">
                            <button
                                onClick={() => { setOpen1(false); setLeaveDetails() }}
                                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                Close
                            </button>
                            {leaveDetails?.status === "Pending" && (
                                <div className="flex gap-3">
                                    <button onClick={() => handleLeaveAction(leaveDetails._id, "Rejected")}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Reject
                                    </button>

                                    <button onClick={() => handleLeaveAction(leaveDetails._id, "Approved")}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Approve
                                    </button>
                                </div>
                            )}
                            {leaveDetails?.status === "Approved" && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleLeaveAction(leaveDetails._id, "Rejected")}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Reject
                                    </button>

                                    <button
                                        onClick={() => handleLeaveAction(leaveDetails._id, "Pending")}
                                        className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                            {leaveDetails?.status === "Rejected" && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleLeaveAction(leaveDetails._id, "Approved")}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                    >
                                        Approve
                                    </button>

                                    <button
                                        onClick={() => handleLeaveAction(leaveDetails._id, "Pending")}
                                        className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}
