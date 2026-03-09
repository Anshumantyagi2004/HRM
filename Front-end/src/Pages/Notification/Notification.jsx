import React from 'react'
import { useSelector, } from "react-redux";
import AdminNotification from './AdminNotification';
import EmployeeNotification from './EmployeeNotification';

export default function Notification() {
  const { user } = useSelector((state) => state.auth);
  return (<>
    {user.role == "Admin" ? <AdminNotification user={user} /> : <EmployeeNotification user={user} />}
  </>)
}
