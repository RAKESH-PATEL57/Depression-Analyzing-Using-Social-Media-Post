import pandas as pd
import os
from models.depression_model import DepressionDetectionModel

def main():
    # Ensure directories exist
    os.makedirs('models/trained', exist_ok=True)
    
    # Set the path to your new larger dataset
    data_path = 'data/depression_dataset_500.csv'
    
    # Check if the new dataset exists, otherwise use the original one
    if not os.path.exists(data_path):
        data_path = 'data/depression_dataset.csv'
        print(f"Using original dataset at {data_path}")
        print("For better results, run generate_larger_dataset.py first to create a larger dataset")
    else:
        print(f"Using larger dataset at {data_path}")
    
    if not os.path.exists(data_path):
        print(f"Error: Dataset not found at {data_path}")
        print("Please download the depression dataset and place it in the data directory.")
        return
    
    # Initialize the model
    model = DepressionDetectionModel()
    
    # Train the model
    print("Starting model training...")
    results = model.train(
        data_path=data_path,
        label_column='is_depressed',  # Column containing depression labels (1=depressed, 0=not depressed)
        text_column='text'            # Column containing the text content
    )
    
    # Save the trained model
    model.save_model('models/trained/depression_model.joblib')
    
    # Print training results
    print(f"Training complete!")
    print(f"Accuracy: {results['accuracy']:.4f}")
    print("Classification Report:")
    for label, metrics in results['classification_report'].items():
        if isinstance(metrics, dict):
            print(f"  {label}:")
            for metric_name, value in metrics.items():
                if isinstance(value, float):
                    print(f"    {metric_name}: {value:.4f}")
                else:
                    print(f"    {metric_name}: {value}")
    
    print(f"\nBest model: {results['best_model']}")
    print(f"Best parameters: {results['best_parameters']}")
    print("\nModel saved to models/trained/depression_model.joblib")
    print("You can now start the API with 'python api.py'")

if __name__ == "__main__":
    main()