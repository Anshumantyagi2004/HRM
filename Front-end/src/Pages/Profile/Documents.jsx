import React from 'react'
import { Pencil, X, Trash2, Eye, } from "lucide-react";

export default function Documents(props) {
    const {
        allDocs,
        handleDocuments,
        handleFileChange,
        uploadDocument
    } = props

    return (<>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                    Documents
                </h2>
                <button className="p-2 rounded-full hover:bg-gray-100 transition" onClick={handleDocuments}>
                    <Pencil size={18} />
                </button>
            </div>

            <div className="mt-4 space-y-3">
                {allDocs?.length > 0 ? (
                    allDocs.map((doc, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border border-gray-200 p-3 hover:bg-gray-50 transition"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                                    📄
                                </div>

                                <span className="font-medium text-gray-800">
                                    {doc.type}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                 bg-indigo-50 text-indigo-500 hover:bg-indigo-100 hover:text-indigo-600 transition"
                                >
                                    <Eye size={18} />
                                </a>
                                <button className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                                                 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 transition"
                                    title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                                <X />
                            </div>

                            <span className="font-medium text-gray-800 text-sm">
                                No documents uploaded yet.
                            </span>
                        </div>

                        <button
                            onClick={handleDocuments}
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            Add
                        </button>
                    </div>
                )}
            </div>
        </div>
    </>)
}
