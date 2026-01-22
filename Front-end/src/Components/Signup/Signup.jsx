import { useState } from "react";
import { BaseUrl } from "./../../BaseApi/Api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    contact: "",
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
    if (formData?.username == "" && formData?.password == "" && formData?.email == "" && formData?.contact == "") return toast.error('Enter Email and Password!');
    const response = await fetch(BaseUrl + "signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data?.result?._id);
      toast.success('Login Sucessfully!')
      navigate("/");
    } else {
      toast.error(data.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>

        {/* First Name */}
        <input
          type="text"
          name="username"
          placeholder="User Name"
          value={formData?.username}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
        />

        {/* Phone */}
        <input
          type="tel"
          name="contact"
          placeholder="Phone"
          value={formData?.contact}
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

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Signup;