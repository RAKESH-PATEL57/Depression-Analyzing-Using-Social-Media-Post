const natural = require('natural');
const { SentimentAnalyzer, PorterStemmer } = natural;

const preprocess = (tweet) => {
  // Remove URLs
  tweet = tweet.replace(/https?:\/\/\S+/gi, '');
  
  // Remove mentions
  tweet = tweet.replace(/@\w+/gi, '');
  
  // Remove hashtags
  tweet = tweet.replace(/#\w+/gi, '');
  
  // Remove special characters and digits
  tweet = tweet.replace(/[^a-zA-Z\s]/gi, '');
  
  return tweet.toLowerCase().trim();
};

const analyzeSentiment = (tweets) => {
  const sentimentAnalyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");
  
  const processedTweets = tweets.map(preprocess);
  
  const sentimentScores = processedTweets.map(tweet => 
    sentimentAnalyzer.getSentiment(tweet.split(' '))
  );
  
  const averageSentiment = sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;
  
  if (averageSentiment < 0) {
    return "The user is showing signs of potential depression or negative emotional state.";
  } else if (averageSentiment === 0) {
    return "The user's tweets suggest a neutral emotional state.";
  } else {
    return "The user appears to have a positive emotional state.";
  }
};

module.exports = { analyzeSentiment };