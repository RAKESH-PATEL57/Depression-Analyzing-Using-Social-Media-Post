import pandas as pd
import random
import os
from datetime import datetime

# Create directory if it doesn't exist
os.makedirs('data', exist_ok=True)

# Lists of phrases/words commonly associated with depression
depressive_phrases = [
    "I feel so worthless",
    "Nothing brings me joy anymore",
    "I can't stop crying",
    "Everything feels so empty",
    "I don't see the point in trying",
    "Another sleepless night",
    "The thoughts won't stop",
    "I'm exhausted all the time",
    "I'm a failure at everything",
    "Everyone would be better off without me",
    "I feel so alone even in a crowd",
    "I'm tired of pretending to be okay",
    "Nothing matters anymore",
    "I can't focus on anything",
    "Why am I never good enough?",
    "I hate myself so much",
    "I can't see a future for myself",
    "It's all my fault",
    "I'm a burden to everyone",
    "I feel numb inside",
    "I've lost interest in things I used to enjoy",
    "I'm so tired but I can't sleep",
    "Everything is overwhelming",
    "I just want the pain to stop",
    "Will this sadness ever end?",
    "I'm trapped in my own mind",
    "No one understands how I feel",
    "I'm sorry for being such a disappointment",
    "I can't remember the last time I was happy",
    "I don't deserve good things"
]

positive_phrases = [
    "Had a great day today",
    "Everything is going well",
    "I'm feeling happy",
    "Just finished an amazing workout",
    "Feeling energized and positive",
    "Celebrated with friends",
    "Felt so loved and appreciated",
    "Beautiful sunshine today",
    "Went for a walk and it lifted my spirits",
    "Got a promotion at work",
    "All the hard work is paying off",
    "So grateful for my friends",
    "Enjoying the little things in life",
    "Feeling motivated and inspired",
    "Making progress every day",
    "Excited about new opportunities",
    "Today was productive and fulfilling",
    "Thankful for all the good in my life",
    "Just had the best time with family",
    "Feeling confident and strong",
    "Found a new hobby that I love",
    "Taking time for self-care feels amazing",
    "Proud of what I've accomplished",
    "Learning something new every day",
    "The future looks bright",
    "Feeling at peace with myself",
    "Counting my blessings",
    "Surrounded by good people",
    "Making positive changes",
    "My heart is full of joy"
]

# Sentence connectors and fillers
connectors = [
    "and ", "because ", "but ", "so ", "yet ", "though ", "",
    "I think ", "I feel like ", "honestly, ", "lately, ",
    "these days ", "right now ", "sometimes ", "often ", ""
]

# Sentence endings
endings = [
    ".", "...", "!", "", " 😔", " 😞", " 💔", " 😢", " 😭", 
    " #mentalhealth", " #depression", " #anxiety", " #life", "",
    " 😊", " 😁", " ❤️", " ✨", " #blessed", " #gratitude", " #happy", ""
]

# Tweet prefixes
prefixes = [
    "Just thinking that ", "I can't believe ", "Why is it that ",
    "Does anyone else feel like ", "I hate when ", "I love when ",
    "Today I realized ", "Sometimes I wonder if ", "Always remember that ",
    "Never forget that ", "I wish ", "Is it normal to feel like ",
    "Can't stop thinking about how ", "Just realized ", "",
    "Not sure why ", "It's funny how ", "It's sad that ", "",
    "I'm so tired of ", "I'm so happy about ", "I'm grateful that ", ""
]

def generate_depressive_tweet():
    """Generate a synthetic depressive tweet"""
    prefix = random.choice(prefixes)
    base = random.choice(depressive_phrases)
    connector = random.choice(connectors)
    
    # 30% chance to add a second depressive phrase
    if random.random() < 0.3:
        second_phrase = random.choice([p for p in depressive_phrases if p != base])
        base = f"{base} {connector}{second_phrase.lower()}"
    
    ending = random.choice(endings)
    
    # Combine all parts
    tweet = f"{prefix}{base}{ending}"
    
    # Clean up double spaces
    tweet = tweet.replace("  ", " ")
    
    return tweet

def generate_positive_tweet():
    """Generate a synthetic positive tweet"""
    prefix = random.choice(prefixes)
    base = random.choice(positive_phrases)
    connector = random.choice(connectors)
    
    # 30% chance to add a second positive phrase
    if random.random() < 0.3:
        second_phrase = random.choice([p for p in positive_phrases if p != base])
        base = f"{base} {connector}{second_phrase.lower()}"
    
    ending = random.choice(endings)
    
    # Combine all parts
    tweet = f"{prefix}{base}{ending}"
    
    # Clean up double spaces
    tweet = tweet.replace("  ", " ")
    
    return tweet

# Generate balanced dataset of 500 tweets
tweets = []
is_depressed = []

for _ in range(250):
    tweets.append(generate_depressive_tweet())
    is_depressed.append(1)
    
    tweets.append(generate_positive_tweet())
    is_depressed.append(0)

# Create DataFrame
df = pd.DataFrame({
    'text': tweets,
    'is_depressed': is_depressed
})

# Shuffle the dataset
df = df.sample(frac=1, random_state=42).reset_index(drop=True)

# Save to CSV
df.to_csv('data/depression_dataset_500.csv', index=False)

print(f"Generated dataset with {len(df)} tweets (50% depressed, 50% not depressed)")
print(f"Saved to data/depression_dataset_500.csv")

# Display a few examples
print("\nExample depressed tweets:")
for tweet in df[df['is_depressed'] == 1]['text'].head(3).tolist():
    print(f"- {tweet}")
    
print("\nExample non-depressed tweets:")
for tweet in df[df['is_depressed'] == 0]['text'].head(3).tolist():
    print(f"- {tweet}")