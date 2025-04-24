import pandas as pd
import os

# Create directory if it doesn't exist
os.makedirs('data', exist_ok=True)

# Sample data - in a real project, use a comprehensive dataset
sample_data = {
    'text': [
        "I feel so worthless and tired all the time, nothing brings me joy anymore.",
        "Had a great day today! Everything is going well and I'm feeling happy!",
        "I can't stop crying, I don't know what's wrong with me. It's been weeks of this.",
        "Just finished an amazing workout! Feeling energized and positive.",
        "Why does everything feel so empty? I don't see the point in trying anymore.",
        "Celebrated my birthday with friends, felt so loved and appreciated!",
        "Another sleepless night. The thoughts won't stop and I'm exhausted.",
        "Beautiful sunshine today, went for a walk and it lifted my spirits.",
        "I'm a failure at everything. Everyone would be better off without me.",
        "Just got a promotion at work! All the hard work is paying off!"
    ],
    'is_depressed': [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]  # 1 for depressed, 0 for not depressed
}

# Create DataFrame and save to CSV
df = pd.DataFrame(sample_data)
df.to_csv('data/depression_dataset.csv', index=False)
print("Sample dataset created at data/depression_dataset.csv")