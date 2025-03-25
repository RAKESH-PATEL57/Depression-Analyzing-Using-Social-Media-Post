/* eslint-disable react/prop-types */
import "../styles/AnalysisResult.css";

const AnalysisResult = ({ analysis, sentimentData, username }) => {
  const { averageCompound, analysisResult, detailedScores } = sentimentData;
  
  // Determine color based on sentiment score
  const getScoreColor = (score) => {
    if (score < -0.2) return "#ff4757"; // Negative/Depressed
    if (score < 0.2) return "#ffa502"; // Neutral
    return "#2ed573"; // Positive
  };

  // Calculate percentage for the gauge
  const scorePercent = ((averageCompound + 1) / 2) * 100;
  
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
                backgroundColor: getScoreColor(averageCompound) 
              }}
            ></div>
            <div className="gauge-markers">
              <span className="gauge-marker negative">-1</span>
              <span className="gauge-marker neutral">0</span>
              <span className="gauge-marker positive">+1</span>
            </div>
          </div>
          <div className="gauge-value">
            Score: <span style={{ color: getScoreColor(averageCompound) }}>
              {averageCompound.toFixed(2)}
            </span>
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
        
        <div className="analysis-conclusion">
          <div className={`conclusion-badge ${analysisResult.includes('not') ? 'positive' : 'negative'}`}>
            {analysisResult.includes('not') ? 'LOW RISK' : 'ATTENTION NEEDED'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;