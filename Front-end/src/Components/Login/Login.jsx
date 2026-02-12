import { useState } from "react";
import { BaseUrl } from "./../../BaseApi/Api";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../Redux/authSlice";

function Login() {
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
    console.log(data);
    if (response.ok) {
      dispatch(loginSuccess({ user: data.user }));
      toast.success('Login Sucessfully!')
      navigate("/");

    } else {
      toast.error(data.message || "Login failed");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {/* Name */}
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={formData?.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <button onClick={handleSubmit}
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;