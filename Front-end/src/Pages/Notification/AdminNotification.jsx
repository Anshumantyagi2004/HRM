import React, { useEffect, useState } from "react";
import { BaseUrl } from "../../BaseApi/Api";
import { BellRing, CheckCheck, Circle, PlusCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../../Components/Modal/Modal";
import toast from "react-hot-toast";

export default function AdminNotification(props) {
    const { user } = props;
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addNotifications, setAddNotifications] = useState(false);
    const [allUsers, setAllUsers] = useState([])

    const getNotifications = async () => {
        try {
            const res = await fetch(`${BaseUrl}notifications`, {
                method: "GET",
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                setNotifications(data.data);
            }
        } catch (error) {
            console.error("Notification fetch error:", error);
        }
    };

    useEffect(() => {
        getNotifications();
        async function fetchMyUers() {
            try {
                const res = await fetch(BaseUrl + "users", {
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
        fetchMyUers()
    }, []);

    const markAsRead = async (id) => {
        try {
            const res = await fetch(`${BaseUrl}notifications/read/${id}`, {
                method: "PATCH",
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                setNotifications((prev) =>
                    prev.map((n) =>
                        n._id === id ? { ...n, isRead: true } : n
                    )
                );
            }
        } catch (error) {
            console.error("Mark read error:", error);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const res = await fetch(`${BaseUrl}notifications/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                setNotifications((prev) =>
                    prev.filter((n) => n._id !== id)
                );
            }
        } catch (error) {
            console.error("Delete notification error:", error);
        }
    };

    const handleNotificationClick = (n) => {
        if (n.link) {
            navigate(n.link);
        }
    };

    const [formData, setFormData] = useState({
        users: [],
        title: "",
        message: "",
        type: "announcement",
        sendToAll: false
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const sendNotification = async () => {
        setLoading(true);
        try {
            if (!formData.sendToAll && formData.users.length === 0) { return toast.error("Please select users"); }

            if (!formData.title || !formData.message) {
                return toast.error("All fields are required");
            }

            const res = await fetch(`${BaseUrl}notifications/admin-send`, {
                method: "POST", headers: { "Content-Type": "application/json" },
                credentials: "include", body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Notification sent successfully");
                setAddNotifications(false);
                getNotifications();
                setFormData({
                    users: [],
                    title: "",
                    message: "",
                    type: "announcement",
                    sendToAll: false
                });
            }
        } catch (error) {
            console.error("Send notification error", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Notifications
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Manage HRMS announcements and employee notifications.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">

                        <div className="bg-blue-100 text-gray-800 px-4 py-2 rounded-xl text-sm font-semibold">
                            {notifications.length} Notifications
                        </div>

                        <button
                            className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gray-700 text-white hover:bg-gray-800 transition shadow-sm"
                            onClick={() => setAddNotifications(true)}
                        >
                            <PlusCircle size={22} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div
                            key={n._id}
                            onClick={() => handleNotificationClick(n)}
                            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md
                        
                        ${!n.isRead
                                    ? "bg-gradient-to-r from-blue-50 to-sky-50 border-blue-200"
                                    : "bg-white border-gray-200 hover:border-blue-200"
                                }
                    `}
                        >

                            {!n.isRead && (
                                <div className="absolute left-0 top-0 h-full w-1 bg-blue-500"></div>
                            )}

                            <div className="p-5 flex items-start justify-between gap-4">
                                <div className="flex gap-4 flex-1">
                                    <div className="pt-2">
                                        {!n.isRead ? (
                                            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                                        ) : (
                                            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h2 className="text-lg font-semibold text-slate-800">
                                                {n.title}
                                            </h2>

                                            {!n.isRead && (
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                                    New
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-800 mt-1 leading-relaxed">
                                            {n.message}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            {new Date(n.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    {!n.isRead && (
                                        <button
                                            onClick={() => markAsRead(n._id)}
                                            className="w-10 h-10 rounded-xl bg-green-50 hover:bg-green-100 flex items-center justify-center transition group/button"
                                            title="Mark as read"
                                        >
                                            <CheckCheck
                                                size={20}
                                                className="text-green-600 group-hover/button:scale-110 transition"
                                            />
                                        </button>
                                    )}

                                    <button onClick={() => deleteNotification(n._id)}
                                        className="w-10 h-10 rounded-xl bg-red-50 hover:bg-red-100 flex items-center justify-center transition group/button"
                                        title="Delete"
                                    >
                                        <Trash2
                                            size={20}
                                            className="text-red-500 group-hover/button:scale-110 transition"
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-sm py-20 px-6 text-center">

                        <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-5">
                            <BellRing className="text-blue-600" size={36} />
                        </div>

                        <h2 className="text-2xl font-semibold text-slate-700">
                            No Notifications
                        </h2>

                        <p className="text-slate-500 mt-2">
                            You're all caught up. New notifications will appear here.
                        </p>
                    </div>
                )}
            </div>

            <Modal open={addNotifications} onClose={() => { setAddNotifications(false); }}>
                <Modal.Header title="Add Announcement Here" />
                <Modal.Body>
                    <div className="space-y-2">
                        <div className="flex flex-col mt-4">
                            <label className="block mb-2 font-medium text-sm">
                                Users
                            </label>

                            <div className="border rounded-lg max-h-52 overflow-y-auto p-2">
                                {allUsers?.map((u) => (
                                    <label key={u._id} className="flex items-center gap-2 py-1 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            disabled={formData.sendToAll}
                                            checked={formData.users?.includes(u._id)}
                                            className="w-5 h-5"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        users: [...prev.users, u._id]
                                                    }));

                                                } else {
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        users: prev.users.filter((id) => id !== u._id)
                                                    }));
                                                }
                                            }}
                                        />
                                        <span>
                                            {u?.username}
                                        </span>
                                    </label>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-gray-500">
                                    Leave empty to send notification to all users
                                </p>

                                <button type="button"
                                    onClick={() => setFormData((prev) => ({
                                        ...prev,
                                        sendToAll: !prev.sendToAll,
                                        users: []
                                    }))}
                                    className={`px-3 py-1 rounded-md text-sm text-white
                             ${formData.sendToAll ? "bg-green-600 hover:bg-green-700" : "bg-gray-700 hover:bg-gray-800"}`}>
                                    {formData.sendToAll ? "All Users" : "Select Users"}
                                </button>
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <label className='ml-1 font-semibold'>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData?.title}
                                onChange={handleChange}
                                className='input'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='ml-1 font-semibold'>Message</label>
                            <input
                                type="text"
                                name="message"
                                value={formData?.message}
                                onChange={handleChange}
                                className='input'
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='ml-1 font-semibold'>Type</label>
                            <select
                                name="type"
                                value={formData?.type}
                                onChange={handleChange}
                                className='input'
                            >
                                <option value="announcement">Announcement</option>
                                <option value="holiday">Holiday</option>
                                <option value="leave">Leave</option>
                                <option value="attendance">Attendance</option>
                                <option value="payroll">Payroll</option>
                                <option value="reminder">Reminder</option>
                            </select>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex justify-end w-full gap-2">
                        <button
                            onClick={() => { setAddNotifications(false); }}
                            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                            Close
                        </button>
                        <button onClick={sendNotification} disabled={loading}
                            className="px-4 py-2 border rounded-lg bg-gray-700 hover:bg-gray-800 text-white">
                            {loading ? "Sending..." : "Send"}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}