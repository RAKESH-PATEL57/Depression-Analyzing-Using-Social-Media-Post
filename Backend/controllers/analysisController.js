import axios from "axios";
import { analyzeSentiment } from "../utils/sentimentAnalyzer.js";

// Function to fetch tweets by username
const fetchTweetsByUsername = async (username) => {
  try {
    const url = `https://api.twitter.com/2/tweets/search/recent?query=from:${username}&max_results=50&tweet.fields=text`;
    const headers = {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
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

// Controller to analyze tweets
export const analyzeTweets = async (req, res) => {
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

    // Analyze tweets with the sentiment analyzer
    const { averageCompound, analysisResult, detailedScores } = analyzeSentiment(tweets);

    // Prepare the result
    const analysis = `Based on sentiment analysis, this account appears to be ${analysisResult}. 
                     The overall sentiment score is ${averageCompound.toFixed(2)} on a scale from -1 (negative) to 1 (positive).`;

    // Send the analysis result and tweets to the frontend
    res.status(200).json({ 
      username, 
      analysis, 
      tweets,
      sentimentData: {
        averageCompound,
        analysisResult,
        detailedScores
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};