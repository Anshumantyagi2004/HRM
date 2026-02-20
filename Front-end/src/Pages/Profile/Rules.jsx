import React from 'react'
import { Pencil, CalendarDays, Calendar1, CalendarClock, ClipboardCheck, Clock1, CalendarCheck, } from "lucide-react";

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

    return (<>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <ClipboardCheck size={18} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 h-8 w-8 p-1.5 rounded-full" />
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
                            <option value="" disabled>Select</option>
                            <option value="09:30">09:30</option>
                            <option value="10:00">10:00</option>
                            <option value="10:30">10:30</option>
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
                            <option value="" disabled>Select</option>
                            <option value="06:00">06:00</option>
                            <option value="06:30">06:30</option>
                            <option value="07:00">07:00</option>
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
                            <option value="" disabled>Select</option>
                            <option value="00:15">00:15</option>
                            <option value="00:30">00:30</option>
                            <option value="01:00">01:00</option>
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
                            <option value="" disabled>Select</option>
                            <option value="00:05">00:15</option>
                            <option value="00:30">00:30</option>
                            <option value="01:00">01:00</option>
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
                            <option value="" disabled>Select</option>
                            <option value="07:00">07:00</option>
                            <option value="07:30">07:30</option>
                            <option value="08:30">08:30</option>
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
                            <option value="" disabled>Select</option>
                            <option value="03:30">03:30</option>
                            <option value="04:00">04:00</option>
                            <option value="04:15">04:15</option>
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
                            <option value="18">18</option>
                            <option value="30">30</option>
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
                            <option value="6">6</option>
                            <option value="8">8</option>
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
    </>)
}
