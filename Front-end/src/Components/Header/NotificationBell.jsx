import { Bell, CheckCheck, Circle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BaseUrl } from "../../BaseApi/Api";

export default function NotificationBell() {
    const [isNotificationOpen, setNotificationOpen] = useState(false);
    const bellRef = useRef(null);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

    const getNotifications = async () => {
        try {
            const res = await fetch(`${BaseUrl}notifications/unread-count`, {
                method: "GET",
                credentials: "include",
            });
            const data = await res.json();

            if (data.success) {
                setNotifications(data.unread);
            }
        } catch (error) {
            console.error("Notification fetch error:", error);
        }
    };

    useEffect(() => {
        getNotifications();
        const handleClickOutside = (e) => {
            if (bellRef.current && !bellRef.current.contains(e.target)) {
                setNotificationOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNotificationClick = (notification) => {
        setNotificationOpen(false);

        if (notification.link) {
            navigate(notification.link);
        }
    };

    const markAsRead = async (id) => {
        try {
            const res = await fetch(`${BaseUrl}notifications/read/${id}`, {
                method: "PATCH",
                credentials: "include"
            });
            const data = await res.json();

            if (data.success) {
                getNotifications()
            }

        } catch (error) {
            console.error("Mark as read error:", error);
        }
    };

    return (
        <div className="relative" ref={bellRef}>
            <button className="relative p-2 rounded-full hover:bg-gray-100 transition"
                onClick={() => setNotificationOpen(!isNotificationOpen)}>
                <Bell size={22} />

                {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </button>

            {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg border z-50">
                    <div className="p-3 border-b font-medium text-gray-700">
                        Notifications
                    </div>

                    {notifications?.length > 0 ? (
                        notifications?.slice(0, 3).map((n, idx) => (
                            <div key={idx} className="flex items-start gap-3 px-3 py-2 border-b cursor-pointer hover:bg-gray-50 bg-blue-50">
                                <Circle size={10} className="text-blue-500 mt-2 fill-blue-500" />
                                <div className="flex-1" onClick={() => handleNotificationClick(n)}>
                                    <p className="text-sm font-medium text-gray-800">
                                        {n?.title}
                                    </p>

                                    <p className="text-[11px] text-gray-500">
                                        {new Date(n?.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                <CheckCheck size={25}
                                    className="text-red-600 hover:text-green-500 hover:bg-green-100 cursor-pointer mt-[2px] bg-red-100 p-1 rounded-md"
                                    onClick={(e) => { markAsRead(n?._id); }}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="p-4 text-sm text-gray-500 text-center">
                            No notifications
                        </div>
                    )}
                    <Link
                        to={"/notification"}
                        onClick={() => setNotificationOpen(false)}
                        className="border-t p-2 text-sm text-blue-600 flex justify-center hover:underline"
                    >
                        View all notification
                    </Link>
                </div>
            )}
        </div>
    );
}