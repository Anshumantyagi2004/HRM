import { Clock9 } from "lucide-react";
import "./Header.css";

export default function SignToggle({ onToggle, isClockedIn, loading }) {
    return (
        <button
            className={`toggle-btn ${isClockedIn ? "out" : "in"} flex items-center justify-center gap-1`}
            onClick={onToggle}
            disabled={loading}
        >
            <Clock9 size={20} />
            {loading
                ? "Please wait..."
                : isClockedIn
                    ? "Clock Out"
                    : "Clock In"}
        </button>
    );
}
