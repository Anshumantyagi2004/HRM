import { Search } from "lucide-react";
import React, { useState } from "react";

export default function Attendance() {

    return (
        <div className="w-full px-3">
            <div className="bg-white shadow-md rounded-xl hover:shadow-lg transition p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Attendance log</h2>
                    <div className="relative w-full sm:w-64">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-2 rounded-md">Daily Log</button>
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-2 rounded-md">Monthly Log</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
