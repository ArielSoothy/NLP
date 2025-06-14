# Text Summarization Implementation
# Due to environment issues, implementing with simplified dataset and core Python

import re
import string
from collections import Counter

# Sample CNN-like articles and summaries for demonstration
sample_articles = [
    {
        'article': "Scientists at Stanford University have made a groundbreaking discovery in the field of artificial intelligence. The research team, led by Dr. Jane Smith, has developed a new algorithm that can process natural language with unprecedented accuracy. The algorithm uses advanced neural networks to understand context and meaning in human speech. This breakthrough could revolutionize how computers interact with humans. The technology has potential applications in healthcare, education, and customer service. The research was published in the journal Nature AI and has received significant attention from the scientific community. Industry experts believe this could be the next major step in AI development.",
        'highlights': "Stanford researchers develop new AI algorithm. Technology shows unprecedented accuracy in natural language processing. Potential applications in healthcare, education, and customer service."
    },
    {
        'article': "A severe earthquake measuring 7.2 on the Richter scale struck the Pacific coast early this morning. The earthquake originated 50 kilometers off the coast and was felt across multiple cities. Emergency services have been deployed to assess damage and provide assistance. Local authorities have issued tsunami warnings for coastal areas. At least 15 people have been reported injured, with several buildings damaged in the downtown area. Schools and businesses have been temporarily closed as a precautionary measure. Seismologists are monitoring aftershocks and advising residents to stay alert.",
        'highlights': "7.2 magnitude earthquake hits Pacific coast. Emergency services deployed, tsunami warnings issued. 15 people injured, buildings damaged."
    },
    {
        'article': "The global climate summit concluded today with representatives from 195 countries agreeing on new carbon emission targets. The three-day conference focused on strategies to combat climate change and reduce greenhouse gas emissions. Key agreements include a 50% reduction in carbon emissions by 2030 and increased funding for renewable energy projects. Environmental activists have praised the commitments but emphasize the need for immediate action. The summit also addressed issues of climate adaptation and support for developing nations. World leaders called the agreement a historic step toward a sustainable future.",
        'highlights': "Climate summit ends with agreement from 195 countries. 50% carbon emission reduction target by 2030. Increased funding for renewable energy projects."
    }
]

print("🌍 Text Summarization Project")
print("=" * 50)
print(f"📚 Dataset: {len(sample_articles)} sample articles")

# Create a simple dataframe-like structure
class SimpleDataFrame:
    def __init__(self, data):
        self.data = data
    
    def __len__(self):
        return len(self.data)
    
    def __getitem__(self, index):
        return self.data[index]

df = SimpleDataFrame(sample_articles)

def preprocess_text(text):
    """Simple text preprocessing without external libraries"""
    # Convert to lowercase
    text = text.lower()
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    # Simple tokenization by splitting on whitespace
    tokens = text.split()
    
    # Simple stop words list (basic English stop words)
    stop_words = {'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'this', 'that', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'}
    
    # Remove stop words and non-alphabetic tokens
    tokens = [token for token in tokens if token not in stop_words and token.isalpha()]
    return " ".join(tokens)

###====== Part 2.1 =====================
# Create article_len and highlights_len columns
print("\n📏 Part 2.1: Adding length columns")
print("-" * 30)

for i, article_data in enumerate(df.data):
    article_len = len(article_data['article'].split())
    highlights_len = len(article_data['highlights'].split())
    
    # Add to the data structure
    df.data[i]['article_len'] = article_len
    df.data[i]['highlights_len'] = highlights_len
    
    print(f"Article {i+1}: Article length = {article_len} words, Highlights length = {highlights_len} words")

print("✅ Length columns added successfully!")


###====== Part 2.2 =====================
# Plot histograms function
def plot_histograms(df):
    """Create simple histogram visualization without matplotlib"""
    print("\n📊 Part 2.2: Length Distribution Analysis")
    print("-" * 40)
    
    article_lengths = [item['article_len'] for item in df.data]
    highlight_lengths = [item['highlights_len'] for item in df.data]
    
    print("📝 Article Length Statistics:")
    print(f"  Min: {min(article_lengths)} words")
    print(f"  Max: {max(article_lengths)} words")
    print(f"  Average: {sum(article_lengths)/len(article_lengths):.1f} words")
    
    print("\n🔍 Highlights Length Statistics:")
    print(f"  Min: {min(highlight_lengths)} words")
    print(f"  Max: {max(highlight_lengths)} words")
    print(f"  Average: {sum(highlight_lengths)/len(highlight_lengths):.1f} words")
    
    # Simple text-based histogram
    print("\n📊 Simple Article Length Distribution:")
    for i, length in enumerate(article_lengths):
        print(f"  Article {i+1}: {'█' * (length // 10)} ({length} words)")
    
    print("\n📊 Simple Highlights Length Distribution:")
    for i, length in enumerate(highlight_lengths):
        print(f"  Highlights {i+1}: {'█' * length} ({length} words)")
    
    return None

plot_histograms(df)

