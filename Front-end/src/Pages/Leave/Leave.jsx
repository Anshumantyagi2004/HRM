import { Edit, Eye, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Modal from "../../Components/Modal/Modal";
import { BaseUrl } from "../../BaseApi/Api";
import toast from "react-hot-toast";

export default function Leave() {
    const [open, setOpen] = useState(false);
    const [detailModal, setDetailModal] = useState(false);
    const [leaveDetailModal, setLeaveDetailModal] = useState();
    const [editModal, setEditModal] = useState(false);
    const [leaveEditModal, setLeaveEditModal] = useState();
    const [leaveDetails, setLeaveDetails] = useState();
    const [allLeave, setAllLeave] = useState([]);
    const [userLeave, setUserLeave] = useState([]);
    const role = localStorage.getItem("userRole")
    const [formData, setFormData] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
        userId: localStorage.getItem("userId"),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeEdit = (e) => {
        const { name, value } = e.target;
        setLeaveEditModal((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        if (formData?.leaveType == "" || formData?.startDate == "" || formData?.endDate == "" || formData?.reason == "") return toast.error('Enter Leave form Properly!');
        try {
            const res = await fetch(`${BaseUrl}applyLeave`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.message);
            toast.success(data.message);
            setFormData()
            setOpen(false)
            fetchUserLeave()
        } catch (error) {
            toast.error(error)
        }
    };

    const fetchAllLeave = async () => {
        try {
            // const token = localStorage.getItem("token");
            const res = await fetch(BaseUrl + "allLeave", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setAllLeave(data);
            console.log(data);
        } catch (error) {
            console.error("Fetch leave error:", error);
            throw error;
        }
    };

    useEffect(() => {
        fetchAllLeave()
        fetchUserLeave()
    }, [])

    const fetchUserLeave = async () => {
        try {
            const userId = localStorage.getItem("userId");
            // const token = localStorage.getItem("token");

            const res = await fetch(`${BaseUrl}userLeave/${userId}`, {
                headers: {
                    // Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            if (res.ok) {
                setUserLeave(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleOpen = (i) => {
        setOpen(true);
        setLeaveDetails(i)
    }

    const handleLeaveDetail = (i) => {
        setDetailModal(true);
        setLeaveDetailModal(i)
    }

    const handleEditLeave = (i) => {
        setEditModal(true);
        setLeaveEditModal(i)
    }

    const handleLeaveAction = async (leaveId, status) => {
        try {
            const userId = localStorage.getItem("userId"); // or from Redux
            // const token = localStorage.getItem("token");

            await fetch(`${BaseUrl}leaveStatus/${leaveId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status,
                    actionBy: userId,
                    actionDate: new Date(),
                }),
            });

            toast.success(`Leave ${status}`);
            setOpen(false);
            fetchAllLeave()
        } catch (error) {
            toast.error("Something went wrong");
            console.error(error);
        }
    };

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

    return (<>{role == "Employee" ?
        <div className="w-full px-3">
            <div className="bg-white shadow-md rounded-xl hover:shadow-lg transition p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Apply Leaves</h2>
                    <div className="">
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-md"
                            onClick={() => setOpen(true)}>
                            Apply For Leave
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userLeave?.map((leave, idx) => {
                        const startDate = new Date(leave?.startDate);
                        const endDate = new Date(leave?.endDate);
                        const totalDays =
                            Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                        return (
                            <div key={idx}
                                className={`bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 border-l-4
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
                            </div>
                        );
                    })}
                </div>

                <Modal open={open} onClose={() => setOpen(false)}>
                    <Modal.Header title="Apply for Leave" />
                    <Modal.Body>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Leave Type
                                </label>
                                <select value={formData?.leaveType} onChange={handleChange} name="leaveType"
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="">Select</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Tarvel Leave">Tarvel Leave</option>
                                    <option value="Personal Leave">Personal Leave</option>
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <input
                                    value={formData?.startDate}
                                    onChange={handleChange}
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
                                    value={formData?.endDate}
                                    onChange={handleChange}
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
                                    value={formData?.reason}
                                    onChange={handleChange}
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
                            onClick={() => setOpen(false)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Close
                        </button>
                        <button onClick={handleSubmit}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            Apply
                        </button>
                    </Modal.Footer>
                </Modal>

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
                                    <option value="Tarvel Leave">Tarvel Leave</option>
                                    <option value="Personal Leave">Personal Leave</option>
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
                                {leaveDetails?.status != "Pending" &&
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
        :
        <div className="w-full px-3">
            <div className="bg-white shadow-md rounded-xl hover:shadow-lg transition p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">All Leaves</h2>
                    <div className="">
                        <div className="relative w-full sm:w-64">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg 
                                focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-indigo-600 text-white text-left">
                                <th className="px-4 py-3">Emp Name</th>
                                <th className="px-4 py-3">Designation</th>
                                <th className="px-4 py-3">Leave Type</th>
                                <th className="px-4 py-3">Reason</th>
                                <th className="px-4 py-3">Start Date</th>
                                <th className="px-4 py-3">End Date</th>
                                <th className="px-4 py-3">Days</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {allLeave?.map((emp, idx) => {
                                const start = new Date(emp?.startDate);
                                const end = new Date(emp?.endDate);
                                const totalDays = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
                                return (
                                    <tr key={idx} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{emp?.user?.username}</td>
                                        <td className="px-4 py-3">{emp?.user?.designation || "-"}</td>
                                        <td className="px-4 py-3">{emp?.leaveType}</td>
                                        <td className="px-4 py-3">{emp?.reason}</td>
                                        <td className="px-4 py-3">{emp?.startDate.toString()?.split("T")[0]}</td>
                                        <td className="px-4 py-3">{emp?.endDate.toString()?.split("T")[0]}</td>
                                        <td className="px-4 py-3">{totalDays}</td>
                                        <td className="px-4 py-3">{emp?.status}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => handleOpen(emp)}
                                                className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                <Modal open={open} onClose={() => setOpen(false)}>
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
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                Close
                            </button>

                            {leaveDetails?.status === "Pending" && (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleLeaveAction(leaveDetails._id, "Rejected")}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                    >
                                        Reject
                                    </button>

                                    <button
                                        onClick={() => handleLeaveAction(leaveDetails._id, "Approved")}
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
        </div>}
    </>);
}
