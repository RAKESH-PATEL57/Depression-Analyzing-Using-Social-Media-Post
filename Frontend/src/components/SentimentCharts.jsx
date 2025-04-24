/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title, 
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Radar } from 'react-chartjs-2';
import '../styles/SentimentCharts.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title, 
  Tooltip, 
  Legend,
  Filler
);

const SentimentCharts = ({ tweets, sentimentData, mlResults }) => {
  useEffect(() => {
    // Apply dark mode colors to charts
    ChartJS.defaults.color = '#a0a0a0';
    ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
  }, []);

  // Generate sentiment trend data from tweets
  const generateSentimentTrendData = () => {
    // Use only the first 20 tweets for the trend to avoid overcrowding
    const maxTweets = Math.min(tweets.length, 20);
    const tweetLabels = Array.from({ length: maxTweets }, (_, i) => `Tweet ${i + 1}`);

    // Create random variation of compound scores around the average for demonstration
    // In a real app, you would process each individual tweet's sentiment
    const avgCompound = sentimentData.averageCompound;
    const randomVariance = 0.2; // Amount of random variance to add
    
    const tweetScores = Array.from({ length: maxTweets }, () => {
      return avgCompound + (Math.random() * randomVariance * 2 - randomVariance);
    });

    // Sort to create a more natural looking trend
    tweetScores.sort((a, b) => a - b);

    return {
      labels: tweetLabels,
      datasets: [
        {
          label: 'Sentiment Score',
          data: tweetScores,
          borderColor: '#00bcd4',
          backgroundColor: 'rgba(0, 188, 212, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#7c4dff',
          pointBorderColor: '#fff',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          fill: true
        }
      ]
    };
  };

  // Distribution of sentiment scores
  const generateSentimentDistribution = () => {
    const { detailedScores } = sentimentData;
    
    return {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [
        {
          label: 'Tweet Count',
          data: [
            detailedScores.positiveCount,
            detailedScores.neutralCount,
            detailedScores.negativeCount
          ],
          backgroundColor: [
            'rgba(46, 213, 115, 0.7)',
            'rgba(255, 165, 2, 0.7)',
            'rgba(255, 71, 87, 0.7)'
          ],
          borderColor: [
            'rgb(46, 213, 115)',
            'rgb(255, 165, 2)',
            'rgb(255, 71, 87)'
          ],
          borderWidth: 1,
          hoverOffset: 15
        }
      ]
    };
  };

  // Distribution of depression indicators
  const generateDepressionIndicators = () => {
    if (!mlResults && !sentimentData.mlResults) {
      // Fallback data if ML results aren't available
      return {
        labels: ['Depressive', 'Non-Depressive'],
        datasets: [
          {
            label: 'Indicators',
            data: [
              Math.round(sentimentData.averageCompound < -0.1 ? 55 : 25),
              Math.round(sentimentData.averageCompound < -0.1 ? 45 : 75)
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(132, 99, 255, 0.7)'
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(132, 99, 255)'
            ],
            borderWidth: 1,
            hoverOffset: 15
          }
        ]
      };
    }

    // Use the ML results if available
    const ml = mlResults || sentimentData.mlResults;
    const depressionPercentage = ml.depressionPercentage || 0;
    
    return {
      labels: ['Depressive', 'Non-Depressive'],
      datasets: [
        {
          label: 'Indicators',
          data: [
            Math.round(depressionPercentage),
            Math.round(100 - depressionPercentage)
          ],
          backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(132, 99, 255, 0.7)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(132, 99, 255)'
          ],
          borderWidth: 1,
          hoverOffset: 15
        }
      ]
    };
  };

  // Emotional analysis radar chart
  const generateEmotionalRadarData = () => {
    // Create a random emotion profile based on the average compound score
    // In a real app, this would be calculated from actual NLP emotion detection
    const baseValue = Math.abs(sentimentData.averageCompound) * 100;
    const isNegative = sentimentData.averageCompound < 0;
    
    // Generate values for various emotional dimensions based on whether the sentiment is positive or negative
    let joy, sadness, anger, fear, surprise;
    
    if (isNegative) {
      sadness = baseValue + Math.random() * 20;
      anger = baseValue * 0.7 + Math.random() * 30;
      fear = baseValue * 0.5 + Math.random() * 25;
      joy = 100 - baseValue * 0.8 + Math.random() * 10;
      surprise = 40 + Math.random() * 30;
    } else {
      joy = baseValue + Math.random() * 20;
      surprise = baseValue * 0.6 + Math.random() * 20;
      sadness = 100 - baseValue * 0.8 + Math.random() * 10;
      anger = 100 - baseValue + Math.random() * 10;
      fear = 100 - baseValue * 0.9 + Math.random() * 10;
    }
    
    return {
      labels: ['Joy', 'Sadness', 'Anger', 'Fear', 'Surprise'],
      datasets: [
        {
          label: 'Emotional Profile',
          data: [joy, sadness, anger, fear, surprise],
          backgroundColor: 'rgba(124, 77, 255, 0.3)',
          borderColor: '#7c4dff',
          pointBackgroundColor: '#00bcd4',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#ff4081'
        }
      ]
    };
  };

  // Time distribution analysis
  const generateHourlyActivityData = () => {
    // In a real app, you would analyze actual tweet timestamps
    // Here we generate a simulated hourly distribution
    const hours = Array.from({ length: 24 }, (_, i) => `${i}h`);
    
    // Create a distribution pattern based on the sentiment
    // Negative sentiments tend to have more night-time activity in this simulation
    const isNegative = sentimentData.averageCompound < 0;
    
    const generateHourlyData = () => {
      const data = Array(24).fill(0);
      
      // Generate a peaked distribution around certain hours based on sentiment
      const peakHour = isNegative ? 2 : 14; // 2AM for negative, 2PM for positive
      
      for (let i = 0; i < tweets.length; i++) {
        // Create a distribution centered around the peak hour
        const hourOffset = Math.floor(Math.random() * 24);
        const distance = Math.min(
          Math.abs(hourOffset - peakHour),
          24 - Math.abs(hourOffset - peakHour)
        );
        const probability = 1 - distance / 12;
        
        if (Math.random() < probability) {
          data[hourOffset]++;
        } else {
          // Randomly assign other hours
          const randomHour = Math.floor(Math.random() * 24);
          data[randomHour]++;
        }
      }
      
      return data;
    };
    
    return {
      labels: hours,
      datasets: [
        {
          label: 'Tweet Activity by Hour',
          data: generateHourlyData(),
          backgroundColor: 'rgba(255, 64, 129, 0.6)',
          borderColor: '#ff4081',
          borderWidth: 1,
          borderRadius: 4,
        }
      ]
    };
  };

  // Chart options
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Raleway', sans-serif",
          size: 13
        },
        bodyFont: {
          family: "'Raleway', sans-serif",
          size: 12
        },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: -1,
        max: 1,
        ticks: {
          stepSize: 0.5
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };
  
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Raleway', sans-serif",
          size: 13
        },
        bodyFont: {
          family: "'Raleway', sans-serif",
          size: 12
        },
        padding: 12,
        cornerRadius: 8
      }
    }
  };
  
  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        },
        pointLabels: {
          font: {
            family: "'Orbitron', sans-serif",
            size: 12
          }
        },
        ticks: {
          display: false,
          backdropColor: 'transparent'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Raleway', sans-serif",
          size: 13
        },
        bodyFont: {
          family: "'Raleway', sans-serif",
          size: 12
        },
        padding: 12,
        cornerRadius: 8
      }
    }
  };
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 15,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          family: "'Raleway', sans-serif",
          size: 13
        },
        bodyFont: {
          family: "'Raleway', sans-serif",
          size: 12
        },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="charts-container">
      <div className="chart-row">
        <div className="chart-wrapper">
          <h3 className="chart-title">
            <span className="chart-icon">🔄</span>
            Sentiment Distribution
          </h3>
          <div className="chart-area pie-chart-area">
            <Pie data={generateSentimentDistribution()} options={pieOptions} />
          </div>
        </div>
        
        <div className="chart-wrapper">
          <h3 className="chart-title">
            <span className="chart-icon">🧠</span>
            Depression Indicators
          </h3>
          <div className="chart-area pie-chart-area">
            <Pie data={generateDepressionIndicators()} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentCharts;