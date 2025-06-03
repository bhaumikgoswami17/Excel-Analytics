import express from 'express';
import mongoose from 'mongoose';
import { connect } from './Config/Database.js';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import uploadRoute from './routes/upload.js'; 

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.json()); // To parse JSON bodies
app.use('/api', uploadRoute);

connect();

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

// Use the auth routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
