import { X } from "lucide-react";
import React, { useState } from "react";

export default function Leave() {
    const [open, setOpen] = useState(false);

    return (
        <div className="w-full px-3">
            <div className="bg-white shadow-md rounded-xl hover:shadow-lg transition p-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Apply Leave</h2>
                    <div className="">
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-2 rounded-md"
                            onClick={() => setOpen(true)}>
                            Apply For Leave
                        </button>
                    </div>
                </div>
                <div >

                </div>

                {/* ================= MODAL ================= */}
                {open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
                        <div className="relative z-50 w-full max-w-md bg-white rounded-xl shadow-2xl animate-scaleIn">
                            <div className="flex justify-between items-center px-5 py-4 border-b">
                                <h2 className="text-lg font-semibold">Apply for Leave</h2>
                                <button onClick={() => setOpen(false)}>
                                    <X className="text-gray-400 hover:text-gray-600" />
                                </button>
                            </div>

                            <div className="px-5 py-4 space-y-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-700 mb-1">
                                        Reason for Leave
                                    </label>
                                    <textarea
                                        rows="3"
                                        placeholder="Enter reason..."
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end px-5 py-4 border-t gap-2">
                                <button
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Close
                                </button>
                                <button
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <style>
                    {`
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-scaleIn {
            animation: scaleIn 0.25s ease-out;
          }
        `}
                </style>
            </div>
        </div>
    );
}
