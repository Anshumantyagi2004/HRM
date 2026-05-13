import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./src/config/db.js";
import mainRoute from "./src/routes/mainRoute.js";
import { initSocket } from "./src/socket/socket.js";
import cookieParser from "cookie-parser";
import { connectRedis } from "./src/config/redis.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL;

console.log("CLIENT_URL:", CLIENT_URL);

// CORS
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Test Route
app.get("/", (req, res) => {
  res.send(`Backend is running CLIENT_URL: ${CLIENT_URL}`);
});

// DB Connection
connectDB();

// Redis
await connectRedis();

// Create HTTP Server
const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

initSocket(io);

// Attach io to req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api", mainRoute);

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});