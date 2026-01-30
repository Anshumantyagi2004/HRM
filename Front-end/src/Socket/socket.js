import { io } from "socket.io-client";
import { BaseUrl } from "../BaseApi/Api";

// const SOCKET_URL = "http://localhost:5000"; // backend url
const SOCKET_URL = BaseUrl

export const socket = io(SOCKET_URL, {
    autoConnect: false,
});

