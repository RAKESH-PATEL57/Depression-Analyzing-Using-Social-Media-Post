import natural from 'natural';
import { removeStopwords } from 'stopword';

// AFINN lexicon for sentiment analysis
const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const analyzer = new Analyzer("English", stemmer, "afinn");

// Additional lexicon for depression-related words
const depressionLexicon = {
  'sad': -3,
  'depressed': -4,
  'anxiety': -3,
  'anxious': -3,
  'hopeless': -4,
  'worthless': -4,
  'suicidal': -5,
  'empty': -3,
  'alone': -2,
  'lonely': -3,
  'exhausted': -2,
  'tired': -2,
  'dark': -2,
  'pain': -3,
  'suffering': -4,
  'crying': -3,
  'tears': -3,
  'struggle': -3,
  'miserable': -4,
  'despair': -4
};

/**
 * Preprocess a tweet for sentiment analysis
 */
const preprocessTweet = (tweet) => {
  // Remove URLs
  let processedTweet = tweet.replace(/https?:\/\/\S+/g, '');
  
  // Remove mentions (@username)
  processedTweet = processedTweet.replace(/@\w+/g, '');
  
  // Remove hashtags (optional: keep them for topic analysis)
  processedTweet = processedTweet.replace(/#\w+/g, '');
  
  // Remove special characters and numbers
  processedTweet = processedTweet.replace(/[^a-zA-Z\s]/g, '');
  
  // Convert to lowercase and remove extra spaces
  processedTweet = processedTweet.toLowerCase().trim();
  
  // Tokenize the tweet
  const tokens = processedTweet.split(/\s+/);
  
  // Remove stopwords
  const filteredTokens = removeStopwords(tokens);
  
  return filteredTokens;
};

/**
 * Calculate VADER-like compound score from positive, negative, and neutral components
 */
const calculateCompoundScore = (positive, negative, neutral) => {
  const total = positive + Math.abs(negative) + neutral;
  if (total === 0) return 0;
  
  // Formula to normalize the score between -1 and 1
  return (positive - Math.abs(negative)) / total;
};

/**
 * Analyze sentiment of a single tweet
 */
const analyzeTweetSentiment = (tweet) => {
  const tokens = preprocessTweet(tweet);
  
  if (tokens.length === 0) return { compound: 0, positive: 0, negative: 0, neutral: 0 };
  
  // Calculate base sentiment using AFINN
  let afinnScore = analyzer.getSentiment(tokens);
  
  // Track positive, negative, neutral counts
  let positive = 0;
  let negative = 0;
  let neutral = 0;
  
  // Enhance with depression lexicon
  tokens.forEach(token => {
    if (depressionLexicon[token]) {
      const score = depressionLexicon[token];
      if (score < 0) negative += Math.abs(score);
      else if (score > 0) positive += score;
    } else {
      // Use AFINN individual word scores
      const wordScore = analyzer.getSentiment([token]);
      if (wordScore < 0) negative += Math.abs(wordScore);
      else if (wordScore > 0) positive += wordScore;
      else neutral += 1;
    }
  });
  
  // Calculate normalized compound score
  const compound = calculateCompoundScore(positive, negative, neutral);
  
  return {
    compound,
    positive,
    negative,
    neutral
  };
};

/**
 * Analyze a collection of tweets and determine if the user might be depressed
 */
export const analyzeSentiment = (tweets) => {
  // Analyze each tweet
  const scores = tweets.map(tweet => analyzeTweetSentiment(tweet));
  
  // Calculate average compound score
  const totalCompound = scores.reduce((sum, score) => sum + score.compound, 0);
  const averageCompound = totalCompound / (scores.length || 1);
  
  // Calculate depression probability
  const depressionThreshold = -0.1; // Adjusted threshold for depression detection
  const analysisResult = averageCompound <= depressionThreshold 
    ? "showing signs of depression" 
    : "not showing significant signs of depression";
    
  // Add detailed statistics
  const detailedScores = {
    positiveCount: scores.filter(score => score.compound > 0.1).length,
    negativeCount: scores.filter(score => score.compound < -0.1).length,
    neutralCount: scores.filter(score => score.compound >= -0.1 && score.compound <= 0.1).length,
    totalTweets: tweets.length
  };
  
  return {
    averageCompound,
    analysisResult,
    detailedScores
  };
};