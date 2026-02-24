import React, { useEffect, useState } from 'react'
import { Pencil, CalendarDays, Calendar1, CalendarClock, ClipboardCheck, Clock1, CalendarCheck, } from "lucide-react";
import Modal from '../../Components/Modal/Modal';
import { BaseUrl } from "../../BaseApi/Api";

export default function Rules(props) {
    const {
        user,
        editText,
        setEditText,
        setRulesForm,
        rulesForm,
        handleChangeRules,
        rulesInfo,
        addRules
    } = props
    const [rulesAddModal, setRulesAddModal] = useState(false)
    const [rulesAddModalDetails, setRulesAddModalDetails] = useState(false)
    const [rules, setRules] = useState([])
    const generateTimes = () => {
        const times = [];
        for (let h = 0; h < 24; h++) {
            for (let m = 1; m < 60; m++) {   // start from 00:01
                const hh = String(h).padStart(2, "0");
                const mm = String(m).padStart(2, "0");
                times.push(`${hh}:${mm}`);
            }
        }
        return times;
    };

    const TIMES = generateTimes();

    const [rulesInfoForm, setRulesInfoForm] = React.useState({
        shiftStartTime: "",
        shiftOutTime: "",
        inTimeGrace: "",
        outTimeGrace: "",
        fullDay: "",
        halfDay: "",
        casualLeave: "",
        sickLeave: "",
        ruleName: "",
    });

    const handleChangeRulesForm = (e) => {
        const { name, value } = e.target;

        setRulesInfoForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch(`${BaseUrl}addRules`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rulesInfoForm),
            });
            const result = await res.json();
            if (!res.ok) {
                console.log("Failed to add rules");
            } else {
                getInfo();
                setRulesInfoForm({
                    shiftStartTime: "",
                    shiftOutTime: "",
                    inTimeGrace: "",
                    outTimeGrace: "",
                    fullDay: "",
                    halfDay: "",
                    casualLeave: "",
                    sickLeave: "",
                    ruleName: "",
                });
                setRulesAddModal(false)
            }
        } catch (err) {
            console.error(err);
            alert(err.message || "Failed to add rules ❌");
        }
    };

    const getInfo = async () => {
        try {
            const res = await fetch(`${BaseUrl}getRules`, { credentials: "include", });
            const data = await res.json();
            setRules(data);
        } catch (error) {
            console.error("Fetch profile error:", error);
            throw error;
        }
    };

    useEffect(() => {
        getInfo()
    }, [])

    return (<>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <ClipboardCheck onClick={() => { user?.role == "Admin" && setRulesAddModal(true) }}
                        size={18} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 h-8 w-8 p-1.5 rounded-full" />
                    Rules
                </h2>
                {user?.role == "Admin" &&
                    <button className="p-2 rounded-full hover:bg-gray-100 transition" onClick={() => setEditText("Rules")}>
                        <Pencil size={18} />
                    </button>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm p-2">
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Clock1 size={18} className="text-indigo-600" />
                        Shift Start Time
                    </label>
                    {editText === "Rules" ? (
                        <select className="input"
                            name="shiftStartTime"
                            defaultValue={""}
                            onChange={handleChangeRules}
                            value={rulesForm?.shiftStartTime || rulesInfo?.shiftStartTime || ""}
                        >
                            {rules.map((i, idx) => (
                                <option>{i?.shiftStartTime}</option>
                            ))}
                        </select>
                    ) : (
                        <p className="value">{rulesInfo?.shiftStartTime || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Clock1 size={18} className="text-indigo-600" />
                        Shift Out Time
                    </label>
                    {editText === "Rules" ? (
                        <select className="input"
                            name="shiftOutTime"
                            defaultValue={""}
                            onChange={handleChangeRules}
                            value={rulesForm?.shiftOutTime || rulesInfo?.shiftOutTime || ""}
                        >
                            {rules.map((i, idx) => (
                                <option>{i?.shiftOutTime}</option>
                            ))}
                        </select>
                    ) : (
                        <p className="value">{rulesInfo?.shiftOutTime || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Clock1 size={18} className="text-indigo-600" />
                        In Time Grace
                    </label>
                    {editText === "Rules" ? (
                        <select className="input"
                            name="inTimeGrace"
                            defaultValue={""}
                            onChange={handleChangeRules}
                            value={rulesForm?.inTimeGrace || rulesInfo?.inTimeGrace || ""}
                        >
                            {rules.map((i, idx) => (
                                <option>{i?.inTimeGrace}</option>
                            ))}
                        </select>
                    ) : (
                        <p className="value">{rulesInfo?.inTimeGrace || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Clock1 size={18} className="text-indigo-600" />
                        Out Time Grace
                    </label>
                    {editText === "Rules" ? (
                        <select className="input"
                            name="outTimeGrace"
                            defaultValue={""}
                            onChange={handleChangeRules}
                            value={rulesForm?.outTimeGrace || rulesInfo?.outTimeGrace || ""}
                        >
                            {rules.map((i, idx) => (
                                <option>{i?.outTimeGrace}</option>
                            ))}
                        </select>
                    ) : (
                        <p className="value">{rulesInfo?.outTimeGrace || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Calendar1 size={18} className="text-indigo-600" />
                        Full Day
                    </label>
                    {editText === "Rules" ? (
                        <select className="input"
                            name="fullDay"
                            defaultValue={""}
                            onChange={handleChangeRules}
                            value={rulesForm?.fullDay || rulesInfo?.fullDay || ""}
                        >
                            {rules.map((i, idx) => (
                                <option>{i?.fullDay}</option>
                            ))}
                        </select>
                    ) : (
                        <p className="value">{rulesInfo?.fullDay || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Calendar1 size={18} className="text-indigo-600" />
                        Half Day
                    </label>
                    {editText === "Rules" ? (
                        <select className="input"
                            name="halfDay"
                            defaultValue={""}
                            onChange={handleChangeRules}
                            value={rulesForm?.halfDay || rulesInfo?.halfDay || ""}
                        >
                            {rules.map((i, idx) => (
                                <option>{i?.halfDay}</option>
                            ))}
                        </select>
                    ) : (
                        <p className="value">{rulesInfo?.halfDay || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <CalendarClock size={18} className="text-indigo-600" />
                        Causal Leave
                    </label>
                    {editText === "Rules" ? (
                        <select className="input"
                            name="casualLeave"
                            defaultValue={""}
                            onChange={handleChangeRules}
                            value={rulesForm?.casualLeave || rulesInfo?.casualLeave || ""}
                        >
                            <option value="0">Select</option>
                            {rules.map((i, idx) => (
                                <option>{i?.casualLeave}</option>
                            ))}
                        </select>
                    ) : (
                        <p className="value">{rulesInfo?.casualLeave || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <CalendarCheck size={18} className="text-indigo-600" />
                        Sick Leave
                    </label>
                    {editText === "Rules" ? (
                        <select className="input"
                            name="sickLeave"
                            defaultValue={""}
                            onChange={handleChangeRules}
                            value={rulesForm?.sickLeave || rulesInfo?.sickLeave || ""}
                        >
                            <option value="0">Select</option>
                            {rules.map((i, idx) => (
                                <option>{i?.sickLeave}</option>
                            ))}
                        </select>
                    ) : (
                        <p className="value">{rulesInfo?.sickLeave || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <CalendarCheck size={18} className="text-indigo-600" />
                        Loss of Pay
                    </label>
                    {editText === "Rules" ? (
                        <select className="input"
                            name="lossOfPay"
                            defaultValue={""}
                            onChange={handleChangeRules}
                            value={rulesForm?.lossOfPay || rulesInfo?.lossOfPay || ""}
                        >
                            <option value="" disabled>Select</option>
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                    ) : (
                        <p className="value">{rulesInfo?.lossOfPay || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <CalendarDays size={18} className="text-indigo-600" />
                        Comp Off
                    </label>
                    {editText === "Rules" ? (
                        <select className="input"
                            name="compOff"
                            defaultValue={""}
                            onChange={handleChangeRules}
                            value={rulesForm?.compOff || rulesInfo?.compOff || ""}
                        >
                            <option value="0" disabled>Select</option>
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                    ) : (
                        <p className="value">{rulesInfo?.compOff || "-"}</p>
                    )}
                </div>
                <div></div>
                <div className={`flex justify-end gap-3 items-end transition-all duration-300
                                ${editText === "Rules"
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}>
                    <button onClick={() => setEditText("")}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
                        Cancel
                    </button>

                    <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" onClick={addRules}>
                        Save
                    </button>
                </div>
            </div>
        </div>

        <Modal open={rulesAddModal} onClose={() => setRulesAddModal(false)}>
            <Modal.Header title="Add Rules Here" />
            <Modal.Body>
                {rulesAddModalDetails ? <div className='h-80 overflow-auto space-y-2'>
                    {rules.map((i, idx) => (
                        <div className='space-y-2 border shadow-sm transition px-2 py-3 rounded-md' key={idx}>
                            <div className="grid grid-cols-2 gap-3">
                                <p><span className="font-medium">Name:</span> {i?.ruleName}</p>
                                <p><span className="font-medium">Assigned Emp:</span> 2</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <p><span className="font-medium">Shift Start Time:</span> {i?.shiftStartTime}</p>
                                <p><span className="font-medium">Shift Out Time:</span> {i?.shiftOutTime}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <p><span className="font-medium">In Time Grace:</span> {i?.inTimeGrace}</p>
                                <p><span className="font-medium">Out Time Grace:</span> {i?.outTimeGrace}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <p><span className="font-medium">Full Day:</span> {i?.fullDay}</p>
                                <p><span className="font-medium">Half Day:</span> {i?.halfDay}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <p><span className="font-medium">Casual Leave:</span> {i?.casualLeave}</p>
                                <p><span className="font-medium">Sick Leave:</span> {i?.sickLeave}</p>
                            </div>
                        </div>
                    ))}
                </div>
                    : <>
                        <div className="flex flex-col mb-2">
                            {/* <label className="text-sm font-medium text-gray-700 mb-1">
                        Rule Name
                    </label> */}
                            <input
                                type="text"
                                name="ruleName"
                                value={rulesInfoForm.ruleName}
                                onChange={handleChangeRulesForm}
                                placeholder="Rule Name"
                                className="input w-full"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Shift Start Time
                                </label>
                                <input
                                    type="time"
                                    name="shiftStartTime"
                                    value={rulesInfoForm.shiftStartTime}
                                    onChange={handleChangeRulesForm}
                                    className="input w-full"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Shift Out Time
                                </label>
                                <input
                                    type="time"
                                    name="shiftOutTime"
                                    value={rulesInfoForm.shiftOutTime}
                                    onChange={handleChangeRulesForm}
                                    className="input w-full"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    In Time Grace
                                </label>
                                <select className="input"
                                    name="inTimeGrace"
                                    defaultValue={""}
                                    value={rulesInfoForm.inTimeGrace}
                                    onChange={handleChangeRulesForm}
                                >
                                    {TIMES.map((time) => (
                                        <option key={time} value={time}>{time}</option>)
                                    )}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Out Time Grace
                                </label>
                                <select className="input"
                                    name="outTimeGrace"
                                    defaultValue={""}
                                    value={rulesInfoForm.outTimeGrace}
                                    onChange={handleChangeRulesForm}
                                >
                                    {TIMES.map((time) => (
                                        <option key={time} value={time}>{time}</option>)
                                    )}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Full Day
                                </label>
                                <select className="input"
                                    name="fullDay"
                                    defaultValue={""}
                                    value={rulesInfoForm.fullDay}
                                    onChange={handleChangeRulesForm}
                                >
                                    {TIMES.map((time) => (
                                        <option key={time} value={time}>{time}</option>)
                                    )}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Half Day
                                </label>
                                <select className="input"
                                    name="halfDay"
                                    defaultValue={""}
                                    value={rulesInfoForm.halfDay}
                                    onChange={handleChangeRulesForm}
                                >
                                    {TIMES.map((time) => (
                                        <option key={time} value={time}>{time}</option>)
                                    )}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Casual Leave
                                </label>
                                <select className="input"
                                    name="casualLeave"
                                    defaultValue={""}
                                    value={rulesInfoForm.casualLeave}
                                    onChange={handleChangeRulesForm}
                                >
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">
                                    Sick Leave
                                </label>
                                <select className="input"
                                    name="sickLeave"
                                    defaultValue={""}
                                    value={rulesInfoForm.sickLeave}
                                    onChange={handleChangeRulesForm}
                                >
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((num) => (
                                        <option key={num} value={num}>
                                            {num}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </>}
            </Modal.Body>
            <Modal.Footer>
                <div className="flex justify-between w-full">
                    <button
                        onClick={() => { setRulesAddModalDetails(true); }}
                        className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                        Details
                    </button>

                    <div className='flex gap-2'>
                        <button
                            onClick={() => handleSubmit()}
                            className="px-4 py-2 border rounded-lg text-white hover:bg-indigo-700 bg-indigo-600"
                        >
                            Add
                        </button>

                        <button
                            onClick={() => { setRulesAddModal(false); setRulesAddModalDetails(false) }}
                            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal.Footer>
        </Modal>
    </>)
}
