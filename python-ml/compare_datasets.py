import pandas as pd
import os
from models.depression_model import DepressionDetectionModel

def train_and_evaluate(data_path, label_column, text_column):
    # Initialize the model
    model = DepressionDetectionModel()
    
    # Train the model
    print(f"Starting training with dataset: {data_path}")
    results = model.train(
        data_path=data_path,
        label_column=label_column,
        text_column=text_column
    )
    
    # Return the training results
    return results

def compare_datasets():
    # Paths to the datasets
    original_dataset_path = 'data/depression_dataset.csv'
    larger_dataset_path = 'data/twitter_dataset.csv'
    
    # Ensure both datasets exist
    if not os.path.exists(original_dataset_path):
        print(f"Error: Original dataset not found at {original_dataset_path}")
        return
    if not os.path.exists(larger_dataset_path):
        print(f"Error: Larger dataset not found at {larger_dataset_path}")
        return

    # Train and evaluate on the original dataset
    print("Training on the original dataset...")
    original_results = train_and_evaluate(
        data_path=original_dataset_path,
        label_column='is_depressed',
        text_column='text'
    )

    # Train and evaluate on the larger dataset
    print("\nTraining on the larger dataset...")
    larger_results = train_and_evaluate(
        data_path=larger_dataset_path,
        label_column='is_depressed',
        text_column='text'
    )

    # Compare results
    print("\nComparison of Results:")
    print(f"Accuracy with small dataset: {original_results['accuracy']:.4f}")
    print(f"Accuracy with larger dataset: {larger_results['accuracy']:.4f}")
    print("\nClassification Report (Original Dataset):")
    for label, metrics in original_results['classification_report'].items():
        if isinstance(metrics, dict):
            print(f"  {label}:")
            for metric_name, value in metrics.items():
                if isinstance(value, float):
                    print(f"    {metric_name}: {value:.4f}")
                else:
                    print(f"    {metric_name}: {value}")
    print("\nClassification Report (Larger Dataset):")
    for label, metrics in larger_results['classification_report'].items():
        if isinstance(metrics, dict):
            print(f"  {label}:")
            for metric_name, value in metrics.items():
                if isinstance(value, float):
                    print(f"    {metric_name}: {value:.4f}")
                else:
                    print(f"    {metric_name}: {value}")
    
    # Best model comparison
    print("\nBest Model Details:")
    print(f"Original Dataset - Best Model: {original_results['best_model']}")
    print(f"Larger Dataset - Best Model: {larger_results['best_model']}")
    print(f"Original Dataset - Best Parameters: {original_results['best_parameters']}")
    print(f"Larger Dataset - Best Parameters: {larger_results['best_parameters']}")

if __name__ == "__main__":
    compare_datasets()