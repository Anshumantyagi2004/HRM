import React, { useEffect, useState } from "react";
import { BaseUrl } from "../../BaseApi/Api";
import { CheckCheck, Circle, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function EmployeeNotification(props) {
    const { user } = props;
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

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

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-6">
                Notifications
            </h1>

            <div className="space-y-3">
                {notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div key={n._id} onClick={() => handleNotificationClick(n)}
                            className={`flex items-start justify-between gap-4 p-4 rounded-lg border cursor-pointer transition hover:bg-gray-50 ${!n.isRead ? "bg-blue-50 border-blue-200" : "bg-white"}`}>
                            {!n.isRead && (<Circle size={10} className="text-blue-500 mt-2 fill-blue-500" />)}
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
        </div>
    )
}
