import pandas as pd
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split, GridSearchCV, StratifiedKFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
from sklearn.pipeline import Pipeline
import joblib
import matplotlib.pyplot as plt
import seaborn as sns

# Download NLTK resources
nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)

class DepressionDetectionModel:
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        self.model = None
        self.vectorizer = None
        
    def preprocess_text(self, text):
        """Clean and preprocess text data"""
        # Convert to lowercase
        text = text.lower()
        # Remove URLs
        text = re.sub(r'https?:\/\/\S+', '', text)
        # Remove mentions
        text = re.sub(r'@\w+', '', text)
        # Remove hashtags (keep the text without #)
        text = re.sub(r'#(\w+)', r'\1', text)
        # Remove special characters and numbers
        text = re.sub(r'[^\w\s]', '', text)
        text = re.sub(r'\d+', '', text)
        
        # Add fallback for tokenization
        try:
            tokens = nltk.word_tokenize(text)
        except LookupError:
            tokens = text.split()
            
        # Remove stopwords and lemmatize
        tokens = [self.lemmatizer.lemmatize(word) for word in tokens if word not in self.stop_words]
        return ' '.join(tokens)
    
    def extract_features(self, texts):
        """Extract features from preprocessed texts"""
        # Preprocess all texts
        preprocessed_texts = [self.preprocess_text(text) for text in texts]
        
        # Additional features can be extracted here
        # For example: text length, counts of specific keywords, etc.
        text_lengths = [len(text.split()) for text in preprocessed_texts]
        
        return preprocessed_texts, text_lengths
    
    def train(self, data_path, label_column='is_depressed', text_column='text'):
        """Train the depression detection model"""
        # Load dataset
        df = pd.read_csv(data_path)
        
        # Print dataset info for debugging
        print(f"Dataset loaded with {len(df)} samples")
        class_counts = df[label_column].value_counts()
        print(f"Class distribution: {class_counts.to_dict()}")
        
        # Extract features
        texts = df[text_column].astype(str).values
        preprocessed_texts, text_lengths = self.extract_features(texts)
        
        # Create additional features DataFrame
        additional_features = pd.DataFrame({
            'text_length': text_lengths
        })
        
        # Create TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(
            max_features=5000,
            ngram_range=(1, 3),
            min_df=2
        )
        
        # Transform texts to TF-IDF features
        X_text_features = self.vectorizer.fit_transform(preprocessed_texts)
        
        # Combine with additional features
        X = np.hstack((
            X_text_features.toarray(),
            additional_features.values
        ))
        
        # Get labels
        y = df[label_column].values
        
        # Split data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        # Find the minimum number of samples in any class
        min_samples = min(np.bincount(y_train))
        
        # Choose cv value based on the minimum number of samples
        # Ensure we don't use more folds than samples in the smallest class
        n_splits = min(3, min_samples)
        print(f"Using {n_splits}-fold cross-validation (minimum class has {min_samples} samples)")
        
        # Define models to try
        models = {
            'RandomForest': RandomForestClassifier(random_state=42),
            'SVM': SVC(probability=True, random_state=42)
        }
        
        # Define parameters for grid search
        params = {
            'RandomForest': {
                'n_estimators': [100],  # Simplified parameters for small dataset
                'max_depth': [None, 10],
                'min_samples_split': [2]
            },
            'SVM': {
                'C': [1],  # Simplified parameters for small dataset
                'kernel': ['linear', 'rbf'],
                'gamma': ['scale']
            }
        }
        
        # Train and evaluate each model
        best_model = None
        best_score = 0
        best_model_name = ''
        
        for model_name, model in models.items():
            print(f"\nTraining {model_name}...")
            # Grid search for best parameters
            grid_search = GridSearchCV(
                model, 
                params[model_name],
                cv=n_splits,  # Use adaptive number of splits
                scoring='f1',
                n_jobs=-1
            )
            
            grid_search.fit(X_train, y_train)
            
            # Evaluate on test set
            y_pred = grid_search.predict(X_test)
            score = accuracy_score(y_test, y_pred)
            
            print(f"\n{model_name} Results:")
            print(f"Best parameters: {grid_search.best_params_}")
            print(f"Accuracy: {score:.4f}")
            print(classification_report(y_test, y_pred))
            
            # Save confusion matrix
            cm = confusion_matrix(y_test, y_pred)
            plt.figure(figsize=(8, 6))
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
            plt.title(f'Confusion Matrix - {model_name}')
            plt.ylabel('True Label')
            plt.xlabel('Predicted Label')
            plt.savefig(f'confusion_matrix_{model_name}.png')
            
            # Keep track of the best model
            if score > best_score:
                best_score = score
                best_model = grid_search.best_estimator_
                best_model_name = model_name
        
        print(f"\nBest model: {best_model_name} with accuracy {best_score:.4f}")
        self.model = best_model
        
        # Final evaluation on the test set
        y_pred = self.model.predict(X_test)
        print("\nFinal Evaluation:")
        print(classification_report(y_test, y_pred))
        
        return {
            'accuracy': accuracy_score(y_test, y_pred),
            'classification_report': classification_report(y_test, y_pred, output_dict=True),
            'best_model': best_model_name,
            'best_parameters': grid_search.best_params_
        }
    
    def save_model(self, model_path='depression_model.joblib'):
        """Save the trained model to disk"""
        if self.model is not None and self.vectorizer is not None:
            model_data = {
                'model': self.model,
                'vectorizer': self.vectorizer
            }
            joblib.dump(model_data, model_path)
            print(f"Model saved to {model_path}")
        else:
            print("Model not trained yet")
    
    def load_model(self, model_path='depression_model.joblib'):
        """Load a trained model from disk"""
        try:
            model_data = joblib.load(model_path)
            self.model = model_data['model']
            self.vectorizer = model_data['vectorizer']
            print(f"Model loaded from {model_path}")
        except Exception as e:
            print(f"Error loading model: {str(e)}")
            
    def predict(self, texts):
        """Predict depression probability for new texts"""
        if self.model is None or self.vectorizer is None:
            raise ValueError("Model not trained or loaded yet")
        
        # Extract features
        preprocessed_texts, text_lengths = self.extract_features(texts)
        
        # Transform texts to TF-IDF features
        X_text_features = self.vectorizer.transform(preprocessed_texts)
        
        # Create additional features
        additional_features = np.array(text_lengths).reshape(-1, 1)
        
        # Combine features
        X = np.hstack((
            X_text_features.toarray(),
            additional_features
        ))
        
        # Make predictions
        y_pred = self.model.predict(X)
        
        # Get probabilities if available
        try:
            y_prob = self.model.predict_proba(X)[:, 1]
        except:
            y_prob = None
            
        return {
            'predictions': y_pred.tolist(),
            'probabilities': y_prob.tolist() if y_prob is not None else None
        }