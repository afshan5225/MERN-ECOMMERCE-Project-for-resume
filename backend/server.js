import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import cors from 'cors';


import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRouter from "./routes/uploadRoutes.js"

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],
    credentials: true, 
  
}));


// Middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing form data
app.use(cookieParser());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRouter);

// Serve uploads folder statically
const __dirnameResolved = path.resolve();
app.use('/uploads', express.static(path.join(__dirnameResolved, '/uploads')));

// PayPal config route
app.get('/api/config/paypal', (req, res) => 
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Root route
app.get('/', (req, res) => {
  res.send("API is running!");
});

// Error Handlers
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
