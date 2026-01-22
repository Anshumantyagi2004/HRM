import { Routes, Route ,Navigate} from 'react-router-dom';
import Home from './../Pages/Home/Home.jsx';
import Signup from './../Components/Signup/Signup';
import Login from './../Components/Login/Login';
import MyProfile from '../Pages/Profile/MyProfile.jsx';
import Dashboard from '../Pages/Dashboard/Dashboard.jsx';
import Employees from '../Pages/Employees/Employees.jsx';
import Leave from '../Pages/Leave/Leave.jsx';
import Attendance from '../Pages/Attendance/Attendance.jsx';
import toast from "react-hot-toast";
import ProtectedRoute from './RoutesValidation.jsx';

function AllRoute() {

  return (
    <>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

       <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/myProfile" element={<MyProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/leave" element={<Leave />} />
        <Route path="/attendance" element={<Attendance />} />
      </Route>
      </Routes>
    </>
  );
}

export default AllRoute;