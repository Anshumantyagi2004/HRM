import React from 'react'
import { Pencil, Landmark, User, LocationEdit, ReceiptIndianRupee, IndianRupee, IdCard, } from "lucide-react";

export default function Payroll(props) {
    const {
        user,
        editText,
        setEditText,
        payrollForm,
        payrollInfo,
        handleChangePayroll,
        addPayroll
    } = props

    return (<>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <Landmark size={18} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 h-8 w-8 p-1.5 rounded-full" />
                    Bank
                </h2>
                <button className="p-2 rounded-full hover:bg-gray-100 transition" onClick={() => setEditText("Payroll")}>
                    <Pencil size={18} />
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm p-2">
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <User size={18} className="text-indigo-600" />
                        Account Holder's Name
                    </label>
                    {editText === "Payroll" ? (
                        <input type="text"
                            name="accountHolderName"
                            value={payrollForm?.accountHolderName || payrollInfo?.accountHolderName}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.accountHolderName || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Landmark size={18} className="text-indigo-600" />
                        Bank Name
                    </label>
                    {editText === "Payroll" ? (
                        <input type="text"
                            name="bankName"
                            value={payrollForm?.bankName || payrollInfo?.bankName}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.bankName || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Landmark size={18} className="text-indigo-600" />
                        Account Number
                    </label>
                    {editText === "Payroll" ? (
                        <input type="text"
                            name="accountNumber"
                            value={payrollForm?.accountNumber || payrollInfo?.accountNumber}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.accountNumber || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Landmark size={18} className="text-indigo-600" />
                        Branch Name
                    </label>
                    {editText === "Payroll" ? (
                        <input type="text"
                            name="branchName"
                            value={payrollForm?.branchName || payrollInfo?.branchName}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.branchName || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <LocationEdit size={18} className="text-indigo-600" />
                        City
                    </label>
                    {editText === "Payroll" ? (
                        <input type="text"
                            name="city"
                            value={payrollForm?.city || payrollInfo?.city}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.city || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Landmark size={18} className="text-indigo-600" />
                        IFSC Code
                    </label>
                    {editText === "Payroll" ? (
                        <input type="text"
                            name="ifscCode"
                            value={payrollForm?.ifscCode || payrollInfo?.ifscCode}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.ifscCode || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <Landmark size={18} className="text-indigo-600" />
                        Account Type
                    </label>
                    {editText === "Payroll" ? (
                        <select className="input"
                            name="accountType"
                            defaultValue={""}
                            value={payrollForm?.accountType || payrollInfo?.accountType}
                            onChange={handleChangePayroll}
                        >
                            <option value="" disabled>Select</option>
                            <option value="SAVINGS">SAVINGS</option>
                            <option value="CURRENT">CURRENT</option>
                            <option value="SALARY">SALARY</option>
                        </select>
                    ) : (
                        <p className="value">{payrollInfo?.accountType || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <IdCard size={18} className="text-indigo-600" />
                        PF Number
                    </label>
                    {editText === "Payroll" ? (
                        <input type="text"
                            name="pfNumber"
                            value={payrollForm?.pfNumber || payrollInfo?.pfNumber}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.pfNumber || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <IdCard size={18} className="text-indigo-600" />
                        Pan Number
                    </label>
                    {editText === "Payroll" ? (
                        <input type="text"
                            name="panNumber"
                            value={payrollForm?.panNumber || payrollInfo?.panNumber}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.panNumber || "-"}</p>
                    )}
                </div>

                <div className={`flex justify-end gap-3 items-end transition-all duration-300
                                ${editText === "Payroll"
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}>
                    <button onClick={() => setEditText("")}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
                        Cancel
                    </button>

                    <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" onClick={addPayroll}>
                        Save
                    </button>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    <ReceiptIndianRupee size={18} className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 h-8 w-8 p-1.5 rounded-full" />
                    Salary Structure
                </h2>
                {user?.role == "Admin" &&
                    <button className="p-2 rounded-full hover:bg-gray-100 transition" onClick={() => setEditText("Salary")}>
                        <Pencil size={18} />
                    </button>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm p-2">
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <IndianRupee size={18} className="text-indigo-600" />
                        CTC
                    </label>
                    {editText === "Salary" ? (
                        <input type="number"
                            name="ctc"
                            value={payrollForm?.ctc || payrollInfo?.ctc}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.ctc || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <IndianRupee size={18} className="text-indigo-600" />
                        Basic pay
                    </label>
                    {editText === "Salary" ? (
                        <input type="number"
                            name="basicPay"
                            value={payrollForm?.basicPay || payrollInfo?.basicPay}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.basicPay || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <IndianRupee size={18} className="text-indigo-600" />
                        HRA
                    </label>
                    {editText === "Salary" ? (
                        <input type="number"
                            name="HRA"
                            value={payrollForm?.HRA || payrollInfo?.HRA}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.HRA || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <IndianRupee size={18} className="text-indigo-600" />
                        Bonus
                    </label>
                    {editText === "Salary" ? (
                        <input type="number"
                            name="bonus"
                            value={payrollForm?.bonus || payrollInfo?.bonus}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.bonus || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <IndianRupee size={18} className="text-indigo-600" />
                        Special Allowance
                    </label>
                    {editText === "Salary" ? (
                        <input type="number"
                            name="specialAllowance"
                            value={payrollForm?.specialAllowance || payrollInfo?.specialAllowance}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.specialAllowance || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <IndianRupee size={18} className="text-indigo-600" />
                        TA / DA
                    </label>
                    {editText === "Salary" ? (
                        <input type="number"
                            name="ta"
                            value={payrollForm?.ta || payrollInfo?.ta}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.ta || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <IndianRupee size={18} className="text-indigo-600" />
                        Medical Allowance
                    </label>
                    {editText === "Salary" ? (
                        <input type="number"
                            name="medicalAllowance"
                            value={payrollForm?.medicalAllowance || payrollInfo?.medicalAllowance}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.medicalAllowance || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <IndianRupee size={18} className="text-indigo-600" />
                        Variable
                    </label>
                    {editText === "Salary" ? (
                        <input type="number"
                            name="variable"
                            value={payrollForm?.variable || payrollInfo?.variable}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.variable || "-"}</p>
                    )}
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-500 flex items-center gap-1">
                        <IndianRupee size={18} className="text-indigo-600" />
                        EPF
                    </label>
                    {editText === "Salary" ? (
                        <input type="number"
                            name="EPF"
                            value={payrollForm?.EPF || payrollInfo?.EPF}
                            onChange={handleChangePayroll}
                            className='input'
                        />
                    ) : (
                        <p className="value">{payrollInfo?.EPF || "-"}</p>
                    )}
                </div>

                <div className={`flex justify-end gap-3 items-end transition-all duration-300
                                ${editText === "Salary"
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}>
                    <button onClick={() => setEditText("")}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100">
                        Cancel
                    </button>

                    <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" onClick={addPayroll}>
                        Save
                    </button>
                </div>
            </div>
        </div>
    </>)
}
