import { useState } from "react";
import { BaseUrl } from "./../../BaseApi/Api";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Redux/authSlice";
import { Eye, EyeOff } from "lucide-react";
import CompLogo from "./../../Assets/logoo.webp";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      return toast.error("Enter Email and Password!");
    }

    try {
      const response = await fetch(BaseUrl + "login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Login Successfully!");

        dispatch(loginSuccess({ user: data.user }));

        navigate("/", { replace: true });

        window.location.href = "/";
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4 py-10 overflow-hidden relative">

      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-[#f45a06]/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-[#1e3a56]/40 blur-3xl rounded-full"></div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.5)]">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-[#1e3a56] to-[#13293d] text-white relative p-14">

          <div className="absolute w-72 h-72 bg-[#f45a06]/20 rounded-full blur-3xl top-[-80px] right-[-80px]" />

          <img
            src={CompLogo}
            alt="Company Logo"
            className="w-72 object-contain mb-6 z-10 drop-shadow-2xl"
          />

          <h1 className="text-4xl font-bold z-10 tracking-wide">
            Welcome Back
          </h1>

          <p className="text-gray-300 mt-5 text-center max-w-sm leading-relaxed z-10 text-lg">
            Securely login to access your dashboard and manage your business efficiently.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center bg-[#111827]/80 px-6 py-10 md:px-14">

          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="md:hidden flex justify-center mb-6">
              <img
                src={CompLogo}
                alt="Logo"
                className="w-40 object-contain"
              />
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-white">
                Login
              </h2>

              <p className="text-gray-400 mt-2">
                Please sign in to continue
              </p>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#1f2937] border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#f45a06] transition"
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-[#1f2937] border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#f45a06] transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#f45a06] transition"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-6">
              <Link to={"/forgot-password"} className="text-sm text-[#f45a06] hover:text-orange-400 transition">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-[#f45a06] hover:bg-[#d94d05] text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-[#f45a06]/30 hover:scale-[1.01]"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">
              <div className="flex-1 h-px bg-gray-700"></div>

              <span className="text-sm text-gray-400">
                OR
              </span>

              <div className="flex-1 h-px bg-gray-700"></div>
            </div>

            {/* OTP Login */}
            <Link
              to={"/login-otp"}
              className="w-full flex justify-center border border-[#f45a06] text-[#f45a06] py-3 rounded-xl font-semibold hover:bg-[#f45a06]/10 transition"
            >
              Login with OTP
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;