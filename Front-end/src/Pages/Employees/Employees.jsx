import { Eye, Search, Mail, Phone, User, Handbag, Calendar, Transgender, MapPinHouse } from "lucide-react";
import { useEffect, useState } from "react";
import { BaseUrl } from "../../BaseApi/Api";
import Modal from "../../Components/Modal/Modal";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

export default function Employees() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [allUsers, setAllUsers] = useState([])

  useEffect(() => {
    async function fetchMyProfile() {
      try {
        const res = await fetch(BaseUrl + "users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        console.log(data.data);

        setAllUsers(data.data);
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
                <th className="px-4 py-3" style={{ width: "200px" }}>Emp Name</th>
                <th className="px-4 py-3">Emp Id</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Designation</th>
                <th className="px-4 py-3">Emp Manager</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Offical Mail</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {allUsers?.map((emp, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center justify-start">
                      {emp?.profileImage ?
                        <img src={emp?.profileImage} alt={emp?.username.slice(0, 1).toUpperCase()} className="w-8 h-8 rounded-full mr-2" />
                        : <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center mr-2">
                          {emp?.username.slice(0, 1).toUpperCase()}
                        </div>}
                      {emp?.username}
                    </div>
                  </td>
                  <td className="px-4 py-3">{emp?.userWork?.empId || "-"}</td>
                  <td className="px-4 py-3">{emp?.userWork?.department || "-"}</td>
                  <td className="px-4 py-3">{emp?.userWork?.designation || "-"}</td>
                  <td className="px-4 py-3">{emp?.userWork?.manager?.username || "-"}</td>
                  <td className="px-4 py-3">{emp?.email}</td>
                  <td className="px-4 py-3">{emp?.officialEmail || "-"}</td>
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

      <Modal open={open} onClose={() => setOpen(false)}>
        <Modal.Header title="Employee Details" />
        <Modal.Body>
          {selectedEmp && <>
            <div className="flex justify-center mb-4">
              {selectedEmp?.profileImage ?
                <img src={selectedEmp?.profileImage} alt={"Image"} className="w-24 h-24 rounded-full" />
                : <div className="w-24 h-24 rounded-full bg-indigo-500 text-white flex items-center justify-center text-4xl">
                  {selectedEmp?.username.slice(0, 1).toUpperCase()}
                </div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 text-sm">
              <div className="flex items-start gap-3">
                <User size={18} className="text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">
                    {selectedEmp?.username || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={18} className="text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-800">
                    {selectedEmp?.dob ? <>
                      {new Date(selectedEmp?.dob)?.toISOString()?.split("T")[0]}</> : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-gray-500">Personal Email</p>
                  <p className="font-medium text-gray-800 break-all">
                    {selectedEmp?.email || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-gray-500">Company Email</p>
                  <p className="font-medium text-gray-800 break-all">
                    {selectedEmp?.officialEmail || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-gray-500">Contact Number</p>
                  <p className="font-medium text-gray-800">
                    {selectedEmp?.contact || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={18} className="text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-gray-500">Alternate Contact</p>
                  <p className="font-medium text-gray-800">
                    {selectedEmp?.altContact || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Handbag size={18} className="text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-gray-500">Designation</p>
                  <p className="font-medium text-gray-800">
                    {selectedEmp?.userWork[0]?.designation || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Transgender size={18} className="text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-gray-500">Gender</p>
                  <p className="font-medium text-gray-800">
                    {selectedEmp?.gender || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPinHouse size={18} className="text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-gray-500">Current Address</p>
                  <p className="font-medium text-gray-800">
                    {selectedEmp?.address || "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPinHouse size={18} className="text-indigo-500 mt-0.5" />
                <div>
                  <p className="text-gray-500">Permanent Address</p>
                  <p className="font-medium text-gray-800">
                    {selectedEmp?.permanentAddress || "-"}
                  </p>
                </div>
              </div>
            </div>
          </>}
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full gap-2">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Close
            </button>
            {user?.role === "Admin" &&
              <Link to={`/userProfile/${selectedEmp?._id}`}>
                <button className="px-4 py-2 border rounded-lg text-white hover:bg-indigo-700 bg-indigo-600">
                  View Profile
                </button>
              </Link>}
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
