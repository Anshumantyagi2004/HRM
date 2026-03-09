import React, { useEffect, useState } from "react";
import { BaseUrl } from "../../BaseApi/Api";
import { CheckCheck, Circle, PlusCircle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Modal from "../../Components/Modal/Modal";
import toast from "react-hot-toast";

export default function AdminNotification(props) {
    const { user } = props;
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
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
        user: "",
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
        try {
            const res = await fetch(`${BaseUrl}notifications/admin-send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Notification sent successfully");
                setAddNotifications(false);
                getNotifications()
                setFormData({
                    user: "",
                    title: "",
                    message: "",
                    type: "announcement",
                    sendToAll: false
                });
            }
        } catch (error) {
            console.error("Send notification error", error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4 w-full flex justify-between ">
                Notifications
                <button className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                    onClick={() => setAddNotifications(true)}>
                    <PlusCircle size={20} />
                </button>
            </h1>

            <div className="space-y-3">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div key={n._id} onClick={() => handleNotificationClick(n)}
                            className={`flex items-start justify-between gap-4 p-4 rounded-lg border cursor-pointer transition hover:bg-gray-50 ${!n.isRead ? "bg-blue-50 border-blue-200" : "bg-white"}`}>
                           {!n.isRead && ( <Circle size={10} className="text-blue-500 mt-2 fill-blue-500" />)}
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">
                                    {n.title}
                                </p>

                                <p className="text-sm text-gray-900 mt-1">
                                    {n.message}
                                </p>

                                <p className="text-xs text-gray-600 mt-1">
                                    {new Date(n.createdAt).toLocaleString()}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                {!n.isRead && (
                                    <CheckCheck
                                        size={25}
                                        title="Mark as read"
                                        className="text-gray-600 hover:text-green-500 hover:bg-green-100 cursor-pointer bg-gray-100 p-1 rounded-md"
                                        onClick={() => markAsRead(n._id)}
                                    />
                                )}

                                <Trash2
                                    size={25}
                                    title="Delete"
                                    className="text-gray-600 hover:text-red-600 hover:bg-red-100 p-1 rounded-md cursor-pointer bg-gray-100"
                                    onClick={() => deleteNotification(n._id)}
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 py-10">
                        No notifications yet
                    </div>
                )}
            </div>

            <Modal open={addNotifications} onClose={() => { setAddNotifications(false); }}>
                <Modal.Header title="Add Announcement Here" />
                <Modal.Body>
                    <div className="space-y-2">
                        <div className='flex flex-col'>
                            <label className='ml-1 font-semibold'>User</label>
                            <div className="flex items-center gap-2 w-full">
                                <select
                                    disabled={formData?.sendToAll}
                                    name="user"
                                    value={formData?.user}
                                    onChange={handleChange}
                                    className={`input w-full ${formData?.sendToAll && "cursor-not-allowed"}`}
                                >
                                    <option>Select</option>
                                    {allUsers.map((i, idx) => (
                                        <option key={idx} value={i?._id}>{i?.username}</option>
                                    ))}
                                </select>
                                <button onClick={() => setFormData((prev) => ({ ...prev, sendToAll: !prev.sendToAll, user: "" }))}
                                    className={`bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md`}>
                                    All
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
                        <button onClick={sendNotification}
                            className="px-4 py-2 border rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white">
                            Add
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}