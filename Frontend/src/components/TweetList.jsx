/* eslint-disable react/prop-types */
import "../styles/TweetList.css";

const TweetList = ({ tweets }) => {
  // console.log(tweets);
  return (
    <div className="tweets-container">
      <h2 className="tweets-heading">
        <span className="heading-icon">📊</span>
        Analyzed Tweets
      </h2>
      <div className="tweets-list">
        {tweets.map((tweet, index) => (
          <div key={index} className="tweet-card">
            <p className="tweet-text">{tweet}</p>
            <div className="tweet-metadata">
              <span className="tweet-number">#{index + 1}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TweetList;