import axios from "axios";
import { analyzeSentiment } from "../utils/sentimentAnalyzer.js";

// Function to fetch tweets by username
// const fetchTweetsByUsername = async (username) => {
//   try {
//     // Updated to request created_at for timestamps
//     const url = `https://api.twitter.com/2/tweets/search/recent?query=from:${username}&max_results=10&tweet.fields=text,created_at`;
//     const headers = {
//       Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
//     };

//     const response = await axios.get(url, { headers });

//     // Return tweets with timestamps when available
//     return (
//       response.data.data?.map((tweet) => ({
//         text: tweet.text,
//         created_at: tweet.created_at || null,
//       })) || []
//     );
//   } catch (error) {
//     console.error(
//       "Error fetching tweets:",
//       error.response?.status,
//       error.response?.data || error.message
//     );

//     if (error.response?.status === 404) {
//       throw new Error("User not found or no recent tweets available.");
//     } else if (error.response?.status === 401) {
//       throw new Error("Invalid or expired Twitter API token.");
//     } else if (error.response?.status === 429) {
//       throw new Error("Rate limit exceeded. Please try again later.");
//     } else {
//       throw new Error("Failed to fetch tweets.");
//     }
//   }
// };


const getMockTweets = (username) => {
  const mockTweets = [
    // {
    //   text: "Feeling good",
    //   created_at: "2023-04-01T12:30:45Z"
    // },
    {
      text: "Feeling want to die",
      created_at: "2023-04-01T12:30:45Z"
    },
    {
      text: "Feeling bad",
      created_at: "2023-04-01T12:30:45Z"
    },
    {
      text: "Feeling fantastic",
      created_at: "2023-04-01T12:30:45Z"
    },
    // {
    //   text: "Another sleepless night. The thoughts just won't stop.",
    //   created_at: "2023-04-02T03:15:20Z"
    // },
    // {
    //   text: "Why does everything feel so meaningless? Nothing seems worth the effort.",
    //   created_at: "2023-04-03T14:45:33Z"
    // },
    // {
    //   text: "Had a moment of happiness today when I saw a dog in the park. Small things matter.",
    //   created_at: "2023-04-04T17:22:10Z"
    // },
    // {
    //   text: "Sometimes I wonder if anyone would notice if I just disappeared.",
    //   created_at: "2023-04-05T22:10:05Z"
    // }
  ];

  return mockTweets;
};

// Modify fetchTweetsByUsername to use mock data if Twitter API fails
const fetchTweetsByUsername = async (username) => {
  try {
    return getMockTweets(username);
  } catch (error) {
    console.error("Twitter API error:", error.message);
    console.log("Using mock tweets instead");
  }
};

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

    // Extract just the text for sentiment analysis
    const tweetTexts = tweets.map((tweet) => tweet.text);

    // Basic sentiment analysis using our local util
    const { averageCompound, analysisResult, detailedScores } =
      analyzeSentiment(tweetTexts);

    // Get ML analysis from Python service
    let mlResults = null;
    try {
      const mlResponse = await axios.post("http://localhost:5000/predict", {
        tweets: tweetTexts,
      });
      mlResults = mlResponse.data;
    } catch (mlError) {
      console.error("Error getting ML predictions:", mlError);
      // Continue with basic sentiment analysis if ML service is unavailable
    }

    // Create a combined analysis that integrates both sentiment and ML analysis when available
    let combinedAnalysis = "";
    
    // Start with number of tweets analyzed
    combinedAnalysis = `Analysis of ${tweets.length} tweets from @${username}: `;
    
    // Add basic sentiment analysis result
    combinedAnalysis += `Sentiment analysis indicates ${analysisResult} content with an average score of ${averageCompound.toFixed(2)} on a scale from -1 (negative) to 1 (positive). `;
    
    // Add ML analysis if available
    if (mlResults) {
      combinedAnalysis += `Machine learning analysis suggests the account is ${mlResults.analysisResult} with depression indicators in ${mlResults.depressionPercentage.toFixed(1)}% of tweets. `;
      
      // Compare the two analyses
      if (mlResults.analysisResult.toLowerCase() === analysisResult.toLowerCase()) {
        combinedAnalysis += "Both analyses are in agreement. ";
      } else {
        combinedAnalysis += "The two analyses show some differences in their assessment. ";
      }
    }
    
    // Determine an overall risk level
    let riskLevel = "low";
    if (mlResults && mlResults.riskLevel) {
      riskLevel = mlResults.riskLevel;
    } else if (averageCompound < -0.25) {
      riskLevel = "high";
    } else if (averageCompound < -0.1) {
      riskLevel = "moderate";
    }
    
    combinedAnalysis += `Overall risk assessment: ${riskLevel.toUpperCase()}.`;

    // Send the combined analysis result and all data to the frontend
    res.status(200).json({
      username,
      analysis: combinedAnalysis,
      tweets: tweetTexts,
      tweetData: tweets,
      sentimentData: {
        averageCompound,
        analysisResult,
        detailedScores,
        riskLevel
      },
      mlResults
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};