/* eslint-disable react/prop-types */
import { useEffect } from "react";
import axios from "axios";
import "../styles/UsernameForm.css";

const UsernameForm = ({
  username,
  setUsername,
  loading,
  setLoading,
  error,
  setError,
  setTweets,
  setAnalysis,
  setSentimentData,
  setMlResults,
  timer,
  setTimer
}) => {
  // Handle the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (timer > 0) {
      setError("You must wait until the timer reaches zero before trying again.");
      return;
    }
   

    if (!username.trim()) {
      setError("Please enter a Twitter username.");
      return;
    }

    setError(null);
    setTweets(null);
    setAnalysis(null);
    setSentimentData(null);
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:3000/api/analyze/${username}`);
      console.log("Success response:", response.data);
      setTweets(response.data.tweets);
      setAnalysis(response.data.analysis);
      setSentimentData({
        ...response.data.sentimentData,
        tweetData: response.data.tweetData || response.data.tweets.map(text => ({ text }))
      });
      
      // Add mlResults if available
      if (response.data.mlResults) {
        setMlResults(response.data.mlResults);
      }

      // Set a 15-minute timer (15 * 60 seconds)
      // setTimer(15 * 60);
    } catch (err) {
      console.error("Error details:", err);
      console.error("Response data:", err.response?.data);
      console.error("Status code:", err.response?.status);
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
  }, [timer, setTimer]);

  // Format timer to "MM:SS"
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="username-form">
        <div className="input-group">
          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Enter Twitter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading || timer > 0}
              required
              className="username-input"
            />
            <div className="input-focus-effect"></div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || timer > 0 || !username.trim()}
            className="analyze-button"
          >
            {loading ? (
              <>
                <span className="button-text">Analyzing</span>
                <span className="loading-dots">...</span>
              </>
            ) : (
              <span className="button-text">Analyze</span>
            )}
          </button>
        </div>

        {timer > 0 && (
          <div className="timer-container">
            <div className="timer-bar" style={{ '--timer-percent': `${(timer / (15 * 60)) * 100}%` }}></div>
            <p className="timer-text">
              Next analysis available in <span className="timer-value">{formatTimer(timer)}</span>
            </p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default UsernameForm;