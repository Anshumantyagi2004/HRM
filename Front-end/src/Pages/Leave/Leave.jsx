import { Edit, Eye, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import Modal from "../../Components/Modal/Modal";
import { BaseUrl } from "../../BaseApi/Api";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSelector, } from "react-redux";
import { months, years } from '../../Data/data'
import AdminLeave from "./AdminLeave";
import EmployeeLeave from "./EmployeeLeave";

export default function Leave() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const role = user.role
    const [open, setOpen] = useState(false);
    const [userLeave, setUserLeave] = useState([]);
    const [allLeave, setAllLeave] = useState([]);
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
            fetchAllLeave()
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
            // console.log(data.data);
            setAllLeave(data.data);
        } catch (error) {
            console.error("Fetch leave error:", error);
            throw error;
        }
    };

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

    useEffect(() => {
        fetchRules()
    }, [])

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

    return (<>
        {(role === "Admin" || role === "Sub Admin") &&
            <AdminLeave
                fetchAllLeave={fetchAllLeave}
                user={user}
                rulesInfo={rulesInfo}
                years={years}
                open={open}
                setOpen={setOpen}
                allLeave={allLeave}
            />}

        {role == "Employee" &&
            <EmployeeLeave
                userLeave={userLeave}
                fetchUserLeave={fetchUserLeave}
                user={user}
                rulesInfo={rulesInfo}
                months={months}
                years={years}
                open={open}
                setOpen={setOpen}
            />}

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
                <button onClick={() => setOpen(false)}
                    className="px-4 py-2 border bg-gray-100 text-black rounded-lg hover:bg-gray-200"
                >
                    Close
                </button>
                <button onClick={handleSubmit}
                    className="px-4 py-2 btn-color rounded-lg"
                >
                    Apply
                </button>
            </Modal.Footer>
        </Modal>
    </>);
}
