import React from "react";
import CompLogo from "./../../Assets/company_logo.png";
import { Facebook, Instagram, Linkedin, Bell, ClipboardList,User, LayoutDashboard, Users, CalendarCheck, LogOut, IndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full px-3">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white shadow-md rounded-xl p-5 flex flex-col items-center text-center transition hover:shadow-lg">
            <img
              src={CompLogo}
              alt="Company Logo"
              className="w-36 h-36 object-contain mb-3 rounded-xl"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              Promozione Branding
            </h2>

            <p className="text-sm text-gray-600">
              Digital Marketing Agency
            </p>

            <div className="flex gap-4 mt-3">
              <Link
                to="/"
                className="w-9 h-9 flex items-center justify-center rounded-full 
               bg-blue-50 text-blue-600 
               hover:bg-blue-100 transition"
              >
                <Facebook size={18} />
              </Link>

              <Link
                to="/"
                className="w-9 h-9 flex items-center justify-center rounded-full 
               bg-blue-50 text-blue-700 
               hover:bg-blue-100 transition"
              >
                <Linkedin size={18} />
              </Link>

              <Link
                to="/"
                className="w-9 h-9 flex items-center justify-center rounded-full 
               bg-pink-50 text-pink-600 
               hover:bg-pink-100 transition"
              >
                <Instagram size={18} />
              </Link>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <div className="bg-white shadow-md rounded-xl p-6 transition hover:shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-5">
              Quick Access
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Link
                to="/myProfile"
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg 
                   bg-gray-50 hover:bg-indigo-50 transition"
              >
                <User className="text-indigo-600" size={24} />
                <span className="text-sm font-medium text-gray-700">My Profile</span>
              </Link>
              <Link
                to="/dashboard"
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg 
                   bg-gray-50 hover:bg-indigo-50 transition"
              >
                <LayoutDashboard className="text-indigo-600" size={24} />
                <span className="text-sm font-medium text-gray-700">Dashboard</span>
              </Link>
              <Link
                to="/employees"
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg 
                   bg-gray-50 hover:bg-indigo-50 transition"
              >
                <Users className="text-indigo-600" size={24} />
                <span className="text-sm font-medium text-gray-700">Employees</span>
              </Link>
              <Link
                to="/attendance"
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg 
                   bg-gray-50 hover:bg-indigo-50 transition"
              >
                <CalendarCheck className="text-indigo-600" size={24} />
                <span className="text-sm font-medium text-gray-700">Attendance</span>
              </Link>
              <Link
                to="/leave"
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg 
                   bg-gray-50 hover:bg-indigo-50 transition"
              >
                <LogOut className="text-indigo-600" size={24} />
                <span className="text-sm font-medium text-gray-700">Leave</span>
              </Link>
              <Link
                to="/payroll"
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg 
                   bg-gray-50 hover:bg-indigo-50 transition"
              >
                <IndianRupee className="text-indigo-600" size={24} />
                <span className="text-sm font-medium text-gray-700">Payroll</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="bg-white shadow-md rounded-xl p-5 transition hover:shadow-lg">

            {/* Header */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Tasks & Notifications
            </h2>

            {/* Task Section */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 mb-3">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <ClipboardList size={18} />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-700">Pending Tasks</p>
                <p className="text-sm text-gray-500">You have 5 tasks to complete</p>
              </div>
            </div>

            {/* Announcement Section */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                <Bell size={18} />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-700">Company Announcement</p>
                <p className="text-sm text-gray-500">New HR policy update available</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
