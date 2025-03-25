import { useState } from "react";
import UsernameForm from "./components/UsernameForm";
import TweetList from "./components/TweetList";
import AnalysisResult from "./components/AnalysisResult";
import "./styles/App.css";

const App = () => {
  const [username, setUsername] = useState("");
  const [tweets, setTweets] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);

  return (
    <div className="app-container">
      <div className="neural-background"></div>
      
      <header className="app-header">
        <div className="logo">
          <div className="brain-wave"></div>
          <h1>Depression Analysis</h1>
        </div>
        <p className="tagline">Neural Sentiment Analysis for Early Detection</p>
      </header>
      
      <main className="app-content">
        <UsernameForm 
          username={username}
          setUsername={setUsername}
          loading={loading}
          setLoading={setLoading}
          error={error}
          setError={setError}
          setTweets={setTweets}
          setAnalysis={setAnalysis}
          setSentimentData={setSentimentData}
          timer={timer}
          setTimer={setTimer}
        />
        
        <div className="results-container">
          {sentimentData && (
            <AnalysisResult 
              analysis={analysis}
              sentimentData={sentimentData}
              username={username}
            />
          )}
          
          {tweets && tweets.length > 0 && (
            <TweetList tweets={tweets} />
          )}
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Neural Sentiment Analysis for Mental Health Monitoring • {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;