// Main Server File (Entry point)

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import routes from "./routes/index.js";

// Allows file to load the variables from .env file
dotenv.config();

// Initializes Express app
const app = express();
// Parses incoming JSON requests and put the parsed data in req.body
app.use(express.json());

// Configuring cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Configuring morgan
app.use(morgan("dev"));

// MongoDB database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("BD Connected Successfully"))
  .catch("Failed to connect to the database");

// Gets port number from .env
const PORT = process.env.PORT;

app.get("/", async (req, res) => {
  res.status(200).json({
    message: "Welcome to Projo API",
  });
});

// Mounts all API routes at /api-v1 base path
app.use("/api-v1", routes);

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

// Starts servr and listens to the specific port
app.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`);
});
