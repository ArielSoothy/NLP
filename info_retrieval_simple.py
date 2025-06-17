from transformers import AutoTokenizer, AutoModel
import torch
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Use smaller, faster model
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")
model = AutoModel.from_pretrained("distilbert-base-uncased")

def compute_embedding(text):
    """Compute DistilBERT embedding for text"""
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
        embeddings = outputs.last_hidden_state.mean(dim=1)
    return embeddings.numpy()

# Sample Wikipedia-like articles for testing
sample_articles = [
    "Leonardo DiCaprio is an American actor and film producer known for his roles in Titanic, Inception, and The Revenant. He won an Academy Award for Best Actor.",
    "France is a country in Western Europe known for its culture, cuisine, and landmarks like the Eiffel Tower. Paris is the capital city.",
    "Python is a high-level programming language known for its simplicity and readability. It's widely used in data science and web development.",
    "Deep learning is a subset of machine learning that uses neural networks with multiple layers to learn complex patterns in data.",
    "The Renaissance was a period of cultural rebirth in Europe during the 14th to 17th centuries, marked by advances in art, science, and literature.",
    "Climate change refers to long-term shifts in global temperatures and weather patterns, primarily caused by human activities.",
    "Basketball is a sport played by two teams of five players each, where the objective is to score points by shooting a ball through a hoop.",
    "Artificial intelligence is the simulation of human intelligence in machines programmed to think and learn like humans.",
    "The Pacific Ocean is the largest ocean on Earth, covering about one-third of the planet's surface area.",
    "Shakespeare was an English playwright and poet widely regarded as the greatest writer in the English language."
]

def find_most_relevant_article(query_embedding, articles, max_num_of_articles=None):
    """Find most relevant article using cosine similarity"""
    most_relevant_article = None
    max_similarity = -1
    
    # Limit articles if specified
    if max_num_of_articles:
        articles = articles[:max_num_of_articles]
    
    for i, article in enumerate(articles):
        # Compute article embedding
        article_embedding = compute_embedding(article)
        
        # Calculate cosine similarity
        similarity = cosine_similarity(query_embedding, article_embedding)[0][0]
        
        # Update if this is the best match
        if similarity > max_similarity:
            max_similarity = similarity
            most_relevant_article = article
            
        print(f"Article {i+1}: Similarity = {similarity:.4f}")
    
    return most_relevant_article, max_similarity

# Test queries
queries = ["Leonardo DiCaprio", "France", "Python", "Deep Learning"]

print("="*60)
print("Part 3.2 - Information Retrieval Results")
print("="*60)

for i, query in enumerate(queries, 1):
    print(f"\n{i}. Query: '{query}'")
    print("-" * 40)
    
    # Compute query embedding
    query_embedding = compute_embedding(query)
    
    # Find most relevant article
    article, similarity = find_most_relevant_article(query_embedding, sample_articles)
    
    print(f"\nMost Relevant Article (Similarity: {similarity:.4f}):")
    print(f"'{article}'")
    print()

print("="*60)
print("PART 3 - INFORMATION RETRIEVAL COMPLETED!")
print("="*60)
