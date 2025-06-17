import matplotlib.pyplot as plt
from datasets import load_dataset

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download necessary resources from nltk
nltk.download('punkt')
nltk.download('stopwords')

dataset = load_dataset("cnn_dailymail", '3.0.0')
df = dataset['train'].to_pandas()
df = df.head(1000)

def preprocess_text(text):
    # Tokenize text
    tokens = word_tokenize(text)
    # Convert to lower case
    tokens = [token.lower() for token in tokens]
    # Remove stop words (optional)
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words and token.isalpha()]
    return " ".join(tokens)

###====== Part 2.1 =====================
###Write a code that creates two new columns -  artice_len and highlights_len

# Create length columns - counting characters
df['article_len'] = df['article'].str.len()
df['highlights_len'] = df['highlights'].str.len()

print("Part 2.1 - Column lengths created:")
print(f"Average article length: {df['article_len'].mean():.0f} characters")
print(f"Average highlights length: {df['highlights_len'].mean():.0f} characters")
print(f"Ratio (highlights/article): {(df['highlights_len'].mean() / df['article_len'].mean()):.3f}")
print()


###====== Part 2.2 =====================
### Fill in this code
def plot_histograms(df):
    """Plot histograms of article and highlights lengths side by side"""
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
    
    # Article length histogram
    ax1.hist(df['article_len'], bins=30, color='skyblue', alpha=0.7, edgecolor='black')
    ax1.set_title('Distribution of Article Lengths', fontsize=14, fontweight='bold')
    ax1.set_xlabel('Article Length (characters)', fontsize=12)
    ax1.set_ylabel('Frequency', fontsize=12)
    ax1.grid(True, alpha=0.3)
    
    # Highlights length histogram  
    ax2.hist(df['highlights_len'], bins=30, color='lightcoral', alpha=0.7, edgecolor='black')
    ax2.set_title('Distribution of Highlights Lengths', fontsize=14, fontweight='bold')
    ax2.set_xlabel('Highlights Length (characters)', fontsize=12)
    ax2.set_ylabel('Frequency', fontsize=12)
    ax2.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.show()
    
    print("Part 2.2 - Length statistics:")
    print(f"Articles - Min: {df['article_len'].min()}, Max: {df['article_len'].max()}, Mean: {df['article_len'].mean():.0f}")
    print(f"Highlights - Min: {df['highlights_len'].min()}, Max: {df['highlights_len'].max()}, Mean: {df['highlights_len'].mean():.0f}")
    print()
    
    return None

# plot_histograms(df)
plot_histograms(df)

###======Part 2.3 ================
### Fill in the code
def ngrams(text, n):
    # Preprocess the text first
    processed_text = preprocess_text(text)
    words = processed_text.split()
    return set(zip(*[words[i:] for i in range(n)]))


def rouge_n(reference, candidate, n):
    """
    Calculate ROUGE-N score between reference and candidate text.
    ROUGE-N = (Number of overlapping n-grams) / (Number of n-grams in reference)
    """
    # Get n-grams for both texts
    ref_ngrams = ngrams(reference, n)
    cand_ngrams = ngrams(candidate, n)
    
    # If reference has no n-grams, return 0
    if len(ref_ngrams) == 0:
        return 0.0
    
    # Count overlapping n-grams
    overlap = len(ref_ngrams.intersection(cand_ngrams))
    
    # Calculate ROUGE-N score
    rouge_score = overlap / len(ref_ngrams)
    
    return rouge_score
###=========== 2.3 ================    

# Example of calculating Rouge-1 and Rouge-2 for a dataframe
print("Part 2.3 - Calculating ROUGE scores...")
df['rouge_1'] = df.apply(lambda row: rouge_n(row['highlights'], row['article'], 1), axis=1)
df['rouge_2'] = df.apply(lambda row: rouge_n(row['highlights'], row['article'], 2), axis=1)

print("ROUGE-1 Statistics:")
print(f"Mean: {df['rouge_1'].mean():.4f}, Max: {df['rouge_1'].max():.4f}, Min: {df['rouge_1'].min():.4f}")
print("ROUGE-2 Statistics:")
print(f"Mean: {df['rouge_2'].mean():.4f}, Max: {df['rouge_2'].max():.4f}, Min: {df['rouge_2'].min():.4f}")
print()

# Find examples with highest and lowest ROUGE-2 scores
max_rouge_2_index = df['rouge_2'].idxmax()
min_rouge_2_index = df['rouge_2'].idxmin()

