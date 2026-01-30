import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./src/config/db.js";
import mainRoute from "./src/routes/mainRoute.js";
import { initSocket } from "./src/socket/socket.js";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

connectDB();

// 👇 create HTTP server
const server = http.createServer(app);

// 👇 attach socket.io
const io = new Server(server, {
  cors: { origin: "*" },
});

// 👇 init socket
initSocket(io);

// ✅ MUST BE BEFORE ROUTES
app.use((req, res, next) => {
  req.io = io;
  next();
});

// 👇 routes
app.use("/", mainRoute);

// 👇 listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
