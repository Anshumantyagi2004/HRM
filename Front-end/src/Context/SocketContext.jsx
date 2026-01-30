import { createContext, useContext, useEffect } from "react";
import { socket } from "../Socket/socket";

const SocketContext = createContext(null);

export const SocketProvider = ({ userId, children }) => {
    useEffect(() => {
        if (!userId) return;

        socket.connect();

        socket.on("connect", () => {
            socket.emit("register", userId);
            // console.log("Socket registered:", userId);
        });

        return () => {
            socket.off("connect");
            socket.disconnect();
        };
    }, [userId]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};


export const useSocket = () => useContext(SocketContext);
