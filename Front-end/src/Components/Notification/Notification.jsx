import { useEffect } from "react";
import { useSocket } from "../../Context/SocketContext";
import { useNotification } from "../../Context/Notification";
// import { useNotification } from "../../Context/NotificationContext";

const NotificationListener = () => {
    const socket = useSocket();
    const { addNotification } = useNotification();

    useEffect(() => {
        if (!socket) return;

        socket.on("leave-status", (data) => {
            addNotification({
                message: `Your leave was ${data.status}`,
                status: data.status,
                time: Date.now(),
            });
        });

        return () => socket.off("leave-status");
    }, [socket]);

    return null;
};

export default NotificationListener;
