import { useState } from "react";
import { BaseUrl } from "./../../BaseApi/Api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Redux/authSlice";
import CompLogo from "./../../Assets/company_logo.png";

function OtpLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [step, setStep] = useState("email");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        officialEmail: "",
        otp: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSendOtp = async () => {
        if (!formData.officialEmail) return toast.error("Enter Email!");

        try {
            setLoading(true);
            const res = await fetch(BaseUrl + "send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ officialEmail: formData.officialEmail })
            });
            const data = await res.json();
            if (!res.ok) {
                return toast.error(data.message || "OTP send failed");
            }
            toast.success("OTP sent to email");
            setStep("otp");
        } catch (err) {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!formData.otp) return toast.error("Enter OTP!");
        try {
            setLoading(true);
            const res = await fetch(BaseUrl + "verify-otp", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    officialEmail: formData.officialEmail,
                    otp: formData.otp
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Login Successful!");
                dispatch(loginSuccess({ user: data.user }));
                navigate("/", { replace: true });
                window.location.href = "/";
            } else {
                return toast.error(data.message || "OTP verification failed");
            }
        } catch (err) {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative h-32 bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-800 flex items-center justify-center">
                    <div className="absolute w-40 h-40 bg-cyan-300/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 text-center">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                            <img
                                src={CompLogo}
                                alt="Company Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <h2 className="text-white text-2xl font-bold">
                            {step === "email" ? "Login with OTP" : "Verify OTP"}
                        </h2>
                    </div>
                </div>

                <div className="p-8">

                    {step === "email" && (
                        <>
                            <p className="text-blue-100 text-sm mb-6 text-center">
                                Enter your official email to receive a secure OTP
                            </p>

                            <div className="mb-5">
                                <label className="block text-sm font-medium text-blue-100 mb-2">
                                    Official Email
                                </label>

                                <input
                                    type="email"
                                    name="officialEmail"
                                    placeholder="Enter your official email"
                                    value={formData.officialEmail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white/10 border border-blue-400/20 rounded-xl text-white placeholder:text-blue-200/50 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
                                />
                            </div>

                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.01] hover:shadow-cyan-500/30 transition-all duration-300 disabled:opacity-60"
                            >
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>
                        </>
                    )}

                    {step === "otp" && (
                        <>
                            <div className="bg-blue-500/10 border border-blue-400/20 rounded-xl p-4 mb-6">
                                <p className="text-sm text-blue-100 text-center">
                                    OTP sent to
                                </p>

                                <p className="text-cyan-300 font-semibold text-center mt-1 break-all">
                                    {formData.officialEmail}
                                </p>
                            </div>

                            <div className="mb-5">
                                <label className="block text-sm font-medium text-blue-100 mb-2">
                                    Enter OTP
                                </label>

                                <input
                                    type="text"
                                    name="otp"
                                    placeholder="••••••"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    maxLength={6}
                                    className="w-full px-4 py-3 bg-white/10 border border-blue-400/20 rounded-xl text-white text-center tracking-[10px] text-2xl placeholder:text-blue-200/50 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
                                />
                            </div>

                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.01] hover:shadow-cyan-500/30 transition-all duration-300 disabled:opacity-60"
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>

                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full mt-4 text-sm text-cyan-300 hover:text-cyan-200 transition"
                            >
                                Resend OTP
                            </button>
                        </>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-blue-400/20"></div>
                        <span className="text-sm text-blue-200">OR</span>
                        <div className="flex-1 h-px bg-blue-400/20"></div>
                    </div>

                    {/* Login Link */}
                    <Link
                        to={"/login"}
                        className="w-full flex justify-center border border-cyan-400 text-cyan-300 py-3 rounded-xl font-semibold hover:bg-cyan-400/10 transition"
                    >
                        Login with Password
                    </Link>

                </div>
            </div>
        </div>
    );
}

export default OtpLogin;