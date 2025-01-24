import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Load API credentials from .env
const BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Validate environment variables
if (!BEARER_TOKEN || !GEMINI_API_KEY) {
  console.error("Error: Missing Twitter or Gemini API key in the .env file.");
  process.exit(1);
}

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all requests

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to fetch tweets by username
const fetchTweetsByUsername = async (username) => {
  try {
    const url = `https://api.twitter.com/2/tweets/search/recent?query=from:${username}&tweet.fields=text;`
    const headers = {
      Authorization: `Bearer ${BEARER_TOKEN}`,
    };

    const response = await axios.get(url, { headers });

    // Return the text of each tweet
    return response.data.data?.map((tweet) => tweet.text) || [];
  } catch (error) {
    console.error("Error fetching tweets:", error.response?.status, error.response?.data || error.message);

    if (error.response?.status === 404) {
      throw new Error("User not found or no recent tweets available.");
    } else if (error.response?.status === 401) {
      throw new Error("Invalid or expired Twitter API token.");
    } else if (error.response?.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.");
    } else {
      throw new Error("Failed to fetch tweets.");
    }
  }
};

// Function to analyze tweets using Gemini AI
const analyzeTweetsWithGemini = async (tweets) => {
  try {
    // Combine all tweets into a single prompt
    const prompt = 
      `The following are tweets from a Twitter user. Analyze the tweets and predict if the user might be depressed or not based on the tone, language, and sentiment:
      
      ${tweets.join("\n\n")}
      
      Provide a clear response: "The user is likely depressed" or "The user is not likely depressed."`
    ;

    // Send the prompt to Gemini AI
    const result = await model.generateContent(prompt);
    return result.response.text(); // Return the AI's response
  } catch (error) {
    console.error("Error analyzing tweets with Gemini AI:", error.message);
    throw new Error("Failed to analyze tweets with Gemini AI.");
  }
};

// Endpoint to fetch tweets and analyze them with Gemini AI
app.get("/analyze/:username", async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    // Fetch tweets from the Twitter API
    const tweets = await fetchTweetsByUsername(username);

    if (tweets.length === 0) {
      return res.status(404).json({ error: "No tweets found for this user." });
    }

    // Analyze the tweets with Gemini AI
    const analysis = await analyzeTweetsWithGemini(tweets);

    // Send the analysis result and tweets to the frontend
    res.status(200).json({ username, analysis, tweets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});