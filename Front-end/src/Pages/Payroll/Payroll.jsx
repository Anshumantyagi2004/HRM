import { Eye, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { BaseUrl } from "../../BaseApi/Api";
import Modal from '../../Components/Modal/Modal';
import { months, years } from '../../Data/data'
import AdminPayroll from './AdminPayroll';
import EmployeePayroll from './EmployeePayroll';
export default function Payroll() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [text, setText] = useState(user.role != "Employee" ? "Employee" : "PaySlip")
    const [allUsers, setAllUsers] = useState([])
    const [userPayRoll, setUserPayRoll] = useState()

    useEffect(() => {
        if (user.role != "Employee") {
            async function fetchMyProfile() {
                try {
                    const res = await fetch(BaseUrl + "allUserPayroll", {
                        credentials: "include",
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    const data = await res.json();
                    setAllUsers(data.data);
                } catch (error) {
                    console.error("Fetch profile error:", error);
                    throw error;
                }
            };
            fetchMyProfile()
        }

        if (user.role == "Employee") {
            async function fetchMyProfile() {
                try {
                    const res = await fetch(BaseUrl + "UserPayDetail", {
                        credentials: "include",
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    const data = await res.json();
                    setUserPayRoll(data.data);
                } catch (error) {
                    console.error("Fetch profile error:", error);
                    throw error;
                }
            };
            fetchMyProfile()
        }
    }, [])

    const currentDate = new Date();
    const [year, setYear] = useState(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth());
    const [open, setOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const payrollMap = [
        { label: "CTC", key: "ctc" },
        { label: "Basic", key: "basicPay" },
        { label: "HRA", key: "HRA" },
        { label: "Bonus", key: "bonus" },
        { label: "Special Allowance", key: "specialAllowance" },
        { label: "Medical Allowance", key: "medicalAllowance" },
        { label: "TA/DA", key: "ta" },
        { label: "Overtime", key: "overtime" }, // if not present → fallback
    ];

    return (<>{user.role == "Admin" ? <AdminPayroll user={user}/> : <EmployeePayroll user={user}/>}</>)
}
