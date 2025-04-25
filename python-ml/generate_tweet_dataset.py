import random
import pandas as pd

# Define lists of phrases for depressed and non-depressed tweets
depressed_phrases = [
    "I can't stop crying", "I'm so tired but I can't sleep", "Nothing brings me joy anymore",
    "I hate myself so much", "Everyone would be better off without me", "It's all my fault",
    "I feel so alone even in a crowd", "I can't see a future for myself", "Why am I never good enough?",
    "I just want the pain to stop"
]

non_depressed_phrases = [
    "Had a great day today", "Feeling energized and positive", "Learning something new every day",
    "Enjoying the little things in life", "Thankful for all the good in my life", "Making progress every day",
    "Feeling at peace with myself", "Beautiful sunshine today", "Went for a walk and it lifted my spirits",
    "Got a promotion at work"
]

# Emoji lists
positive_emojis = ["😊", "✨", "😁", "❤️", "👍", "😄"]
negative_emojis = ["😞", "💔", "😢", "😭", "😔", "😔"]

# Function to generate a single tweet
def generate_tweet(is_depressed):
    if is_depressed:
        text = random.choice(depressed_phrases)
        emoji = random.choice(negative_emojis)
    else:
        text = random.choice(non_depressed_phrases)
        emoji = random.choice(positive_emojis)
    
    # Optionally add a hashtag to the tweet
    hashtags = ["#life", "#mentalhealth", "#gratitude", "#depression", "#blessed", "#happy"]
    if random.random() > 0.7:
        text += f" {random.choice(hashtags)}"
    
    text += f" {emoji}"
    return text

# Generate dataset
def generate_dataset(size):
    data = []
    for _ in range(size):
        is_depressed = random.choice([0, 1])  # Randomly decide if the tweet is depressed or not
        tweet = generate_tweet(is_depressed)
        data.append({"text": tweet, "is_depressed": is_depressed})
    return data

# Generate 10,000 samples
dataset_size = 10000
dataset = generate_dataset(dataset_size)

# Save the dataset to a CSV file
df = pd.DataFrame(dataset)
df.to_csv("synthetic_twitter_dataset.csv", index=False)

print(f"Generated a dataset with {dataset_size} samples and saved it as 'synthetic_twitter_dataset.csv'.")