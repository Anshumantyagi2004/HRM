import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './../Pages/Home/Home.jsx';
import Signup from './../Components/Signup/Signup';
import Login from './../Components/Login/Login';
import MyProfile from '../Pages/Profile/MyProfile.jsx';
import Dashboard from '../Pages/Dashboard/Dashboard.jsx';
import Employees from '../Pages/Employees/Employees.jsx';
import Leave from '../Pages/Leave/Leave.jsx';
import Attendance from '../Pages/Attendance/Attendance.jsx';
import ProtectedRoute from './RoutesValidation.jsx';
import MainLayout from '../MainLayout.jsx';
import UserProfile from '../Pages/Profile/UserProile.jsx';
import Payroll from '../Pages/Payroll/Payroll.jsx';
import Holiday from '../Pages/Holiday/Holiday.jsx';
import OtpLogin from '../Components/Login/OtpLogin.jsx';
import Notification from '../Pages/Notification/Notification.jsx';

function AllRoute() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login-otp" element={<OtpLogin />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/myProfile" element={<MyProfile />} />
            <Route path="/userProfile/:userId" element={<UserProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/holiday" element={<Holiday />} />
            <Route path="/notification" element={<Notification />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default AllRoute;