import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Gauge, Users, Calendar, User, Handbag, Bell, Sun, LogOut, UserCircle, UserPlus, IndianRupee } from "lucide-react";
import { BaseUrl } from "../../BaseApi/Api";
import Modal from "../Modal/Modal";
import toast from "react-hot-toast";
import SignToggle from "./ToggleButton";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/authSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // const UserId = localStorage.getItem(user?._id)
  const [UserId, setUserId] = useState(user?._id)
  const [notifications, setNotifications] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const bellRef = useRef(null);
  const [isUserOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);

  useEffect(() => {
    fetchTodayAttendance()
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setNotificationOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(BaseUrl + "logout", {
        method: "POST",
        credentials: "include", // 🔥 send cookie
      });

      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const [formData, setFormData] = useState({
    username: "",
    role: "",
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
    if (formData?.username == "" || formData?.password == "" || formData?.role == "" ||  formData?.email == "" || formData?.contact == "") return toast.error('Enter User Credentials First!');
    const response = await fetch(BaseUrl + "newUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    const data = await response.json();
    // console.log(data);
    if (response.ok) {
      setIsOpen(false)
      setFormData()
      toast.success('User Created Sucessfully!')
    } else {
      toast.error(data.message || "Something Error Ocurrs");
    }
  };

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (error) => {
          if (error.code === 1) {
            reject("Location permission denied, Turn on GPS");
          } else if (error.code === 2) {
            reject("Location unavailable. Turn on GPS");
          } else if (error.code === 3) {
            reject("Location request timed out");
          } else {
            reject("Unable to fetch location");
          }
        },
        { enableHighAccuracy: true }
      );
    });
  };

  const handleClockIn = async () => {
    try {
      setLoading(true);
      const location = await getUserLocation();

      const res = await fetch(`${BaseUrl}clock-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      }
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Clock In failed");
      } else {
        setIsClockedIn(true);
        toast.success(data.message || "Clock In successfully");
      }

    } catch (err) {
      toast.error(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  const formatWorkDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const handleClockOut = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BaseUrl}clock-out`, { method: "POST", credentials: "include", });
      const data = await res.json();

      if (!res.ok) return toast.error(data.message);

      setIsClockedIn(false);

      toast.success(
        `Clock Out successful 🕒 Work: ${formatWorkDuration(data.workDuration)}`
      );

    } catch (error) {
      toast.error(error.message || "Clock out failed");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleClock = () => {
    if (!isClockedIn) handleClockIn();
    else handleClockOut();
  };

  const fetchTodayAttendance = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BaseUrl}attendance/today`, { credentials: "include", });
      const data = await res.json();
      if (res.ok && data.attendance) {
        setIsClockedIn(true);
      } else {
        setIsClockedIn(false);
      }
    } catch (error) {
      console.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  return (<>
    <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {isAuthenticated &&
          <button
            className="mdhidden text-indigo-600"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu size={26} />
          </button>}
        <Link to="/" className="text-xl font-bold text-indigo-600 md:block hidden">
          Promozione
        </Link>
      </div>

      {isAuthenticated &&
        <div className="hidden md:flex gap-6 font-medium">
          <Link className="hover:text-indigo-600" to="/myProfile">My Profile</Link>
          <Link className="hover:text-indigo-600" to="/dashboard">Dashboard</Link>
          <Link className="hover:text-indigo-600" to="/employees">Employees</Link>
          <Link className="hover:text-indigo-600" to="/attendance">Attendance</Link>
          <Link className="hover:text-indigo-600" to="/leave">Leave</Link>
          <Link className="hover:text-indigo-600" to="/payroll">Payroll</Link>
        </div>}

      <div className="flex items-center">
        <SignToggle
          onToggle={handleToggleClock}
          isClockedIn={isClockedIn}
          loading={loading}
        />
        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <Sun size="22" />
        </button>
        {isAuthenticated ? (<>
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => setNotificationOpen(!isNotificationOpen)}
              className="relative p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Bell size={22} />
              {notifications.length > 0 &&
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg border z-50">
                <div className="p-3 border-b font-medium text-gray-700">
                  Notifications
                </div>

                {notifications.length > 0 ? (
                  notifications.map((n, index) => (
                    <div
                      key={index}
                      className={`p-3 border-l-4 ${n.status === "Approved"
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                        }`}
                    >
                      <p className="text-sm font-medium">{n.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(n.time).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-sm text-gray-500 text-center">
                    No notifications
                  </div>
                )}
              </div>
            )}

          </div>
          <div className="relative" ref={userRef}>
            <button
              onClick={() => setUserOpen(!isUserOpen)}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition"
            >
              {user?.profileImage ?
                <img
                  src={user?.profileImage}
                  alt="Add Profile"
                  className="w-8 h-8 rounded-full object-cover border"
                /> :
                <UserCircle size={26} className="text-gray-700" />}
            </button>

            {isUserOpen && (
              <div className="absolute right-0 w-80 bg-white shadow-lg rounded-lg border z-50">
                <div className="px-4 py-3 border-b text-center">
                  <p className="text-base font-semibold text-gray-800">
                    {user?.username || "User"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {user?.email || "Email.com"}
                  </p>
                </div>

                <div className="py-1">
                  <Link
                    to="/myProfile"
                    className="flex items-center gap-2 px-4 py-2 text-base text-gray-700 hover:bg-gray-100"
                    onClick={() => setUserOpen(false)}
                  >
                    <User size={16} /> My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-base text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </>) : (
          <>
            <Link
              to="/login"
              className="text-sm text-white ml-2 bg-indigo-600 px-3 py-2 rounded hover:bg-indigo-700 transition"
            >
              Login
            </Link>
            {/* <Link
                to="/signup"
                className="text-sm text-white ml-2 bg-indigo-600 px-3 py-2 rounded hover:bg-indigo-700 transition"
              >
                Sign Up
              </Link> */}
          </>
        )}
      </div>
    </nav>

    <div
      onClick={() => setIsSidebarOpen(false)}
      className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
    />

    {user?.role == "Admin" && <>
      <div className="fixed bottom-6 right-6 z-50">
        <button className="flex items-center justify-center h-14 w-14 rounded-full bg-indigo-600 text-white
             shadow-lg hover:bg-indigo-700 hover:shadow-xl active:scale-95 transition duration-200"
          title="Add Employee" onClick={() => setIsOpen(true)}
        >
          <UserPlus size={22} />
        </button>
      </div>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <Modal.Header title="Add New Employee" />
        <Modal.Body>
          <div className="">
            <input
              type="text"
              name="username"
              placeholder="User Name"
              value={formData?.username}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
            />

            {/* <select value={formData?.designation} onChange={handleChange} name="designation"
              className="w-full mb-3 p-2 border rounded">
              <option value="" disabled>Designation</option>
              <option value="Web Developer">Web Developer</option>
              <option value="SEO">SEO</option>
              <option value="Social Media">Social Media</option>
              <option value="ADS Manger">ADS Manger</option>
              <option value="Marketing">Marketing</option>
            </select> */}

            <select value={formData?.role} onChange={handleChange} name="role"
              className="w-full mb-3 p-2 border rounded">
              <option value="" disabled>Role</option>
              <option value="Admin">Admin</option>
              <option value="Sub Admin">Sub Admin</option>
              <option value="Employee">Employee</option>
            </select>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData?.email}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              type="tel"
              name="contact"
              placeholder="Phone"
              value={formData?.contact}
              onChange={handleChange}
              className="w-full mb-3 p-2 border rounded"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData?.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            onClick={() => { setIsOpen(false); setFormData() }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 ml-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add
          </button>
        </Modal.Footer>
      </Modal>
    </>}

    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex items-center justify-between p-[17px] border-b">
        <h2 className="text-lg font-bold text-indigo-600">Menu</h2>
        <button onClick={() => setIsSidebarOpen(false)} className="text-indigo-600">
          <X />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <Link
          to="/myProfile" onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 p-2 rounded hover:bg-indigo-50 transition"
        >
          <User size={18} /> My Profile
        </Link>
        <Link
          to="/dashboard" onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 p-2 rounded hover:bg-indigo-50 transition"
        >
          <Gauge size={18} /> Dashboard
        </Link>
        <Link
          to="/employees" onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 p-2 rounded hover:bg-indigo-50 transition"
        >
          <Users size={18} /> Employees
        </Link>
        <Link
          to="/attendance" onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 p-2 rounded hover:bg-indigo-50 transition"
        >
          <Calendar size={18} /> Attendance
        </Link>
        <Link
          to="/leave" onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 p-2 rounded hover:bg-indigo-50 transition"
        >
          <Handbag size={18} /> Leave
        </Link>
        <Link
          to="/payroll" onClick={() => setIsSidebarOpen(false)}
          className="flex items-center gap-3 p-2 rounded hover:bg-indigo-50 transition"
        >
          <IndianRupee size={18} /> Payroll
        </Link>
      </div>
    </aside>

  </>);
}
