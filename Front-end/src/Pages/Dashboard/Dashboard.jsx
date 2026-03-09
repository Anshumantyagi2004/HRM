
import React from "react";
import { useSelector, } from "react-redux";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";

export default function Dashboard() {
    const { user } = useSelector((state) => state.auth);

    return (<> {user.role == "Admin" ? <AdminDashboard user={user} /> : <EmployeeDashboard user={user} />}</>);
}
