import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [username, setUsername] = useState("");
  const [tweets, setTweets] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0); // Timer state (in seconds)

  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (timer > 0) {
      setError("You must wait until the timer reaches zero before trying again.");
      return;
    }

    setError(null);
    setTweets(null);
    setAnalysis(null);
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:3000/analyze/${username}`);
      setTweets(response.data.tweets);
      setAnalysis(response.data.analysis);

      // Set a 15-minute timer (15 * 60 seconds)
      setTimer(15 * 60);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update the timer every second
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval); // Cleanup
    }
  }, [timer]);

  // Format timer to "MM:SS"
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="app">
      <h1>Depression Analysis</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Twitter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading || timer > 0} // Disable input if loading or timer > 0
          required
        />
        <button type="submit" disabled={loading || timer > 0}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {/* Timer message */}
      {timer > 0 && (
        <p className="timer">You can submit another username in: {formatTimer(timer)}</p>
      )}

      {/* Display tweets if fetched successfully */}
      {tweets && (
        <div className="result">
          <h2>Tweets</h2>
          <ul>
            {tweets.map((tweet, index) => (
              <li key={index}>{tweet}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display analysis result */}
      {analysis && (
        <div className="analysis">
          <h2>Analysis</h2>
          <p>{analysis}</p>
        </div>
      )}

      {/* Display error messages */}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default App;