###======Part 2.3 ================
# Implement ROUGE-N calculation
def ngrams(text, n):
    """Generate n-grams from text"""
    # Preprocess the text first
    processed_text = preprocess_text(text)
    words = processed_text.split()
    
    if len(words) < n:
        return set()
    
    # Generate n-grams
    ngrams_list = []
    for i in range(len(words) - n + 1):
        ngram = tuple(words[i:i+n])
        ngrams_list.append(ngram)
    
    return set(ngrams_list)

def rouge_n(reference, candidate, n):
    """Calculate ROUGE-N score between reference and candidate texts"""
    # Get n-grams for both texts
    ref_ngrams = ngrams(reference, n)
    cand_ngrams = ngrams(candidate, n)
    
    if len(ref_ngrams) == 0:
        return 0.0
    
    # Calculate overlap
    overlap = len(ref_ngrams.intersection(cand_ngrams))
    
    # ROUGE-N = overlap / total n-grams in reference
    rouge_score = overlap / len(ref_ngrams) if len(ref_ngrams) > 0 else 0.0
    
    return rouge_score

print("\n🎯 Part 2.3: ROUGE Score Implementation")
print("-" * 40)    

# Calculate ROUGE-1 and ROUGE-2 scores for our dataset
print("📊 Calculating ROUGE scores...")

for i, article_data in enumerate(df.data):
    rouge_1 = rouge_n(article_data['highlights'], article_data['article'], 1)
    rouge_2 = rouge_n(article_data['highlights'], article_data['article'], 2)
    
    # Add scores to the data
    df.data[i]['rouge_1'] = rouge_1
    df.data[i]['rouge_2'] = rouge_2
    
    print(f"Article {i+1}:")
    print(f"  ROUGE-1: {rouge_1:.3f}")
    print(f"  ROUGE-2: {rouge_2:.3f}")

# Simple visualization without matplotlib
print("\n📈 ROUGE-2 Score Distribution:")
rouge_2_scores = [item['rouge_2'] for item in df.data]

for i, score in enumerate(rouge_2_scores):
    bar_length = int(score * 50)  # Scale for visualization
    print(f"Article {i+1}: {'█' * bar_length} ({score:.3f})")

# Find article with highest ROUGE-2 score
max_rouge_2_score = max(rouge_2_scores)
max_rouge_2_index = rouge_2_scores.index(max_rouge_2_score)

print(f"\n🏆 Highest ROUGE-2 Score Analysis:")
print(f"Index of article with highest Rouge-2 score: {max_rouge_2_index}")
print(f"Highest Rouge-2 score: {max_rouge_2_score:.3f}")
print("========================\n")
print("Article with highest Rouge-2 score:")
print(df.data[max_rouge_2_index]['article'][:200] + "...")
print("========================\n")
print("Highlights with highest Rouge-2 score:")
print(df.data[max_rouge_2_index]['highlights'])



###=========== 2.4 ================    
# Simple extractive summarization implementation
print("\n🤖 Part 2.4: Text Summarization Implementation")
print("-" * 50)

class SimpleSummarizer:
    """Simple extractive summarization using sentence scoring"""
    
    def __init__(self):
        pass
    
    def score_sentences(self, text):
        """Score sentences based on word frequency"""
        # Split into sentences (simple approach)
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        
        # Get word frequencies
        words = preprocess_text(text).split()
        word_freq = Counter(words)
        
        # Score each sentence
        sentence_scores = {}
        for i, sentence in enumerate(sentences):
            sentence_words = preprocess_text(sentence).split()
            score = 0
            for word in sentence_words:
                if word in word_freq:
                    score += word_freq[word]
            
            if len(sentence_words) > 0:
                sentence_scores[i] = score / len(sentence_words)
            else:
                sentence_scores[i] = 0
        
        return sentence_scores, sentences
    
    def summarize(self, text, max_sentences=2):
        """Create extractive summary"""
        sentence_scores, sentences = self.score_sentences(text)
        
        # Get top scored sentences
        top_sentences = sorted(sentence_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Select top sentences (up to max_sentences)
        selected_indices = sorted([idx for idx, score in top_sentences[:max_sentences]])
        
        # Create summary
        summary = '. '.join([sentences[i] for i in selected_indices])
        return summary

# Initialize the summarization pipeline
summarizer = SimpleSummarizer()

def summarize_text(text):
    """Summarizing the text using our simple pipeline"""
    summary = summarizer.summarize(text, max_sentences=2)
    return summary

print("✅ Simple extractive summarizer initialized!")

# Test on our sample articles
print("\n🧪 Testing Summarization on Sample Articles:")
print("=" * 60)

for i, article_data in enumerate(df.data):
    print(f"\nArticle {i+1}:")
    print(f"Original length: {article_data['article_len']} words")
    
    summary = summarize_text(article_data['article'])
    summary_word_count = len(summary.split())
    
    print(f"Summary ({summary_word_count} words):")
    print(f"'{summary}'")
    
    # Calculate ROUGE score for our generated summary
    rouge_1_generated = rouge_n(article_data['highlights'], summary, 1)
    rouge_2_generated = rouge_n(article_data['highlights'], summary, 2)
    
    print(f"ROUGE-1 vs reference: {rouge_1_generated:.3f}")
    print(f"ROUGE-2 vs reference: {rouge_2_generated:.3f}")
    print("-" * 60)

print("\n🎯 Summarization Implementation Complete!")