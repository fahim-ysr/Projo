// Importing required modules

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

// Allows file to load the API keys and credentials from .env file
dotenv.config();

const app = express();
app.use(express.json());

// Configuring cors
app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Configuring morgan
app.use(morgan("dev"));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("BD Connected Successfully"))
  .catch("Failed to connect to the database");

const PORT = process.env.PORT;

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to Projo API",
  });
});

// Error middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// Not found middleware
app.use((req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
