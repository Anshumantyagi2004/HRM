import { Clock9, Loader } from "lucide-react";
import "./Header.css";

export default function SignToggle({ onToggle, isClockedIn, loading }) {
    return (<>
        <button className={`toggle-btn ${isClockedIn ? "out" : "in"} md:hidden flex items-center justify-center gap-1`}
            onClick={onToggle} disabled={loading}>
            {!loading ? <Clock9 size={20} /> : <Loader size={20} />}
            {loading ? "Please wait..." : isClockedIn ? "Clock Out" : "Clock In"}
        </button>
        <button className={`${isClockedIn ? "hover:bg-red-100 text-red-600" : "hover:bg-green-100 text-green-600"} p-2 rounded-full transition md:flex hidden`}
            onClick={onToggle} disabled={loading}>
            {!loading ? <Clock9 size={22} /> : <Loader size={22} />}
        </button>
    </>);
}
