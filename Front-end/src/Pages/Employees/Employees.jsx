import { Eye, Search, X, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { BaseUrl } from "../../BaseApi/Api";

export default function Employees() {
 const [allUsers,setAllUsers]=useState([])
  
  useEffect(() => {
    async function fetchMyProfile() {
      try {
        // const token = localStorage.getItem("token");
        const res = await fetch(BaseUrl + "users" , {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setAllUsers(data);
      } catch (error) {
        console.error("Fetch profile error:", error);
        throw error;
      }
    };
    fetchMyProfile()
  }, [])

  const [open, setOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const handleOpen = (emp) => {
    setSelectedEmp(emp);
    setOpen(true);
  };

  return (
    <div className="w-full px-3">
      <div className="bg-white shadow-md rounded-xl hover:shadow-lg transition p-5">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Employees</h2>
          <div className="relative w-full sm:w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-indigo-600 text-white text-left">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {allUsers.map((emp, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{emp?.username}</td>
                  <td className="px-4 py-3">{emp?.role}</td>
                  <td className="px-4 py-3">{emp?.email}</td>
                  <td className="px-4 py-3">{emp?.contact}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleOpen(emp)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-full 
                      bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {open && selectedEmp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative z-50 w-full max-w-md bg-white rounded-xl shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center px-5 py-4 border-b">
              <h2 className="text-lg font-semibold">Employee Details</h2>
              <button onClick={() => setOpen(false)}>
                <X className="text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <User size={16} /> <span className="font-medium">Name:</span> {selectedEmp.username}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} /> <span className="font-medium">Email:</span> {selectedEmp.email}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} /> <span className="font-medium">Contact:</span> {selectedEmp.contact}
              </p>
              <p className="flex items-center gap-2">
                <span className="font-medium">Role:</span> {selectedEmp.role}
              </p>
            </div>

            <div className="flex justify-end px-5 py-4 border-t">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Close
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
  );
}
