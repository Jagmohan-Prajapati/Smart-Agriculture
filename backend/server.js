import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from '../database/connection.js';
import userAuthRoutes from './userAuth.js';
import predictCropRoutes from './predictCrop.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', userAuthRoutes);        // User authentication routes
app.use('/api/predict', predictCropRoutes);  // Crop prediction + yield data + health routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
