/* eslint-disable react/prop-types */
import "../styles/AnalysisResult.css";
import SentimentCharts from "./SentimentCharts";

const AnalysisResult = ({ analysis, sentimentData, username, tweets, mlResults }) => {
  const { averageCompound, combinedScore, analysisResult, detailedScores, riskLevel } = sentimentData;
  
  // Determine color based on sentiment score
  const getScoreColor = (score) => {
    if (score < -0.2) return "#ff4757"; // Negative/Depressed
    if (score < 0.2) return "#ffa502"; // Neutral
    return "#2ed573"; // Positive
  };

  // Calculate percentage for the gauge
  // Use combined score if available, otherwise use averageCompound
  const scoreToDisplay = combinedScore !== undefined ? combinedScore : averageCompound;
  const scorePercent = ((scoreToDisplay + 1) / 2) * 100;

  // Get ML model prediction data
  const mlData = mlResults || sentimentData.mlResults;
  
  // Helper function to determine risk class
  const getRiskClass = (level) => {
    switch(level) {
      case "minimal": return "positive";
      case "low": return "low-risk";
      case "moderate": return "warning";
      case "high": return "negative";
      default: return "warning";
    }
  };
  
  // Helper function to format risk text
  const formatRiskText = (level) => {
    return `${level.toUpperCase()} RISK`;
  };
  
  return (
    <div className="analysis-container">
      <h2 className="analysis-heading">
        <span className="heading-icon">🧠</span>
        Analysis Results
      </h2>
      
      <div className="analysis-card">
        <div className="user-profile">
          <div className="username-badge">@{username}</div>
        </div>
        
        <div className="sentiment-gauge">
          <div className="gauge-wrapper">
            <div 
              className="gauge-fill" 
              style={{ 
                width: `${scorePercent}%`, 
                backgroundColor: getScoreColor(scoreToDisplay) 
              }}
            ></div>
            <div className="gauge-markers">
              <span className="gauge-marker negative">-1</span>
              <span className="gauge-marker neutral">0</span>
              <span className="gauge-marker positive">+1</span>
            </div>
          </div>
          <div className="gauge-value">
            Score: <span style={{ color: getScoreColor(scoreToDisplay) }}>
              {scoreToDisplay.toFixed(2)}
            </span>
            {combinedScore !== undefined && combinedScore !== averageCompound && (
              <span className="combined-score-note"> (Combined Analysis)</span>
            )}
          </div>
        </div>
        
        <div className="sentiment-summary">
          <h3 className="summary-heading">Summary</h3>
          <p className="summary-text">{analysis}</p>
        </div>
        
        <div className="sentiment-metrics">
          <div className="metric">
            <div className="metric-label">Positive Tweets</div>
            <div className="metric-value positive">{detailedScores.positiveCount}</div>
          </div>
          <div className="metric">
            <div className="metric-label">Neutral Tweets</div>
            <div className="metric-value neutral">{detailedScores.neutralCount}</div>
          </div>
          <div className="metric">
            <div className="metric-label">Negative Tweets</div>
            <div className="metric-value negative">{detailedScores.negativeCount}</div>
          </div>
        </div>
        
        {/* ML Model Prediction Section (show only if available) */}
        {/* {mlData && (
          <div className="ml-prediction">
            <h3 className="ml-heading">Machine Learning Analysis</h3>
            <div className="ml-metrics">
              <div className="ml-metric">
                <div className="ml-metric-label">Depression Indicators</div>
                <div className="ml-metric-value">{mlData.depressionPercentage.toFixed(1)}%</div>
              </div>
              <div className="ml-metric">
                <div className="ml-metric-label">Analysis Result</div>
                <div className="ml-metric-value">{mlData.analysisResult}</div>
              </div>
            </div>
          </div>
        )} */}
        
        <div className="analysis-conclusion">
          <div className={`conclusion-badge ${getRiskClass(riskLevel)}`}>
            {formatRiskText(riskLevel)}
          </div>
        </div>
      </div>

      {/* Add the charts component */}
      <SentimentCharts 
        tweets={tweets} 
        sentimentData={sentimentData} 
        mlResults={mlResults} 
      />
    </div>
  );
};

export default AnalysisResult;