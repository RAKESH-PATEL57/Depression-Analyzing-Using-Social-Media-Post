from flask import Flask, request, jsonify
from flask_cors import CORS
from models.depression_model import DepressionDetectionModel
import os

app = Flask(__name__)
CORS(app)

# Initialize the model
model = DepressionDetectionModel()
try:
    model.load_model('models/trained/depression_model.joblib')
    print("ML model loaded successfully")
except Exception as e:
    print(f"Warning: Could not load model - {e}")
    print("You may need to train the model first using train_model.py")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get tweets from request
        data = request.json
        tweets = data.get('tweets', [])
        
        if not tweets:
            return jsonify({'error': 'No tweets provided'}), 400
            
        # Make predictions if model is loaded
        if model.model is not None:
            results = model.predict(tweets)
            
            # Calculate percentage of tweets classified as depressed
            depression_count = sum(1 for pred in results['predictions'] if pred == 1)
            depression_percentage = (depression_count / len(tweets)) * 100
            
            # Average probability score
            avg_probability = None
            if results['probabilities']:
                avg_probability = sum(results['probabilities']) / len(results['probabilities'])
            
            # Determine depression risk level
            risk_level = "minimal"
            if depression_percentage >= 70:
                risk_level = "high"
            elif depression_percentage >= 40:
                risk_level = "moderate"
            elif depression_percentage >= 20:
                risk_level = "low"
            
            # Analysis result text
            analysis_result = "showing signs of depression" if risk_level in ["high", "moderate"] else "not showing significant signs of depression"
            
            return jsonify({
                'predictions': results['predictions'],
                'probabilities': results['probabilities'],
                'depressionPercentage': depression_percentage,
                'averageProbability': avg_probability,
                'riskLevel': risk_level,
                'analysisResult': analysis_result
            })
        else:
            # Fallback if model isn't loaded
            return jsonify({'error': 'Model not loaded'}), 503
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run on port 5000 to avoid conflict with Node.js server
    app.run(port=5000, debug=True)