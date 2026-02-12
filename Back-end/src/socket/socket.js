const userSocketMap = {}; 

export const initSocket = (io) => {
    io.on("connection", (socket) => {

        socket.on("register", (userId) => {
            userSocketMap[userId] = socket.id;
        });

        socket.on("disconnect", () => {
            for (const userId in userSocketMap) {
                if (userSocketMap[userId] === socket.id) {
                    delete userSocketMap[userId];
                }
            }
        });
    });
};

export const getUserSocketId = (userId) => userSocketMap[userId];
