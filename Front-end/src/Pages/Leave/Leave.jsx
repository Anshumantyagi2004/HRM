import { Edit, Eye, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Modal from "../../Components/Modal/Modal";
import { BaseUrl } from "../../BaseApi/Api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSelector, } from "react-redux";

export default function Leave() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const role = user.role
    const years = [2022, 2023, 2024, 2025, 2026];
    const months = [
        { name: "Jan", id: 0 },
        { name: "Feb", id: 1 },
        { name: "March", id: 2 },
        { name: "April", id: 3 },
        { name: "May", id: 4 },
        { name: "June", id: 5 },
        { name: "July", id: 6 },
        { name: "August", id: 7 },
        { name: "Sept", id: 8 },
        { name: "Oct", id: 9 },
        { name: "Nov", id: 10 },
        { name: "Dec", id: 11 },
    ];
    const [open, setOpen] = useState(false);
    const [text, setText] = useState(role == "Employee" ? "Balance" : "Logs");
    const [detailModal, setDetailModal] = useState(false);
    const [leaveDetailModal, setLeaveDetailModal] = useState();
    const [editModal, setEditModal] = useState(false);
    const [leaveEditModal, setLeaveEditModal] = useState();
    const [leaveDetails, setLeaveDetails] = useState();
    const [allLeave, setAllLeave] = useState([]);
    const [userLeave, setUserLeave] = useState([]);
    const [allUsers, setAllUsers] = useState([])
    const [formData, setFormData] = useState({
        leaveType: "",
        startDate: "",
        endDate: "",
        reason: "",
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
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.message);
            toast.success(data.message);
            setFormData()
            setOpen(false)
            fetchUserLeave()
            fetchRules()
        } catch (error) {
            toast.error(error)
        }
    };

    const fetchAllLeave = async () => {
        try {
            const res = await fetch(BaseUrl + "allLeave", {
                method: "GET", headers: { "Content-Type": "application/json", },
            });
            const data = await res.json();
            setAllLeave(data);
        } catch (error) {
            console.error("Fetch leave error:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (role == "Admin") {
            fetchAllLeave()
            async function fetchMyProfile() {
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
            fetchMyProfile()
        }
        if (role == "Employee") {
            fetchRules()
            fetchUserLeave()
        }
    }, [])

    const fetchUserLeave = async () => {
        try {
            const res = await fetch(`${BaseUrl}userLeave`, {
                credentials: "include",
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
            await fetch(`${BaseUrl}leaveStatus/${leaveId}`, {
                method: "PATCH", headers: { "Content-Type": "application/json", },
                body: JSON.stringify({
                    status,
                    actionBy: user?._id,
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
                                        <th className="px-4 py-3">Deatils</th>
                                        {months.map((i, idx) => (
                                            <th className="px-4 py-3">{i?.name}</th>
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

                <Modal open={open} onClose={() => setOpen(false)}>
                    <Modal.Header title="Apply for Leave" />
                    <Modal.Body>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Leave Type
                                </label>
                                <select value={formData?.leaveType} onChange={handleChange} name="leaveType" className="input">
                                    <option value="">Select</option>
                                    {rulesInfo?.casualLeaveRemaining &&
                                        <option value="Causal Leave">Causal Leave</option>}
                                    {rulesInfo?.sickLeaveRemaining &&
                                        <option value="Sick Leave">Sick Leave</option>}
                                    {rulesInfo?.compOffRemaining &&
                                        <option value="Comp Off">Comp Off</option>}
                                    {rulesInfo?.lossOfPay &&
                                        <option value="Loss of Pay">Loss of Pay</option>}
                                </select>
                            </div>
                            <div className="flex gap-2 w-full">
                                <div className="flex flex-col w-full">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        value={formData?.startDate}
                                        onChange={handleChange}
                                        name="startDate"
                                        type="date"
                                        className="input py-[7px]"
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Select Half
                                    </label>
                                    <select name="" className="input">
                                        <option>Select</option>
                                        <option value="First Half">First Half</option>
                                        <option value="Second Half">Second Half</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full">
                                <div className="flex flex-col w-full">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        value={formData?.endDate}
                                        onChange={handleChange}
                                        name="endDate"
                                        type="date"
                                        className="input py-[7px]"
                                    />
                                </div>
                                <div className="flex flex-col w-full">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Select Half
                                    </label>
                                    <select name="" className="input">
                                        <option>Select</option>
                                        <option value="First Half">First Half</option>
                                        <option value="Second Half">Second Half</option>
                                    </select>
                                </div>
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
                                    className="input"
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <div className="flex gap-2 items-center">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md"
                            onClick={() => setText("Logs")}>
                            Logs
                        </button>
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md"
                            onClick={() => setText("Balance")}>
                            Balance
                        </button>
                    </div>
                    <div className="">
                        {text == "Balance" &&
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

                {text == "Logs" &&
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-indigo-600 text-white text-left">
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
                                                    : <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-2">
                                                        {emp?.user?.username.slice(0, 1).toUpperCase()}
                                                    </div>}
                                                {emp?.user?.username}
                                            </Link>
                                        </td>
                                        <td className="p-3">{emp?.user?.designation || "-"}</td>
                                        <td className="p-3">{emp?.user?.designation || "-"}</td>
                                        <td className="p-3">{emp?.leaveType}</td>
                                        <td className="p-3">{emp?.reason}</td>
                                        <td className="p-3">{emp?.startDate.toString()?.split("T")[0]}</td>
                                        <td className="p-3">{emp?.endDate.toString()?.split("T")[0]}</td>
                                        <td className="p-3">{totalDays}</td>
                                        <td className="p-3">{emp?.status}</td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => handleOpen(emp)}
                                                className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
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
                                <tr className="bg-indigo-600 text-white text-left">
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
                                                    : <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-2">
                                                        {emp?.username.slice(0, 1).toUpperCase()}
                                                    </div>}
                                                {emp?.username}
                                            </Link>
                                        </td>
                                        <td className="p-3">{emp?.userWork[0]?.designation || "-"}</td>
                                        <td className="p-3">{emp?.userWork[0]?.department || "-"}</td>
                                        <td className="p-3">{emp?.userExtraDetail[0]?.casualLeave || "-"}</td>
                                        <td className="p-3">{emp?.userExtraDetail[0]?.casualLeaveRemaining || "-"}</td>
                                        <td className="p-3">{emp?.userExtraDetail[0]?.compOffRemaining || "-"}</td>
                                        <td className="p-3">{emp?.userExtraDetail[0]?.sickLeave || "-"}</td>
                                        <td className="p-3">{emp?.userExtraDetail[0]?.sickLeaveRemaining || "-"}</td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                // onClick={() => handleOpen(emp)}
                                                className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>)
                                })}
                            </tbody>
                        </table>
                    </div>}

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
