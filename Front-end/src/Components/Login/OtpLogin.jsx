import { useState } from "react";
import { BaseUrl } from "./../../BaseApi/Api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Redux/authSlice";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {step === "email" ? "Login with OTP" : "Verify OTP"}
                </h2>

                {step === "email" && (
                    <>
                        <input
                            type="email"
                            name="officialEmail"
                            placeholder="Official Email"
                            value={formData.officialEmail}
                            onChange={handleChange}
                            className="w-full mb-4 p-2 border rounded"
                        />

                        <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </>
                )}

                {step === "otp" && (
                    <>
                        <p className="text-sm text-gray-600 mb-2 text-center">
                            OTP sent to: <b>{formData.officialEmail}</b>
                        </p>

                        <input
                            type="text"
                            name="otp"
                            placeholder="Enter OTP"
                            value={formData.otp}
                            onChange={handleChange}
                            className="w-full mb-4 p-2 border rounded text-center tracking-widest text-lg"
                        />

                        <button
                            onClick={handleVerifyOtp}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            {loading ? "Verifying..." : "Verify OTP"}
                        </button>

                        <button
                            onClick={handleSendOtp}
                            disabled={loading}
                            className="w-full text-sm text-indigo-600 hover:underline"
                        >
                            Resend OTP
                        </button>
                    </>
                )}

                <Link to={"/login"} className="mt-4 flex justify-center text-sm w-full font-semibold text-indigo-600 cursor-pointer">
                    Login with Password
                </Link>
            </div>
        </div>
    );
}

export default OtpLogin;