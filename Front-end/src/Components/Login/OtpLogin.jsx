import { useState } from "react";
import { BaseUrl } from "./../../BaseApi/Api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Redux/authSlice";
import CompLogo from "./../../Assets/logoo.webp";

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
        if (!formData.officialEmail) {
            return toast.error("Enter Email!");
        }

        try {
            setLoading(true);

            const res = await fetch(BaseUrl + "send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    officialEmail: formData.officialEmail
                })
            });

            const data = await res.json();

            if (!res.ok) {
                return toast.error(data.message || "OTP send failed");
            }

            toast.success("OTP sent successfully");
            setStep("otp");

        } catch (err) {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!formData.otp) {
            return toast.error("Enter OTP!");
        }

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
                toast.error(data.message || "OTP verification failed");
            }

        } catch (err) {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-10 relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-[-120px] left-[-120px] w-[280px] h-[280px] bg-[#f45a06]/20 rounded-full blur-3xl"></div>

            <div className="absolute bottom-[-120px] right-[-120px] w-[280px] h-[280px] bg-[#1e3a56]/40 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)]">

                {/* Top Section */}
                <div className="relative bg-gradient-to-br from-[#1e3a56] to-[#13293d] px-8 py-10 text-center">

                    <div className="absolute w-48 h-48 bg-[#f45a06]/20 blur-3xl rounded-full top-[-80px] right-[-80px]" />

                    <div className="relative z-10">

                        <div className="w-32 h-24 mx-auto mb-5 bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
                            <img
                                src={CompLogo}
                                alt="Company Logo"
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <h2 className="text-3xl font-bold text-white">
                            {step === "email"
                                ? "OTP Login"
                                : "Verify OTP"}
                        </h2>

                        <p className="text-gray-300 mt-3 text-sm">
                            {step === "email"
                                ? "Secure login using email verification"
                                : "Enter the OTP sent to your email"}
                        </p>

                    </div>
                </div>

                {/* Form Section */}
                <div className="p-8 bg-[#111827]/80">

                    {step === "email" && (
                        <>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Official Email
                                </label>

                                <input
                                    type="email"
                                    name="officialEmail"
                                    placeholder="Enter your official email"
                                    value={formData.officialEmail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#f45a06] transition"
                                />
                            </div>

                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full bg-[#f45a06] hover:bg-[#d94d05] text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-[#f45a06]/30 hover:scale-[1.01] disabled:opacity-60"
                            >
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>
                        </>
                    )}

                    {step === "otp" && (
                        <>
                            {/* Email Box */}
                            <div className="mb-6 p-4 rounded-2xl bg-[#1f2937] border border-gray-700">

                                <p className="text-gray-400 text-sm text-center">
                                    OTP sent to
                                </p>

                                <p className="text-[#f45a06] font-semibold text-center mt-1 break-all">
                                    {formData.officialEmail}
                                </p>
                            </div>

                            {/* OTP Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Enter OTP
                                </label>

                                <input
                                    type="text"
                                    name="otp"
                                    placeholder="••••••"
                                    value={formData.otp}
                                    onChange={handleChange}
                                    maxLength={6}
                                    className="w-full px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-700 text-white text-center tracking-[12px] text-2xl placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#f45a06] transition"
                                />
                            </div>

                            {/* Verify Button */}
                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading}
                                className="w-full bg-[#f45a06] hover:bg-[#d94d05] text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-[#f45a06]/30 hover:scale-[1.01] disabled:opacity-60"
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>

                            {/* Resend */}
                            <button
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="w-full mt-5 text-sm text-[#f45a06] hover:text-orange-400 transition"
                            >
                                Resend OTP
                            </button>
                        </>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-7">
                        <div className="flex-1 h-px bg-gray-700"></div>

                        <span className="text-sm text-gray-400">
                            OR
                        </span>

                        <div className="flex-1 h-px bg-gray-700"></div>
                    </div>

                    {/* Password Login */}
                    <Link
                        to={"/login"}
                        className="w-full flex justify-center border border-[#f45a06] text-[#f45a06] py-3 rounded-xl font-semibold hover:bg-[#f45a06]/10 transition"
                    >
                        Login with Password
                    </Link>

                </div>
            </div>
        </div>
    );
}

export default OtpLogin;