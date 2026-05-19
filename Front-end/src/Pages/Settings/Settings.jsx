import React, { useState } from "react";
import {
    LockKeyhole,
    ChevronRight,
    BellRing,
    UserCog,
    Eye,
    EyeOff
} from "lucide-react";
import Modal from '../../Components/Modal/Modal'
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { BaseUrl } from "../../BaseApi/Api";

export default function Settings() {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState(null);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdatePassword = async () => {
        try {
            setLoading(true);

            if (!passwordData.newPassword || !passwordData.confirmPassword) {
                toast.error("Please fill all fields");
                return;
            }

            const response = await fetch(`${BaseUrl}change-password`,
                {
                    method: "POST", headers: { "Content-Type": "application/json", },
                    body: JSON.stringify({
                        userId: user._id,
                        newPassword: passwordData.newPassword,
                        confirmPassword: passwordData.confirmPassword,
                    }),
                }
            );

            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message);
                return;
            }

            toast.success(data.message);
            setPasswordData({
                newPassword: "",
                confirmPassword: "",
            });
            setActiveTab(null);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-10">
            <div className="max-w-4xl mx-auto mb-5 text-center">
                <h1 className="text-4xl font-bold text-slate-800">
                    Settings
                </h1>

                <p className="text-slate-500 mt-2">
                    Manage your account settings and HRMS preferences.
                </p>
            </div>

            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-blue-100 overflow-hidden">
                <div className="p-3 md:p-8">
                    <div className="space-y-4">
                        <button onClick={() => setActiveTab("password")}
                            className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl md:p-5 p-3 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-4">

                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shadow-md">
                                    <LockKeyhole className="text-white" size={24} />
                                </div>

                                <div className="text-left">
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        Change Password
                                    </h3>

                                    <p className="text-slate-500 text-sm mt-1">
                                        Update your password securely.
                                    </p>
                                </div>
                            </div>

                            <ChevronRight
                                className="text-blue-500 group-hover:translate-x-1 transition-transform"
                                size={24}
                            />
                        </button>

                        <button onClick={() => setActiveTab("notifications")}
                            className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl md:p-5 p-3 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-4">

                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-sky-400 flex items-center justify-center shadow-md">
                                    <BellRing className="text-white" size={24} />
                                </div>

                                <div className="text-left">
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        Notification Preferences
                                    </h3>

                                    <p className="text-slate-500 text-sm mt-1">
                                        Manage email and HR alerts.
                                    </p>
                                </div>
                            </div>

                            <ChevronRight
                                className="text-blue-500 group-hover:translate-x-1 transition-transform"
                                size={24}
                            />
                        </button>

                        <button onClick={() => setActiveTab("profile")}
                            className="w-full flex items-center justify-between bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-2xl md:p-5 p-3 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-4">

                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-400 flex items-center justify-center shadow-md">
                                    <UserCog className="text-white" size={24} />
                                </div>

                                <div className="text-left">
                                    <h3 className="text-lg font-semibold text-slate-800">
                                        Employee Profile
                                    </h3>

                                    <p className="text-slate-500 text-sm mt-1">
                                        Update your employee information.
                                    </p>
                                </div>
                            </div>

                            <ChevronRight
                                className="text-blue-500 group-hover:translate-x-1 transition-transform"
                                size={24}
                            />
                        </button>
                    </div>
                </div>
            </div>

            <Modal open={activeTab == "password"} onClose={() => { setActiveTab(null); }}>
                <Modal.Header title="Change Password" />
                <Modal.Body>
                    <div className='space-y-4'>
                        <div className='flex flex-col'>
                            <label className='ml-1 font-semibold mb-1'>
                                New Password
                            </label>

                            <div className='relative'>
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className='input pr-12 w-full'
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition'
                                >
                                    {showNewPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <label className='ml-1 font-semibold mb-1'>
                                Confirm Password
                            </label>

                            <div className='relative'>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className='input pr-12 w-full'
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition'
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="flex justify-end w-full gap-2">
                        <button
                            onClick={() => { setActiveTab(null); }}
                            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                            Close
                        </button>
                        <button onClick={handleUpdatePassword} disabled={loading}
                            className="px-4 py-2 border rounded-lg bg-gray-700 hover:bg-gray-800 text-white">
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}