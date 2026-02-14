import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import mainRoute from "./src/routes/mainRoute.js";
import { initSocket } from "./src/socket/socket.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// const CLIENT_URL = "http://localhost:5173"
const CLIENT_URL = "https://hrm-eight-vert.vercel.app"

app.use(cors({ origin: CLIENT_URL, credentials: true, }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true
  },
});

initSocket(io);

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/", mainRoute);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});