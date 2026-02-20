import { Mail, Phone, Camera, Pencil, Facebook, Linkedin, Instagram, X, Trash, University, GraduationCap, Award, NotebookPen, CalendarDays, School, Trash2, BookOpen, Building2, Eye, BadgePercent, Edit, User, Contact, ALargeSmall, Calendar1, VenusAndMars, Droplet, HeartHandshake, LocationEdit, MapPinHouse, BriefcaseBusiness, IdCardLanyard, MonitorCog, Briefcase, CalendarClock, Computer, ClipboardCheck, Clock1, CalendarCheck, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { BaseUrl } from "../../BaseApi/Api";
import "./Profile.css"
import Modal from "../../Components/Modal/Modal";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../Redux/authSlice";
import { useParams } from "react-router-dom"
import PersonalInfo from "./PersonalInfo";
import Education from "./Education";
import Documents from "./Documents";
import Work from "./Work";
import Rules from "./Rules";
import Payroll from "./Payroll";

export default function MyProfile() {
    const { userId } = useParams();
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [UserId, setUserId] = useState(userId)
    const [userData, setUserData] = useState();
    const [text, setText] = useState("PersonalInfo");
    const [editText, setEditText] = useState("");
    const [loading, setLoading] = useState(false);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        const formData = new FormData();
        formData.append("image", file);

        try {
            setLoading(true);
            const res = await fetch(`${BaseUrl}api/upload-profile-ByAdmin/${userId}`,
                { method: "POST", body: formData, credentials: "include" }
            );
            const data = await res.json();

            if (res.ok) {
                toast.success("Image uploaded successfully");
            } else {
                toast.error(data.message || "Upload failed");
            }

            setUserData((prev) => ({
                ...prev,
                profileImage: data.imageUrl,
            }));

        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Image upload failed");
        } finally {
            setLoading(false);
        }
    };

    const [formData, setFormData] = useState({
        username: "",
        dob: "",
        gender: "",
        bloodGroup: "",
        maritalStatus: "",
        email: "",
        officialEmail: "",
        contact: "",
        altContact: "",
        address: "",
        permanentAddress: "",
    });

    useEffect(() => {
        if (userData) {
            setPreview(userData?.profileImage || "")
            setFormData({
                username: userData.username || "",
                dob: userData.dob ? userData.dob.split("T")[0] : "",
                gender: userData.gender || "",
                bloodGroup: userData.bloodGroup || "",
                maritalStatus: userData.maritalStatus || "",
                email: userData.email || "",
                officialEmail: userData.officialEmail || "",
                contact: userData.contact || "",
                altContact: userData.altContact || "",
                address: userData.address || "",
                permanentAddress: userData.permanentAddress || "",
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        // console.log(userId);

        async function fetchMyProfile() {
            try {
                const res = await fetch(BaseUrl + "userById/" + userId,);
                const data = await res.json();
                setUserData(data);
            } catch (error) {
                console.error("Fetch profile error:", error);
                throw error;
            }
        };
        fetchMyProfile()
    }, [UserId])

    const handleSavePersonal = async () => {
        try {
            const res = await fetch(`${BaseUrl}user/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data?.message)
            }
            toast.success(data?.message)
            setUserData(data.user);   // update view
            setEditText("");
        } catch (err) {
            console.error(err);
        }
    };

    //Documents
    const [allDocs, setAllDocs] = useState([]);
    const [preview, setPreview] = useState("");
    const [documentModal, setDocumentModal] = useState(false);
    const [documentType, setDocumentType] = useState("");
    const [file, setFile] = useState(null);
    const [previewDoc, setPreviewDoc] = useState(null);
    const handleDocuments = () => {
        setDocumentModal(true)
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        // Preview for images only
        if (selectedFile.type.startsWith("image/")) {
            setPreviewDoc(URL.createObjectURL(selectedFile));
        } else {
            setPreviewDoc(null);
        }
    };

    const uploadDocument = async () => {
        if (!file || !documentType) {
            toast.error("Select document type and file");
            return;
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("documentType", documentType);
        try {
            const res = await fetch(`${BaseUrl}api/upload-document-ByAdmin/${userId}`, { method: "POST", body: formData, credentials: "include" });
            const data = await res.json();
            if (!res.ok) return toast.error(data.message || "Error uploading document");
            setDocumentModal(false)
            setDocumentType("")
            setFile(null);
            setPreviewDoc(null);
            fetchDocs()
            toast.success("Document uploaded successfully");
        } catch (err) {
            console.error(err);
            toast.error("Upload failed");
        }
    };

    const fetchDocs = async () => {
        try {
            const response = await fetch(`${BaseUrl}api/get-document-ByAdmin/${userId}`, { credentials: "include" });
            if (!response.ok) {
                toast.error("No Docs Available");
            } else {
                const data = await response.json();
                console.log(data);
                setAllDocs(data?.data)
            }
        } catch (error) {
            toast.error("Add Education Error:", error.message);
        }
    };

    //Education
    const [eduEdit, setEduEdit] = useState(false);
    const [qualificationModal, setQualificationModal] = useState(false);
    const [userQualification, setUserQualification] = useState([]);
    const [formDataEdu, setFormDataEdu] = useState({
        qualificationType: "",
        courseName: "",
        courseType: "",
        stream: "",
        courseStartDate: "",
        courseEndDate: "",
        collegeName: "",
        universityName: "",
    });

    const handleChangeEdu = (e) => {
        const { name, value } = e.target;
        setFormDataEdu(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const addEducation = async () => {
        if (formDataEdu?.qualificationType == "" || formDataEdu?.courseName == "" || formDataEdu?.courseType == "" || formDataEdu?.stream == "" || formDataEdu?.courseStartDate == "" || formDataEdu?.courseEndDate == "" || formDataEdu?.collegeName == "" || formDataEdu?.universityName == "") return toast.error('Enter all feild!');
        try {
            const response = await fetch(`${BaseUrl}userEducationAdd/${userId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify(formDataEdu),
                }
            );
            if (!response.ok) {
                toast.error(data.message || "Failed to add education");
            } else {
                const data = await response.json();
                toast.success("Added Successfully")
                console.log(data);
                setFormDataEdu();
                setQualificationModal(false)
                fetchEducation()
            }
        } catch (error) {
            toast.error("Add Education Error:", error.message);
        }
    };

    const fetchEducation = async () => {
        try {
            const response = await fetch(`${BaseUrl}userEducationGet/${userId}`);
            if (!response.ok) {
                toast.error("Failed");
            } else {
                const data = await response.json();
                setUserQualification(data?.data)
            }
        } catch (error) {
            toast.error("Add Education Error:", error.message);
        }
    };

    const deleteEducation = async (e) => {
        console.log(e);
        // try {
        //     const response = await fetch(`${BaseUrl}userEducation/${UserId}`,
        //         {
        //             method: "POST",
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 // Authorization: `Bearer ${token}`, // if using auth
        //             },
        //             body: JSON.stringify(formDataEdu),
        //         }
        //     );
        //     if (!response.ok) {
        //         toast.error(data.message || "Failed to add education");
        //     } else {
        //         const data = await response.json();
        //         toast.success("Added Successfully")
        //         console.log(data);
        //         setFormDataEdu();
        //         setQualificationModal(false)
        //         setUserQualification(user?.education)
        //     }
        // } catch (error) {
        //     toast.error("Add Education Error:", error.message);
        // }
    };

    //WORK
    const [workEdit, setWorkEdit] = useState(false);
    const [workModal, setWorkModal] = useState(false);
    const [workInfoForm, setWorkInfoForm] = useState({
        empId: "",
        joiningDate: "",
        empType: "",
        workLocation: "",
        designation: "",
        department: "",
        subDepartment: "",
        managerId: "",
        workExperince: "",
    });
    const [workInfo, setWorkInfo] = useState();
    const [workHistoryForm, setWorkHistoryForm] = useState({
        department: "",
        designation: "",
        from: "",
        to: "",
        orgName: "",
        orgLocation: "",
    });

    const handleChangeWork = (e) => {
        const { name, value } = e.target;
        setWorkHistoryForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleChangeWorkInfo = (e) => {
        const { name, value } = e.target;
        setWorkInfoForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const addWork = async () => {
        try {
            const response = await fetch(`${BaseUrl}userWorkByAdmin/${userId}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify(workInfoForm),
                }
            );
            if (!response.ok) {
                toast.error(data.message || "Failed to add Work");
            } else {
                const data = await response.json();
                toast.success("Added Successfully")
                console.log(data);
                setEditText("")
                fetchWork()
            }
        } catch (error) {
            toast.error("Add Education Error:", error.message);
        }
    };

    const fetchWork = async () => {
        try {
            const response = await fetch(`${BaseUrl}userWorkByAdmin/${userId}`);
            if (!response.ok) {
                toast.error("Failed");
            } else {
                const data = await response.json();
                console.log(data);

                setWorkInfo(data?.data[0])
            }
        } catch (error) {
            toast.error("Add Education Error:", error.message);
        }
    };

    const addWorkHistory = async () => {
        try {
            const response = await fetch(`${BaseUrl}userWorkHistoryByAdmin/${userId}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", },
                    body: JSON.stringify(workHistoryForm),
                }
            );
            if (!response.ok) {
                toast.error(data.message || "Failed to add Work");
            } else {
                const data = await response.json();
                toast.success("Added Successfully")
                console.log(data);
                setEditText("")
                setWorkModal(false)
                setWorkHistoryForm()
                fetchWork()
            }
        } catch (error) {
            toast.error("Add Education Error:", error.message);
        }
    };

    //RULES
    const [rulesForm, setRulesForm] = useState({
        shiftStartTime: "",
        shiftOutTime: "",
        inTimeGrace: "",
        outTimeGrace: "",
        fullDay: "",
        halfDay: "",
        casualLeave: "",
        sickLeave: "",
        lossOfPay: "",
        compOff: "",
    });

    const [rulesInfo, setRulesInfo] = useState();

    const handleChangeRules = (e) => {
        const { name, value } = e.target;
        setRulesForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const addRules = async () => {
        try {
            const payload = Object.fromEntries(
                Object.entries(rulesForm).filter(
                    ([_, value]) => value !== "" && value !== null && value !== undefined
                )
            );
            if (Object.keys(payload).length === 0) {
                toast.error("No fields to update");
                return;
            }

            const response = await fetch(`${BaseUrl}userRules/${userId}`, {
                credentials: "include",
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.message || "Failed to save info");
            } else {
                toast.success("Saved Successfully");
                setEditText("");
                fetchRules();
            }

        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const fetchRules = async () => {
        try {
            const response = await fetch(`${BaseUrl}userRules/${userId}`, { credentials: "include", });
            if (!response.ok) {
                console.info("No data");
            } else {
                const data = await response.json();
                // console.log(data);
                setRulesInfo(data)
            }
        } catch (error) {
            toast.error("Add Education Error:", error.message);
            console.log(error);

        }
    };

    //payroll
    const [payrollForm, setPayrollForm] = useState({
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        branchName: "",
        city: "",
        ifscCode: "",
        accountType: "",
        pfNumber: "",
        panNumber: "",
        basicPay: "",
        HRA: "",
        bonus: "",
        specialAllowance: "",
        ta: "",
        medicalAllowance: "",
        variable: "",
        EPF: "",
        ctc: "",
    });

    const [payrollInfo, setPayrollInfo] = useState();

    const handleChangePayroll = (e) => {
        const { name, value } = e.target;
        setPayrollForm(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const addPayroll = async () => {
        try {
            const payload = Object.fromEntries(
                Object.entries(payrollForm).filter(
                    ([_, value]) => value !== "" && value !== null && value !== undefined
                )
            );

            if (Object.keys(payload).length === 0) {
                toast.error("No fields to update");
                return;
            }

            const response = await fetch(`${BaseUrl}userPayroll/${UserId}`, {
                credentials: "include",
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to save payroll info");
            } else {
                toast.success("Payroll details saved successfully");
                setEditText("");
                fetchPayroll();
            }

        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    const fetchPayroll = async () => {
        try {
            const response = await fetch(`${BaseUrl}userPayroll/${UserId}`, {
                credentials: "include",
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();

            if (!response.ok) {
                console.info(data.message || "no info");
            } else {
                setPayrollInfo(data.payroll);
            }

        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="w-full px-3 py-4">
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-3 space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-6">
                        <div className="relative w-28 h-28 mx-auto mb-3">
                            <img
                                src={preview}
                                alt="Add Profile"
                                className="w-full h-full rounded-full object-cover border"
                            />

                            <label className="absolute bottom-1 right-1 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-700 z-10 transition">
                                <Camera size={16} className="text-white" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>

                            {loading && (
                                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-full text-sm">
                                    Uploading...
                                </div>
                            )}
                        </div>

                        <h2 className="text-lg font-semibold text-gray-800 text-center">{userData?.username || "User Name"}</h2>
                        {/* <p className="text-sm text-gray-500 mt-1 text-center">{userData?.designation || "Job Designation"}</p> */}
                        <p className="text-sm text-gray-500 text-center">{userData?.email || "Email.com"}</p>
                    </div>
                </div>

                <div className="col-span-12 md:col-span-6 space-y-2">
                    <div className="flex items-center gap-2">
                        <button onClick={() => setText("PersonalInfo")} className="bg-indigo-600 text-white hover:bg-indigo-700 px-2 py-1 rounded-md">Personal</button>
                        <button onClick={() => { setText("Education"); fetchEducation() }} className="bg-indigo-600 text-white hover:bg-indigo-700 px-2 py-1 rounded-md">Education</button>
                        <button onClick={() => { setText("Work"); fetchWork() }} className="bg-indigo-600 text-white hover:bg-indigo-700 px-2 py-1 rounded-md">Work</button>
                        <button onClick={() => { setText("Documents"); fetchDocs() }} className="bg-indigo-600 text-white hover:bg-indigo-700 px-2 py-1 rounded-md">Documents</button>
                        <button onClick={() => { setText("Rules"); fetchRules() }} className="bg-indigo-600 text-white hover:bg-indigo-700 px-2 py-1 rounded-md">Rules</button>
                        <button onClick={() => { setText("Payroll"); fetchPayroll() }} className="bg-indigo-600 text-white hover:bg-indigo-700 px-2 py-1 rounded-md">Payroll</button>
                    </div>

                    {text == "PersonalInfo" &&
                        <PersonalInfo
                            handleSavePersonal={handleSavePersonal}
                            editText={editText}
                            setEditText={setEditText}
                            userData={userData}
                            handleChange={handleChange}
                            formData={formData}
                        />}

                    {text == "Education" &&
                        <Education
                            userQualification={userQualification}
                            setQualificationModal={setQualificationModal}
                            setFormDataEdu={setFormDataEdu}
                            setEduEdit={setEduEdit}
                            deleteEducation={deleteEducation}
                        />}

                    {text == "Documents" &&
                        <Documents
                            handleDocuments={handleDocuments}
                            allDocs={allDocs}
                            handleFileChange={handleFileChange}
                            uploadDocument={uploadDocument}
                        />}

                    {text == "Work" &&
                        <Work
                            editText={editText}
                            setEditText={setEditText}
                            workInfo={workInfo}
                            addWork={addWork}
                            handleChangeWorkInfo={handleChangeWorkInfo}
                            workInfoForm={workInfoForm}
                            setWorkModal={setWorkModal}
                            setWorkHistoryForm={setWorkHistoryForm}
                            setWorkEdit={setWorkEdit}
                        />}

                    {text == "Rules" &&
                        <Rules
                            user={user}
                            editText={editText}
                            setEditText={setEditText}
                            rulesForm={rulesForm}
                            setRulesForm={setRulesForm}
                            handleChangeRules={handleChangeRules}
                            rulesInfo={rulesInfo}
                            addRules={addRules}
                        />}

                    {text == "Payroll" &&
                        <Payroll
                            user={user}
                            editText={editText}
                            setEditText={setEditText}
                            payrollForm={payrollForm}
                            payrollInfo={payrollInfo}
                            handleChangePayroll={handleChangePayroll}
                            addPayroll={addPayroll}
                        />}
                </div>

                <div className="col-span-12 md:col-span-3 space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Id Card
                            </h2>
                            <button className="p-2 rounded-full text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition">
                                <Download size={18} />
                            </button>
                        </div>

                        <div className="flex justify-center">
                            <div className="w-full max-w-sm bg-white rounded-2xl border shadow-lg p-6 flex flex-col items-center text-center">
                                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500 shadow-md">
                                    <img
                                        src={userData?.profileImage}
                                        alt="profile"
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <h2 className="mt-4 text-xl font-semibold text-gray-800">
                                    {userData?.username}
                                </h2>

                                <p className="text-sm text-blue-600 font-medium">
                                    Software Engineer
                                </p>

                                <p className="text-sm text-gray-600">
                                    Web Solution
                                </p>

                                <p className="mt-2 text-xs text-gray-500 text-center">
                                    {userData?.address}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Social Media
                            </h2>
                            <button className="p-2 rounded-full hover:bg-gray-100 transition">
                                <Pencil size={18} />
                            </button>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                                <Facebook size={18} />
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
                                <Linkedin size={18} />
                            </div>
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-50 text-pink-600 hover:bg-pink-100 transition">
                                <Instagram size={18} />
                            </div>
                        </div>
                    </div>
                </div>

                <Modal open={documentModal} onClose={() => setDocumentModal(false)}>
                    <Modal.Header title="Add Documents Here" />
                    <Modal.Body>
                        <div className="bg-white w-full max-w-md">
                            <select
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                className="input w-full mb-3"
                            >
                                <option value="">Select Document Type</option>
                                <option value="aadhaar">Aadhaar</option>
                                <option value="marksheet_10">Marksheet 10</option>
                                <option value="marksheet_12">Marksheet 12</option>
                                <option value="degree">Degree</option>
                                <option value="certificate">Certificate</option>
                            </select>

                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-600
                                file:mr-3 file:py-2 file:px-4
                                file:rounded-lg file:border-0
                                file:text-sm file:font-medium
                               file:bg-indigo-600 file:text-white
                                hover:file:bg-indigo-700 cursor-pointer"
                            />

                            {file && (
                                <div className="mt-4 border rounded-lg p-3">
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Selected:</span> {file.name}
                                    </p>

                                    {previewDoc ? (
                                        <img
                                            src={previewDoc}
                                            alt="Preview"
                                            className="w-full h-40 object-contain rounded"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-500">PDF preview not available</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex justify-end gap-2 w-full">
                            <button
                                onClick={() => setDocumentModal(false)}
                                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                Close
                            </button>

                            <button
                                onClick={() => uploadDocument()}
                                className="px-4 py-2 border rounded-lg text-white hover:bg-indigo-700 bg-indigo-600"
                            >
                                Add
                            </button>

                        </div>
                    </Modal.Footer>
                </Modal>

                <Modal open={qualificationModal} onClose={() => setQualificationModal(false)}>
                    <Modal.Header title="Add Qualification Here" />
                    <Modal.Body>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="bg-white w-full max-w-md">
                                <select
                                    value={formDataEdu?.qualificationType}
                                    name="qualificationType"
                                    onChange={handleChangeEdu}
                                    className="input w-full"
                                    defaultValue={""}
                                >
                                    <option value="" disabled>Select Qualification Type</option>
                                    <option value="Graduation">Graduation</option>
                                    <option value="Post Graduation">Post Graduation</option>
                                    <option value="Diploma">Diploma</option>
                                    <option value="Certificate">Certificate</option>
                                    <option value="Professional Course">Professional Course</option>
                                    <option value="Doctorate">Doctorate (PhD)</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="bg-white w-full max-w-md">
                                <input
                                    type="text"
                                    name="courseName"
                                    value={formDataEdu?.courseName}
                                    onChange={handleChangeEdu}
                                    placeholder="Course Name"
                                    className="input w-full"
                                />
                            </div>

                            <div className="bg-white w-full max-w-md">
                                <select
                                    value={formDataEdu?.courseType}
                                    name="courseType"
                                    onChange={handleChangeEdu}
                                    className="input w-full"
                                    defaultValue={""}
                                >
                                    <option value="" disabled>Select Course Type</option>
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Correspondence">Correspondence / Distance</option>
                                </select>
                            </div>

                            <div className="bg-white w-full max-w-md">
                                <input
                                    type="text"
                                    name="stream"
                                    value={formDataEdu?.stream}
                                    onChange={handleChangeEdu}
                                    placeholder="Stream / Specialization"
                                    className="input w-full"
                                />
                            </div>

                            <div className="bg-white w-full max-w-md">
                                <input
                                    type="date"
                                    name="courseStartDate"
                                    value={formDataEdu?.courseStartDate}
                                    onChange={handleChangeEdu}
                                    className="input w-full"
                                />
                            </div>

                            <div className="bg-white w-full max-w-md">
                                <input
                                    type="date"
                                    name="courseEndDate"
                                    value={formDataEdu?.courseEndDate}
                                    onChange={handleChangeEdu}
                                    className="input w-full"
                                />
                            </div>

                            <div className="bg-white w-full max-w-md">
                                <input
                                    type="text"
                                    name="collegeName"
                                    value={formDataEdu?.collegeName}
                                    onChange={handleChangeEdu}
                                    placeholder="College Name"
                                    className="input w-full"
                                />
                            </div>

                            <div className="bg-white w-full max-w-md">
                                <input
                                    type="text"
                                    name="universityName"
                                    value={formDataEdu?.universityName}
                                    onChange={handleChangeEdu}
                                    placeholder="University Name"
                                    className="input w-full"
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex justify-end gap-2 w-full">
                            <button
                                onClick={() => { setQualificationModal(false); setFormDataEdu(); setEduEdit(false) }}
                                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                Close
                            </button>
                            {eduEdit ?
                                <button
                                    // onClick={() => addEducation()}
                                    className="px-4 py-2 border rounded-lg text-white hover:bg-indigo-700 bg-indigo-600"
                                >
                                    Edit
                                </button>
                                : <button
                                    onClick={() => addEducation()}
                                    className="px-4 py-2 border rounded-lg text-white hover:bg-indigo-700 bg-indigo-600"
                                >
                                    Add
                                </button>}
                        </div>
                    </Modal.Footer>
                </Modal>

                <Modal open={workModal} onClose={() => setWorkModal(false)}>
                    <Modal.Header title="Add Work History Here" />
                    <Modal.Body>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="bg-white w-full max-w-md">
                                <select
                                    value={workHistoryForm?.department}
                                    name="department"
                                    onChange={handleChangeWork}
                                    className="input w-full"
                                    defaultValue={""}
                                >
                                    <option value="" disabled>Select Department</option>
                                    <option value="Web Solutions">Web Solutions</option>
                                    <option value="SEO">SEO</option>
                                    <option value="Ads Manger">Ads Manger</option>
                                    <option value="Social Media">Social Media</option>
                                    <option value="Marketing">Marketing</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="bg-white w-full max-w-md">
                                <input
                                    type="text"
                                    name="designation"
                                    value={workHistoryForm?.designation}
                                    onChange={handleChangeWork}
                                    placeholder="Your Designation"
                                    className="input w-full"
                                />
                            </div>

                            <div className="bg-white w-full max-w-md">
                                <input
                                    type="date"
                                    name="from"
                                    value={workHistoryForm?.from}
                                    onChange={handleChangeWork}
                                    className="input w-full"
                                />
                            </div>

                            <div className="bg-white w-full max-w-md">
                                <input
                                    type="date"
                                    name="to"
                                    value={workHistoryForm?.to}
                                    onChange={handleChangeWork}
                                    className="input w-full"
                                />
                            </div>

                            <div className="bg-white w-full max-w-md">
                                <input
                                    type="text"
                                    name="orgName"
                                    value={workHistoryForm?.orgName}
                                    onChange={handleChangeWork}
                                    placeholder="Org Name"
                                    className="input w-full"
                                />
                            </div>

                            <div className="bg-white w-full max-w-md">
                                <input
                                    type="text"
                                    name="orgLocation"
                                    value={workHistoryForm?.orgLocation}
                                    onChange={handleChangeWork}
                                    placeholder="Org Location"
                                    className="input w-full"
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="flex justify-end gap-2 w-full">
                            <button
                                onClick={() => { setWorkModal(false); setWorkHistoryForm(); setWorkEdit(false) }}
                                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                            >
                                Close
                            </button>
                            {workEdit ?
                                <button
                                    // onClick={() => addEducation()}
                                    className="px-4 py-2 border rounded-lg text-white hover:bg-indigo-700 bg-indigo-600"
                                >
                                    Edit
                                </button>
                                : <button
                                    onClick={() => addWorkHistory()}
                                    className="px-4 py-2 border rounded-lg text-white hover:bg-indigo-700 bg-indigo-600"
                                >
                                    Add
                                </button>}
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        </div >
    );
}
