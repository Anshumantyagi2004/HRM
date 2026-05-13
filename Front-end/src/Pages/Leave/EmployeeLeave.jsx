import React, { useEffect, useState } from 'react'
import Modal from "../../Components/Modal/Modal";
import { BaseUrl } from "../../BaseApi/Api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Edit, Eye } from 'lucide-react';

export default function EmployeeLeave(
    {
        user,
        rulesInfo,
        months,
        years,
        open,
        setOpen,
        fetchUserLeave,
        userLeave
    }) {
    const [text, setText] = useState("Balance");
    const [detailModal, setDetailModal] = useState(false);
    const [leaveDetailModal, setLeaveDetailModal] = useState();
    const [editModal, setEditModal] = useState(false);
    const [leaveEditModal, setLeaveEditModal] = useState();

    const handleLeaveDetail = (i) => {
        setDetailModal(true);
        setLeaveDetailModal(i)
    }

    const handleLeaveEdit = async () => {
        try {
            const res = await fetch(`${BaseUrl}editLeave/${leaveEditModal._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(leaveEditModal),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message);
                return;
            }

            toast.success("Leave updated successfully");
            setLeaveEditModal();
            setEditModal(false);
            fetchUserLeave()
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    const handleChangeEdit = (e) => {
        const { name, value } = e.target;
        setLeaveEditModal((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditLeave = (i) => {
        setEditModal(true);
        setLeaveEditModal(i)
    }

    useEffect(() => {
        fetchUserLeave()
    }, [])

    return (
        <div className="w-full px-3">
            <div className="bg-white shadow-md rounded-xl hover:shadow-lg transition p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Apply Leaves</h2>
                    <div className="">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md"
                            onClick={() => setOpen(true)}>
                            Apply For Leave
                        </button>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div className="flex gap-2 items-center">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md"
                            onClick={() => setText("Balance")}>
                            Balance
                        </button>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md"
                            onClick={() => setText("Logs")}>
                            Logs
                        </button>
                    </div>
                    <div className="">
                        {text == "Logs" &&
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

                            </div>}
                    </div>
                </div>

                {text == "Balance" &&
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 md:col-span-3">
                            {rulesInfo?.casualLeaveRemaining &&
                                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 border-l-4 border-green-500">
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
                                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 border-l-4 mt-4 border-red-500">
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
                                            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center shadow-sm">
                                                <h1 className="text-3xl font-bold text-red-700 leading-none">
                                                    {rulesInfo?.sickLeaveRemaining ?? 0}
                                                </h1>
                                                <p className="text-xs font-medium text-red-700 mt-1">
                                                    Leave Balance
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>}

                            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 border-l-4 mt-4 border-yellow-500">
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
                        </div>

                        <div className="col-span-12 md:col-span-9 overflow-x-auto">
                            <table className="w-full text-sm rounded-md">
                                <thead>
                                    <tr className="bg-indigo-600 text-white text-left">
                                        <th className="px-4 py-3">Details</th>
                                        {months.map((i, idx) => (
                                            <th className="px-4 py-3" key={idx}>{i?.name}</th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    <tr className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3">Applied Leaves</td>
                                        <td className="px-4 py-3">0</td>
                                        <td className="px-4 py-3">0</td>
                                        <td className="px-4 py-3">0</td>
                                        <td className="px-4 py-3">0</td>
                                        <td className="px-4 py-3">0</td>
                                        <td className="px-4 py-3">0</td>
                                        <td className="px-4 py-3">0</td>
                                        <td className="px-4 py-3">0</td>
                                        <td className="px-4 py-3">0</td>
                                        <td className="px-4 py-3">0</td>
                                        <td className="px-4 py-3">0</td>
                                        <td className="px-4 py-3">0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>}

                {text == "Logs" &&
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userLeave?.map((leave, idx) => {
                            const startDate = new Date(leave?.startDate);
                            const endDate = new Date(leave?.endDate);
                            const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                            return (<div key={idx} className={`bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 border-l-4
                                    ${leave.status === "Approved" ? "border-green-500" : leave.status === "Rejected" ? "border-red-500" : "border-yellow-500"}`}>
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {leave.leaveType}
                                    </h3>

                                    <span
                                        className={`px-3 py-1 text-xs rounded-full font-medium
                                         ${leave.status === "Approved"
                                                ? "bg-green-100 text-green-700"
                                                : leave.status === "Rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {leave.status}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>
                                        <span className="font-medium">Reason:</span>{" "}
                                        {leave?.reason}
                                    </p>
                                    <p>
                                        <span className="font-medium">From:</span>{" "}
                                        {startDate.toISOString().split("T")[0]}
                                    </p>
                                    <p>
                                        <span className="font-medium">To:</span>{" "}
                                        {endDate.toISOString().split("T")[0]}
                                    </p>
                                    <p>
                                        <span className="font-medium">Total Days:</span> {totalDays}
                                    </p>
                                </div>

                                {/* Footer */}
                                {leave.status === "Pending" ? (
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleEditLeave(leave)}
                                            className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                        >
                                            <Edit size={18} />
                                        </button>
                                    </div>
                                ) :
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleLeaveDetail(leave)}
                                            className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </div>}
                            </div>);
                        })}
                    </div>}

                <Modal open={editModal} onClose={() => setEditModal(false)}>
                    <Modal.Header title="Edit Your Leave" />
                    <Modal.Body>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Leave Type
                                </label>
                                <select value={leaveEditModal?.leaveType} onChange={handleChangeEdit} name="leaveType"
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="">Select</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Causal Leave">Causal Leave</option>
                                    <option value="Comp Off">Comp Off</option>
                                    <option value="Loss of Pay">Loss of Pay</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <input
                                    value={leaveEditModal?.startDate?.split("T")[0] || ""}
                                    onChange={handleChangeEdit}
                                    name="startDate"
                                    type="date"
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <input
                                    value={leaveEditModal?.endDate?.split("T")[0] || ""}
                                    onChange={handleChangeEdit}
                                    name="endDate"
                                    type="date"
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Reason for Leave
                                </label>
                                <textarea
                                    value={leaveEditModal?.reason}
                                    onChange={handleChangeEdit}
                                    name="reason"
                                    rows="3"
                                    placeholder="Enter reason..."
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none
                                    focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            onClick={() => setEditModal(false)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Close
                        </button>
                        <button onClick={handleLeaveEdit}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Edit
                        </button>
                    </Modal.Footer>
                </Modal>

                <Modal open={detailModal} onClose={() => setDetailModal(false)}>
                    <Modal.Header title="Leave Details" />
                    <Modal.Body>
                        {leaveDetailModal &&
                            <div className="space-y-3 text-sm text-gray-700">

                                <div className="grid grid-cols-2 gap-3">
                                    <p><span className="font-medium">Employee:</span> {leaveDetailModal?.user?.username}</p>
                                    <p><span className="font-medium">Role:</span> {leaveDetailModal?.user?.designation}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <p><span className="font-medium">Leave Type:</span> {leaveDetailModal?.leaveType}</p>
                                    <p>
                                        <span className="font-medium">Status:</span>{" "}
                                        <span className={`px-2 py-1 rounded text-xs font-semibold
                                            ${leaveDetailModal?.status === "Approved"
                                                ? "bg-green-100 text-green-700"
                                                : leaveDetailModal?.status === "Rejected"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {leaveDetailModal?.status}
                                        </span>
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <p>
                                        <span className="font-medium">Start Date:</span>{" "}
                                        {new Date(leaveDetailModal?.startDate)?.toISOString().split("T")[0]}
                                    </p>
                                    <p>
                                        <span className="font-medium">End Date:</span>{" "}
                                        {new Date(leaveDetailModal?.endDate)?.toISOString().split("T")[0]}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <p>
                                        <span className="font-medium">Applied On:</span>{" "}
                                        {new Date(leaveDetailModal?.appliedAt)?.toISOString().split("T")[0]}
                                    </p>

                                    <p>
                                        <span className="font-medium">Total Days:</span>{" "}
                                        {Math.ceil(
                                            (new Date(leaveDetailModal?.endDate) - new Date(leaveDetailModal?.startDate)) /
                                            (1000 * 60 * 60 * 24)
                                        ) + 1}
                                    </p>
                                </div>

                                <div>
                                    <p className="font-medium">Reason:</p>
                                    <p className="bg-gray-50 border rounded-lg p-3 mt-1 text-gray-600">
                                        {leaveDetailModal?.reason || "No reason provided"}
                                    </p>
                                </div>
                                {leaveDetailModal?.status != "Pending" &&
                                    <div className="grid grid-cols-2 gap-3">
                                        <p>
                                            <span className="font-medium">Actioned By:</span>{" "}
                                            {leaveDetailModal?.actionBy?.username}
                                        </p>

                                        <p>
                                            <span className="font-medium">Actioned Date:</span>{" "}
                                            {new Date(leaveDetailModal?.actionDate)?.toISOString().split("T")[0]}
                                        </p>
                                    </div>}

                            </div>}
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            onClick={() => setDetailModal(false)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Close
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}
