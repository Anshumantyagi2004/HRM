
import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <div className="w-full px-3">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-3">
                    <div className="bg-white shadow-md rounded-xl p-5 flex flex-col items-center text-center transition hover:shadow-lg">
                        <h2>Graph</h2>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-6">
                    <div className="bg-white shadow-md rounded-xl p-5 flex flex-col items-center text-center transition hover:shadow-lg">
                        <h2>Attendance Calendar</h2>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-3">
                    <div className="bg-white shadow-md rounded-xl p-5 flex flex-col items-center text-center transition hover:shadow-lg">
                        <h2>Graph</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}
