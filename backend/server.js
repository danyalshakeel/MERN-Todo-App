import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectionDB from "./config/db.js";
import router from "./routes/todo.route.js";

dotenv.config();

const app = express();

// Enable CORS for your frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"], // Fix 1: Added PATCH
    credentials: true,
  })
);

// Parse JSON requests
app.use(express.json());

// Routes
app.use("/api/todos", router);

// Start server and connect to DB
const PORT = process.env.PORT || 5000;

// Fix 2: Use template literals correctly with backticks
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT} http://localhost:${PORT}`);
  try {
    await connectionDB();
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
  }
});