import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './../Pages/Home/Home.jsx';
import Signup from './../Components/Signup/Signup';
import NotificationListener from './../Components/Notification/Notification.jsx';
import Login from './../Components/Login/Login';
import MyProfile from '../Pages/Profile/MyProfile.jsx';
import Dashboard from '../Pages/Dashboard/Dashboard.jsx';
import Employees from '../Pages/Employees/Employees.jsx';
import Leave from '../Pages/Leave/Leave.jsx';
import Attendance from '../Pages/Attendance/Attendance.jsx';
import toast from "react-hot-toast";
import ProtectedRoute from './RoutesValidation.jsx';
import { SocketProvider } from '../Context/SocketContext.jsx';
import { NotificationProvider } from '../Context/Notification.jsx';
import MainLayout from '../MainLayout.jsx';
import UserProfile from '../Pages/Profile/UserProile.jsx';

function AllRoute() {
  const userId = localStorage.getItem("userId")
  return (
    <>
      <SocketProvider userId={userId}>
        <NotificationProvider>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/myProfile" element={<MyProfile />} />
                <Route path="/userProfile/:userId" element={<UserProfile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/leave" element={<Leave />} />
                <Route path="/attendance" element={<Attendance />} />
              </Route>
            </Route>
          </Routes>
          <NotificationListener />
        </NotificationProvider>
      </SocketProvider>
    </>
  );
}

export default AllRoute;