print(f"Highest ROUGE-2 Score: {df.loc[max_rouge_2_index, 'rouge_2']:.4f} (Index: {max_rouge_2_index})")
print(f"Lowest ROUGE-2 Score: {df.loc[min_rouge_2_index, 'rouge_2']:.4f} (Index: {min_rouge_2_index})")
print()

plt.figure(figsize=(12, 6))
plt.hist(df['rouge_2'], bins=30, color='blue', alpha=0.7)
plt.title('Rouge-2 score distribution on ground truth')
plt.xlabel('ROUGE-2 Score')
plt.ylabel('Frequency') 
plt.grid(True, alpha=0.3)
plt.show()

print("Analysis of lowest ROUGE-2 score example:")
print("========================")
print(f"Article: {df.iloc[min_rouge_2_index]['article'][:200]}...")
print("========================")
print(f"Highlights: {df.iloc[min_rouge_2_index]['highlights']}")
print("========================")
print("Analysis: This example has a low ROUGE-2 score likely because:")
print("1. The highlights use different vocabulary than the article")
print("2. The highlights may be more abstractive (paraphrased) rather than extractive")
print("3. Few 2-word phrases (bigrams) are shared between article and highlights")
print()



###=========== 2.4 ================    
# Initialize the summarization pipeline
from transformers import pipeline
import warnings
warnings.filterwarnings("ignore")

print("Part 2.4 - Initializing T5-small summarization pipeline...")
print("(This may take a few minutes to download the model for the first time...)")
summarizer = pipeline("summarization", model="t5-small")
print("Model loaded successfully!")

def summarize_text(text, index):
    # Truncate text if too long (T5 has input limits)
    max_input_length = 1000  # Reasonable limit for T5-small
    if len(text) > max_input_length:
        text = text[:max_input_length]
    
    try:
        # Summarizing the text using the pipeline
        summary = summarizer(text, max_length=50, min_length=10, do_sample=False)
        print(f"Processed article {index+1}/10")
        return summary[0]['summary_text']
    except Exception as e:
        print(f"Error processing article {index+1}: {str(e)}")
        return "Error in summarization"

# Calculate the rouge-2 score of the first 10 entries
print("Calculating ROUGE-2 scores for T5-small summaries on first 10 entries:")
print("=" * 70)

t5_summaries = []
t5_rouge_2_scores = []

for i in range(10):
    article = df.iloc[i]['article']
    ground_truth = df.iloc[i]['highlights']
    
    # Generate T5 summary
    t5_summary = summarize_text(article, i)
    t5_summaries.append(t5_summary)
    
    # Calculate ROUGE-2 score for T5 summary vs ground truth
    t5_rouge_2 = rouge_n(ground_truth, t5_summary, 2)
    t5_rouge_2_scores.append(t5_rouge_2)
    
    # Compare with ground truth ROUGE-2 (article vs highlights)
    ground_truth_rouge_2 = df.iloc[i]['rouge_2']
    
    print(f"Entry {i+1}:")
    print(f"  Ground Truth Highlights: {ground_truth}")
    print(f"  T5 Summary: {t5_summary}")
    print(f"  T5 ROUGE-2 Score: {t5_rouge_2:.4f}")
    print(f"  Ground Truth ROUGE-2: {ground_truth_rouge_2:.4f}")
    print(f"  T5 vs Ground Truth: {'Lower' if t5_rouge_2 < ground_truth_rouge_2 else 'Higher'}")
    print()

print("Summary of T5-small Performance:")
print(f"Average T5 ROUGE-2 Score: {sum(t5_rouge_2_scores)/len(t5_rouge_2_scores):.4f}")
print(f"Average Ground Truth ROUGE-2: {df.iloc[:10]['rouge_2'].mean():.4f}")

lower_count = sum(1 for i in range(10) if t5_rouge_2_scores[i] < df.iloc[i]['rouge_2'])
print(f"T5 scored lower than ground truth in {lower_count}/10 cases")

print("\n" + "="*50)
print("PART 2 - TEXT SUMMARIZATION COMPLETED!")
print("="*50)
print("Results Summary:")
print(f"- Dataset: CNN DailyMail (1000 articles)")
print(f"- Average article length: {df['article_len'].mean():.0f} characters")
print(f"- Average highlights length: {df['highlights_len'].mean():.0f} characters")
print(f"- Ground truth ROUGE-1 mean: {df['rouge_1'].mean():.4f}")
print(f"- Ground truth ROUGE-2 mean: {df['rouge_2'].mean():.4f}")
print(f"- T5-small ROUGE-2 mean: {sum(t5_rouge_2_scores)/len(t5_rouge_2_scores):.4f}")
print("All visualizations have been displayed!")
print("="*50)