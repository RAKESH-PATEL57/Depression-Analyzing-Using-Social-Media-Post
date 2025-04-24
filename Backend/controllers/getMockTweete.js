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

// // Controller to analyze tweets with both sentiment and ML analysis
// export const analyzeTweets = async (req, res) => {
//   const { username } = req.params;

//   if (!username) {
//     return res.status(400).json({ error: "Username is required." });
//   }

//   try {
//     // Fetch tweets from the Twitter API
//     const tweets = await fetchTweetsByUsername(username);

//     if (tweets.length === 0) {
//       return res.status(404).json({ error: "No tweets found for this user." });
//     }

//     // Extract just the text for sentiment analysis
//     const tweetTexts = tweets.map((tweet) => tweet.text);

//     // Basic sentiment analysis using our local util
//     const { averageCompound, analysisResult, detailedScores } =
//       analyzeSentiment(tweetTexts);

//     // Get ML analysis from Python service
//     // Get ML analysis from Python service
//     let mlResults = null;
//     try {
//       const mlResponse = await axios.post("http://localhost:5000/predict", {
//         tweets: tweetTexts,
//       });
//       mlResults = mlResponse.data;
//     } catch (mlError) {
//       console.error("Error getting ML predictions:", mlError);
//       // Continue with basic sentiment analysis if ML service is unavailable
//     }

//     // Determine final analysis result (prefer ML if available)
//     const finalAnalysis = mlResults
//       ? `Based on machine learning analysis of ${
//           tweets.length
//         } tweets, this account appears to be ${
//           mlResults.analysisResult
//         }. The model detected depression indicators in ${mlResults.depressionPercentage.toFixed(
//           1
//         )}% of the tweets.`
//       : `Based on sentiment analysis, this account appears to be ${analysisResult}. The overall sentiment score is ${averageCompound.toFixed(
//           2
//         )} on a scale from -1 (negative) to 1 (positive).`;

//     // Send the analysis result and tweets to the frontend
//     res.status(200).json({
//       username,
//       analysis: finalAnalysis,
//       tweets: tweetTexts,
//       tweetData: tweets,
//       sentimentData: {
//         averageCompound,
//         analysisResult,
//         detailedScores,
//         riskLevel:
//           mlResults?.riskLevel || (averageCompound < -0.1 ? "moderate" : "low"),
//       },
//       mlResults,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };




// Add to analysisController.js

// Mock function for development, use when Twitter API is unavailable
const getMockTweets = (username) => {
  const mockTweets = [
    {
      text: "Feeling so sad",
      created_at: "2023-04-01T12:30:45Z"
    },
    {
      text: "Another sleepless night. The thoughts just won't stop.",
      created_at: "2023-04-02T03:15:20Z"
    },
    {
      text: "Why does everything feel so meaningless? Nothing seems worth the effort.",
      created_at: "2023-04-03T14:45:33Z"
    },
    {
      text: "Had a moment of happiness today when I saw a dog in the park. Small things matter.",
      created_at: "2023-04-04T17:22:10Z"
    },
    {
      text: "Sometimes I wonder if anyone would notice if I just disappeared.",
      created_at: "2023-04-05T22:10:05Z"
    }
  ];

  return mockTweets;
};

