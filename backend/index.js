import express from 'express';
import mongoose from 'mongoose';
import { connect } from './Config/Database.js';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';       // ✅ Only this one is needed
import uploadRoute from './routes/upload.js'; 

dotenv.config();

const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Mount routes
app.use('/api/auth', authRoutes);   // ✅ Correct route for all auth-related
app.use('/api/excel', uploadRoute); // ✅ Excel routes

// Connect DB
connect();

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
