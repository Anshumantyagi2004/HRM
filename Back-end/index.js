// server.js
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import mainRoute from './src/routes/mainRoute.js'; 
import cors from 'cors';

dotenv.config();

// ✅ Allow CORS
const app = express();
app.use(cors({
  origin: '*',
  // credentials: true,
}));
const PORT = 5000;

app.use(express.json()); 

app.get('/', (req, res) => {
  res.send("Backend is running");
});

connectDB();

app.use('/', mainRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));