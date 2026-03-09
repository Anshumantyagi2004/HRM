import React from 'react'
import { useSelector, } from "react-redux";
import AdminHoliday from './AdminHoliday';
import EmployeeHoliday from './EmployeeHoliday';

export default function Holiday() {
    const { user } = useSelector((state) => state.auth);

    return (<>
        {user.role == "Admin" ? <AdminHoliday user={user} /> : <EmployeeHoliday user={user} />}
    </>)
}
