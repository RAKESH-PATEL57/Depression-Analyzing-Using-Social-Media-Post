import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRoutes from "./routes/apiRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Validate environment variables
if (!process.env.TWITTER_BEARER_TOKEN) {
  console.error("Error: Missing Twitter Bearer Token in the .env file.");
  process.exit(1);
}

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", apiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});