// Modify fetchTweetsByUsername to use mock data if Twitter API fails
const fetchTweetsByUsername = async (username) => {
  try {
    // Try to use Twitter API first
    const url = `https://api.twitter.com/2/tweets/search/recent?query=from:${username}&max_results=50&tweet.fields=text,created_at`;
    const headers = {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    };

    const response = await axios.get(url, { headers });

    // Return tweets with timestamps when available
    return response.data.data?.map((tweet) => ({
      text: tweet.text,
      created_at: tweet.created_at || null
    })) || [];
  } catch (error) {
    console.error("Twitter API error:", error.message);
    console.log("Using mock tweets instead");
    
    // Return mock data as fallback
    return getMockTweets(username);
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

    // Determine final analysis result (prefer ML if available)
    const finalAnalysis = mlResults
      ? `Based on machine learning analysis of ${
          tweets.length
        } tweets, this account appears to be ${
          mlResults.analysisResult
        }. The model detected depression indicators in ${mlResults.depressionPercentage.toFixed(
          1
        )}% of the tweets.`
      : `Based on sentiment analysis, this account appears to be ${analysisResult}. The overall sentiment score is ${averageCompound.toFixed(
          2
        )} on a scale from -1 (negative) to 1 (positive).`;

    // Send the analysis result and tweets to the frontend
    res.status(200).json({
      username,
      analysis: finalAnalysis,
      tweets: tweetTexts,
      tweetData: tweets,
      sentimentData: {
        averageCompound,
        analysisResult,
        detailedScores,
        riskLevel:
          mlResults?.riskLevel || (averageCompound < -0.1 ? "moderate" : "low"),
      },
      mlResults,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




//backup
import axios from "axios";
import { analyzeSentiment } from "../utils/sentimentAnalyzer.js";

// Function to fetch tweets by username
const fetchTweetsByUsername = async (username) => {
  try {
    // Updated to request created_at for timestamps
    const url = `https://api.twitter.com/2/tweets/search/recent?query=from:${username}&max_results=10&tweet.fields=text,created_at`;
    const headers = {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    };

    const response = await axios.get(url, { headers });

    // Return tweets with timestamps when available
    return (
      response.data.data?.map((tweet) => ({
        text: tweet.text,
        created_at: tweet.created_at || null,
      })) || []
    );
  } catch (error) {
    console.error(
      "Error fetching tweets:",
      error.response?.status,
      error.response?.data || error.message
    );

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

// Controller to analyze tweets with both sentiment and ML analysis
// export const analyzeTweets = async (req, res) => {
//   const { username } = req.params;

//   if (!username) {
//     return res.status(400).json({ error: "Username is required." });
//   }

//   try {
//     // Fetch tweets from the Twitter API
//     const tweets = await fetchTweetsByUsername(username);

//     if (tweets.length === 0) {
//       return res.status(404).json({ error: "No tweets found for this user." });
//     }

//     // Extract just the text for sentiment analysis
//     const tweetTexts = tweets.map((tweet) => tweet.text);

//     // Basic sentiment analysis using our local util
//     const { averageCompound, analysisResult, detailedScores } =
//       analyzeSentiment(tweetTexts);

//     // Get ML analysis from Python service
//     // Get ML analysis from Python service
//     let mlResults = null;
//     try {
//       const mlResponse = await axios.post("http://localhost:5000/predict", {
//         tweets: tweetTexts,
//       });
//       mlResults = mlResponse.data;
//     } catch (mlError) {
//       console.error("Error getting ML predictions:", mlError);
//       // Continue with basic sentiment analysis if ML service is unavailable
//     }

//     // Determine final analysis result (prefer ML if available)
//     const finalAnalysis = mlResults
//       ? `Based on machine learning analysis of ${
//           tweets.length
//         } tweets, this account appears to be ${
//           mlResults.analysisResult
//         }. The model detected depression indicators in ${mlResults.depressionPercentage.toFixed(
//           1
//         )}% of the tweets.`
//       : `Based on sentiment analysis, this account appears to be ${analysisResult}. The overall sentiment score is ${averageCompound.toFixed(
//           2
//         )} on a scale from -1 (negative) to 1 (positive).`;

//     // Send the analysis result and tweets to the frontend
//     res.status(200).json({
//       username,
//       analysis: finalAnalysis,
//       tweets: tweetTexts,
//       tweetData: tweets,
//       sentimentData: {
//         averageCompound,
//         analysisResult,
//         detailedScores,
//         riskLevel:
//           mlResults?.riskLevel || (averageCompound < -0.1 ? "moderate" : "low"),
//       },
//       mlResults,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
