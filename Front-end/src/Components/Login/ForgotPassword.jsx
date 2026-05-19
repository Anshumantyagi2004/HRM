import { useState } from "react";
import { BaseUrl } from "./../../BaseApi/Api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import CompLogo from "./../../Assets/logoo.webp";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    officialEmail: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // SEND OTP
  const handleSendOtp = async () => {
    if (!formData.officialEmail) {
      return toast.error("Enter Email!");
    }

    try {
      setLoading(true);
      const res = await fetch(BaseUrl + "send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          officialEmail: formData.officialEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return toast.error(
          data.message || "OTP send failed"
        );
      }

      toast.success("OTP sent successfully");
      setStep("otp");
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      return toast.error("Enter OTP!");
    }

    try {
      setLoading(true);
      const res = await fetch(BaseUrl + "forgot-password-verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          officialEmail: formData.officialEmail,
          otp: formData.otp,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return toast.error(
          data.message ||
          "OTP verification failed"
        );
      }
      toast.success("OTP verified successfully");
      setStep("reset");
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // RESET PASSWORD
  const handleResetPassword = async () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      return toast.error("Fill all fields!");
    }

    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error(
        "Passwords do not match!"
      );
    }

    try {
      setLoading(true);
      const res = await fetch(BaseUrl + "forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", },
        body: JSON.stringify({
          officialEmail: formData.officialEmail,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      }
      );

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
        return;
      }
      toast.success(data.message);
      navigate("/login");
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute top-[-120px] left-[-120px] w-[280px] h-[280px] bg-[#f45a06]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[280px] h-[280px] bg-[#1e3a56]/40 rounded-full blur-3xl"></div>

      {/* CARD */}
      <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
        <div className="relative bg-gradient-to-br from-[#1e3a56] to-[#13293d] px-8 py-4 text-center">
          <div className="absolute w-48 h-48 bg-[#f45a06]/20 blur-3xl rounded-full top-[-80px] right-[-80px]" />
          <div className="relative z-10">
            <div className="w-32 h-24 mx-auto bg-white/10 border border-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg">
              <img
                src={CompLogo}
                alt="Company Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h2 className="text-3xl font-bold text-white">
              {step === "email" &&
                "Forgot Password"}
              {step === "otp" &&
                "Verify OTP"}
              {step === "reset" &&
                "Reset Password"}
            </h2>

            <p className="text-gray-300 mt-2 text-sm">
              {step === "email" &&
                "Receive OTP on your email"}
              {step === "otp" &&
                "Enter the OTP sent to your email"}
              {step === "reset" &&
                "Create your new password"}
            </p>

            {/* STEP INDICATOR */}
            <div className="flex items-center justify-between mt-5">

              {/* STEP 1 */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step === "email" ||
                    step === "otp" ||
                    step === "reset"
                    ? "bg-[#f45a06] text-white shadow-lg shadow-[#f45a06]/40"
                    : "bg-gray-700 text-gray-300"
                    }`}
                >
                  1
                </div>

                <span className="text-xs text-gray-300 mt-2">
                  Email
                </span>
              </div>

              {/* LINE */}
              <div
                className={`flex-1 h-[2px] mx-2 transition-all duration-300 ${step === "otp" ||
                  step === "reset"
                  ? "bg-[#f45a06]"
                  : "bg-gray-700"
                  }`}
              ></div>

              {/* STEP 2 */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step === "otp" ||
                    step === "reset"
                    ? "bg-[#f45a06] text-white shadow-lg shadow-[#f45a06]/40"
                    : "bg-gray-700 text-gray-300"
                    }`}
                >
                  2
                </div>

                <span className="text-xs text-gray-300 mt-2">
                  OTP
                </span>
              </div>

              {/* LINE */}
              <div
                className={`flex-1 h-[2px] mx-2 transition-all duration-300 ${step === "reset"
                  ? "bg-[#f45a06]"
                  : "bg-gray-700"
                  }`}
              ></div>

              {/* STEP 3 */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step === "reset"
                    ? "bg-[#f45a06] text-white shadow-lg shadow-[#f45a06]/40"
                    : "bg-gray-700 text-gray-300"
                    }`}
                >
                  3
                </div>

                <span className="text-xs text-gray-300 mt-2">
                  Reset
                </span>
              </div>

            </div>
          </div>
        </div>

        <div className="px-8 py-6 bg-[#111827]/80">
          {step === "email" && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Official Email
                </label>

                <div className="relative">
                  <input
                    type="email"
                    name="officialEmail"
                    placeholder="Enter your official email"
                    value={formData.officialEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-[#1f2937] border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#f45a06]"
                  />

                  <Mail
                    size={20}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              <button onClick={handleSendOtp} disabled={loading}
                className="w-full bg-[#f45a06] hover:bg-[#d94d05] text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-[#f45a06]/30 hover:scale-[1.01] disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              {/* EMAIL BOX */}
              <div className="mb-6 p-4 rounded-2xl bg-[#1f2937] border border-gray-700">

                <p className="text-gray-400 text-sm text-center">
                  OTP sent to
                </p>

                <p className="text-[#f45a06] font-semibold text-center mt-1 break-all">
                  {formData.officialEmail}
                </p>
              </div>

              {/* OTP INPUT */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter OTP
                </label>

                <div className="relative">
                  <input
                    type="text"
                    name="otp"
                    placeholder="••••••"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength={6}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-[#1f2937] border border-gray-700 text-white text-center tracking-[12px] text-2xl placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#f45a06]"
                  />

                  <ShieldCheck
                    size={20}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>

              <button onClick={handleVerifyOtp} disabled={loading}
                className="w-full bg-[#f45a06] hover:bg-[#d94d05] text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-[#f45a06]/30 hover:scale-[1.01] disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button onClick={handleSendOtp} disabled={loading}
                className="w-full mt-5 text-sm text-[#f45a06] hover:text-orange-400 transition"
              >
                Resend OTP
              </button>
            </>
          )}

          {step === "reset" && (
            <>
              {/* NEW PASSWORD */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-[#1f2937] border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#f45a06]"
                  />

                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f45a06]"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-[#1f2937] border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#f45a06]"
                  />

                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f45a06]"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button onClick={handleResetPassword} disabled={loading}
                className="w-full bg-[#f45a06] hover:bg-[#d94d05] text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-[#f45a06]/30 hover:scale-[1.01] disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-sm text-gray-400">
              OR
            </span>

            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          <Link to={"/login"}
            className="w-full flex justify-center items-center gap-2 border border-[#f45a06] text-[#f45a06] py-3 rounded-xl font-semibold hover:bg-[#f45a06]/10 transition"
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;