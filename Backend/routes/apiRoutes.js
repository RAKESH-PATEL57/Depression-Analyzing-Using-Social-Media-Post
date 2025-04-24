import express from "express";
import { analyzeTweets } from "../controllers/analysisController.js";

const router = express.Router();

// Twitter analysis route
router.get("/analyze/:username", analyzeTweets);

export default router;