import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { connectDB } from "./config/connectionDB.js";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

// Static files
app.use("/images", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/user", userRoutes);
app.use("/blog", blogRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running", success: true });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File too large. Maximum size is 5MB",
        success: false,
      });
    }
    return res.status(400).json({
      message: err.message,
      success: false,
    });
  }
  
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    success: false,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found", success: false });
});

const PORT = process.env.PORT || 4000;

// Start server
app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on port ${PORT}`);
});