const userSocketMap = {}; // userId -> socketId

export const initSocket = (io) => {
    io.on("connection", (socket) => {
        // console.log("Socket connected:", socket.id);

        socket.on("register", (userId) => {
            userSocketMap[userId] = socket.id;
            // console.log("User registered for socket:", userId);
        });

        socket.on("disconnect", () => {
            for (const userId in userSocketMap) {
                if (userSocketMap[userId] === socket.id) {
                    delete userSocketMap[userId];
                }
            }
            // console.log("Socket disconnected:", socket.id);
        });
    });
};

export const getUserSocketId = (userId) => userSocketMap[userId];
