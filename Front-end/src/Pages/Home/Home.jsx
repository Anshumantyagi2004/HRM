import React from "react";
import CompLogo from "./../../Assets/logoo.webp";
import { Facebook, Instagram, Linkedin, Bell, ClipboardList, User, LayoutDashboard, Users, CalendarCheck, LogOut, IndianRupee, Heart, CalendarHeart } from "lucide-react";
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
              className="w-56 h-22 object-contain mb-3 rounded-xl"
            />

            <div className="flex gap-4 mt-3">
              <Link
                to="/"
                className="w-9 h-9 flex items-center justify-center rounded-full 
               bg-blue-50 text-blue-600 
               hover:bg-blue-100 transition"
              >
                <Facebook size={18} />
              </Link>

              <Link to="/"
                className="w-9 h-9 flex items-center justify-center rounded-full 
               bg-pink-50 text-pink-600 
               hover:bg-pink-100 transition"
              >
                <Instagram size={18} />
              </Link>

              <Link
                to="/"
                className="w-9 h-9 flex items-center justify-center rounded-full 
               bg-blue-50 text-blue-700 
               hover:bg-blue-100 transition"
              >
                <Linkedin size={18} />
              </Link>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <div className="bg-white shadow-md rounded-xl p-6 transition hover:shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1e3a56]">
                Quick Access
              </h2>

              <div className="w-10 h-1 rounded-full bg-[#f45a06]"></div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">

              {/* My Profile */}
              <Link
                to="/myProfile"
                className="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl 
    border border-[#1e3a56]/10 bg-white hover:bg-[#1e3a56] 
    shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a56]/5 to-[#f45a06]/10 opacity-0 group-hover:opacity-100 transition"></div>

                <div className="relative z-10 p-3 rounded-xl bg-[#f45a06]/10 group-hover:bg-white/10 transition">
                  <User
                    className="text-[#f45a06] group-hover:text-white transition"
                    size={24}
                  />
                </div>

                <span className="relative z-10 text-sm font-semibold text-[#1e3a56] group-hover:text-white transition">
                  My Profile
                </span>
              </Link>

              {/* Dashboard */}
              <Link
                to="/dashboard"
                className="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl 
    border border-[#1e3a56]/10 bg-white hover:bg-[#1e3a56] 
    shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a56]/5 to-[#f45a06]/10 opacity-0 group-hover:opacity-100 transition"></div>

                <div className="relative z-10 p-3 rounded-xl bg-[#f45a06]/10 group-hover:bg-white/10 transition">
                  <LayoutDashboard
                    className="text-[#f45a06] group-hover:text-white transition"
                    size={24}
                  />
                </div>

                <span className="relative z-10 text-sm font-semibold text-[#1e3a56] group-hover:text-white transition">
                  Dashboard
                </span>
              </Link>

              {/* Employees */}
              <Link
                to="/employees"
                className="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl 
    border border-[#1e3a56]/10 bg-white hover:bg-[#1e3a56] 
    shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a56]/5 to-[#f45a06]/10 opacity-0 group-hover:opacity-100 transition"></div>

                <div className="relative z-10 p-3 rounded-xl bg-[#f45a06]/10 group-hover:bg-white/10 transition">
                  <Users
                    className="text-[#f45a06] group-hover:text-white transition"
                    size={24}
                  />
                </div>

                <span className="relative z-10 text-sm font-semibold text-[#1e3a56] group-hover:text-white transition">
                  Employees
                </span>
              </Link>

              {/* Attendance */}
              <Link
                to="/attendance"
                className="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl 
    border border-[#1e3a56]/10 bg-white hover:bg-[#1e3a56] 
    shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a56]/5 to-[#f45a06]/10 opacity-0 group-hover:opacity-100 transition"></div>

                <div className="relative z-10 p-3 rounded-xl bg-[#f45a06]/10 group-hover:bg-white/10 transition">
                  <CalendarCheck
                    className="text-[#f45a06] group-hover:text-white transition"
                    size={24}
                  />
                </div>

                <span className="relative z-10 text-sm font-semibold text-[#1e3a56] group-hover:text-white transition">
                  Attendance
                </span>
              </Link>

              {/* Leave */}
              <Link
                to="/leave"
                className="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl 
    border border-[#1e3a56]/10 bg-white hover:bg-[#1e3a56] 
    shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a56]/5 to-[#f45a06]/10 opacity-0 group-hover:opacity-100 transition"></div>

                <div className="relative z-10 p-3 rounded-xl bg-[#f45a06]/10 group-hover:bg-white/10 transition">
                  <LogOut
                    className="text-[#f45a06] group-hover:text-white transition"
                    size={24}
                  />
                </div>

                <span className="relative z-10 text-sm font-semibold text-[#1e3a56] group-hover:text-white transition">
                  Leave
                </span>
              </Link>

              {/* Payroll */}
              <Link
                to="/payroll"
                className="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-5 rounded-2xl 
    border border-[#1e3a56]/10 bg-white hover:bg-[#1e3a56] 
    shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a56]/5 to-[#f45a06]/10 opacity-0 group-hover:opacity-100 transition"></div>

                <div className="relative z-10 p-3 rounded-xl bg-[#f45a06]/10 group-hover:bg-white/10 transition">
                  <IndianRupee
                    className="text-[#f45a06] group-hover:text-white transition"
                    size={24}
                  />
                </div>

                <span className="relative z-10 text-sm font-semibold text-[#1e3a56] group-hover:text-white transition">
                  Payroll
                </span>
              </Link>

            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-3">
          <div className="bg-white border border-[#1e3a56]/10 shadow-sm rounded-2xl p-5 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#1e3a56]">
                Information
              </h2>

              <div className="w-10 h-1 rounded-full bg-[#f45a06]"></div>
            </div>

            <Link
              to={"/notification"}
              className="group relative overflow-hidden border border-[#1e3a56]/10 flex items-start gap-4 p-4 rounded-2xl bg-white hover:bg-[#1e3a56] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg mb-4"
            >

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#f45a06]/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

              {/* Icon */}
              <div className="relative z-10 w-11 h-11 flex items-center justify-center rounded-xl bg-[#f45a06]/10 group-hover:bg-white/10 transition">
                <Bell
                  size={20}
                  className="text-[#f45a06] group-hover:text-white transition"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 text-left">
                <p className="font-semibold text-[#1e3a56] group-hover:text-white transition">
                  Company Announcement
                </p>

                <p className="text-sm text-gray-500 group-hover:text-gray-300 transition mt-1">
                  Check latest company updates & notices
                </p>
              </div>
            </Link>

            <Link
              to={"/holiday"}
              className="group relative overflow-hidden border border-[#1e3a56]/10 flex items-start gap-4 p-4 rounded-2xl bg-white hover:bg-[#1e3a56] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#f45a06]/5 to-transparent opacity-0 group-hover:opacity-100 transition"></div>

              {/* Icon */}
              <div className="relative z-10 w-11 h-11 flex items-center justify-center rounded-xl bg-[#f45a06]/10 group-hover:bg-white/10 transition">
                <CalendarHeart
                  size={20}
                  className="text-[#f45a06] group-hover:text-white transition"
                />
              </div>

              {/* Content */}
              <div className="relative z-10 text-left">
                <p className="font-semibold text-[#1e3a56] group-hover:text-white transition">
                  Holiday Calendar
                </p>

                <p className="text-sm text-gray-500 group-hover:text-gray-300 transition mt-1">
                  View upcoming holidays & events
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
