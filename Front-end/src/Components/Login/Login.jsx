import { useState } from "react";
import { BaseUrl } from "./../../BaseApi/Api";
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Redux/authSlice";
import { Eye, EyeOff } from "lucide-react";
import CompLogo from "./../../Assets/company_logo.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()
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

  const handleSubmit = async (e) => {
    if (formData?.email == "" && formData?.password == "") return toast.error('Enter Email and Password!');
    const response = await fetch(BaseUrl + "login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (response.ok) {
      toast.success('Login Sucessfully!')
      dispatch(loginSuccess({ user: data.user }));
      navigate("/", { replace: true });
      window.location.href = "/";
    } else {
      toast.error(data.message || "Login failed");
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

        {/* Left Side */}
        <div className="hidden md:flex flex-col items-center justify-center relative bg-gradient-to-br from-blue-900 via-slate-900 to-cyan-900 text-white p-12">

          {/* Glow Effects */}
          <div className="absolute w-80 h-80 bg-blue-500/20 rounded-full blur-3xl top-[-100px] left-[-100px]" />
          <div className="absolute w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl bottom-[-80px] right-[-80px]" />

          <img
            src={CompLogo}
            alt="Company Logo"
            className="w-56 h-56 object-contain drop-shadow-2xl z-10"
          />

          <h1 className="text-4xl font-bold mt-6 z-10">
            Welcome Back 👋
          </h1>

          <p className="text-blue-100 mt-4 text-center max-w-sm leading-relaxed z-10">
            Securely login to access your dashboard and manage your account with ease.
          </p>
        </div>

        <div className="flex items-center justify-center p-6 md:p-12 bg-white/5 backdrop-blur-lg">
          <div className="w-full max-w-md">
            <div className="md:hidden flex flex-col items-center mb-4">
              <img
                src={CompLogo}
                alt="Company Logo"
                className="w-28 h-28 object-contain"
              />
            </div>

            {/* Heading */}
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-bold text-white">
                Login
              </h2>

              <p className="text-blue-200 mt-2">
                Sign in to continue
              </p>
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData?.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-blue-400/20 rounded-xl text-white placeholder:text-blue-200/60 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 bg-white/10 border border-blue-400/20 rounded-xl text-white placeholder:text-blue-200/60 focus:ring-1 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-200 hover:text-cyan-300 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-5">
              <button className="text-sm text-cyan-300 hover:text-cyan-200 font-medium transition">
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button onClick={handleSubmit} type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:scale-[1.01] hover:shadow-cyan-500/30 transition-all duration-300"
            >
              Login
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-blue-400/20"></div>
              <span className="text-sm text-blue-200">OR</span>
              <div className="flex-1 h-px bg-blue-400/20"></div>
            </div>

            {/* OTP Login */}
            <Link
              to={"/login-otp"}
              className="w-full flex justify-center border border-cyan-400 text-cyan-300 py-3 rounded-xl font-semibold hover:bg-cyan-400/10 transition"
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