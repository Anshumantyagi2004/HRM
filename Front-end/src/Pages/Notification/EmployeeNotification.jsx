import React, { useEffect, useState } from "react";
import { BaseUrl } from "../../BaseApi/Api";
import { BellRing, CheckCheck, Circle, Trash2 } from "lucide-react";
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
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Notifications
                        </h1>

                        <p className="text-slate-500 mt-1">
                            Stay updated with your HRMS activities and alerts.
                        </p>
                    </div>

                    <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold">
                        {notifications.length} Notifications
                    </div>
                </div>
            </div>

            {/* Notification List */}
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

                            {/* Left Blue Line */}
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

                                        <p className="text-xs text-gray-800">
                                            {new Date(n.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    {!n.isRead && (
                                        <button onClick={() => markAsRead(n._id)}
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
        </div>
    )
}
