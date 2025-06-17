from transformers import AutoTokenizer, TFAutoModel
import tensorflow as tf
from datasets import load_dataset
from sklearn.metrics.pairwise import cosine_similarity
from tqdm import tqdm


# Initialize tokenizer and model for DistilBERT
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-multilingual-cased")
model = TFAutoModel.from_pretrained("distilbert-base-multilingual-cased")

def compute_embedding(text):
    encoded_input = tokenizer(text, return_tensors="tf", padding=True, truncation=True, max_length=512)
    outputs = model(**encoded_input)
    embeddings = tf.reduce_mean(outputs.last_hidden_state, axis=1)
    return embeddings.numpy()

# Load a subset of the wikipedia dataset (assuming structure and availability)
dataset = load_dataset("Cohere/wikipedia-22-12-en-embeddings",split="train", streaming=True)

#========Exercise 3.1 =========== 
# Fill in the following code
# ===============================
def find_most_relevant_article(query_embedding, dataset, max_num_of_articles=None):
    most_relevant_article = None
    max_similarity = -1
    
    # Use iterator for streaming dataset
    dataset_iter = iter(dataset)
    count = 0
    
    for article in dataset_iter:
        # Stop if we've reached the max number of articles
        if max_num_of_articles and count >= max_num_of_articles:
            break
            
        # Get article text and compute embedding
        article_text = article.get('text', '')
        if not article_text:  # Skip empty articles
            continue
            
        article_embedding = compute_embedding(article_text)
        
        # Calculate cosine similarity
        similarity = cosine_similarity(query_embedding, article_embedding)[0][0]
        
        # Update if this is the best match so far
        if similarity > max_similarity:
            max_similarity = similarity
            most_relevant_article = article_text
            
        count += 1
        
        # Progress indicator
        if count % 100 == 0:
            print(f"Processed {count} articles, best similarity so far: {max_similarity:.4f}")
    
    return most_relevant_article, max_similarity
#========End Exercise 3.1 ===========


# Example queries for 3.2
queries = [
    "Leonardo DiCaprio",
    "France", 
    "Python",
    "Deep Learning"
]

print("="*60)
print("Part 3.2 - Finding most relevant articles for queries")
print("="*60)

# Process each query
for i, query in enumerate(queries, 1):
    print(f"\n{i}. Query: '{query}'")
    print("-" * 40)
    
    # Compute embedding for query
    query_embedding = compute_embedding(query)
    print(f"Query embedding shape: {query_embedding.shape}")
    
    # Find most relevant article (first 1000 rows)
    article, similarity = find_most_relevant_article(query_embedding, dataset, 1000)
    
    print(f"Most relevant article (similarity: {similarity:.4f}):")
    print(f"{article[:200]}..." if len(article) > 200 else article)
    print()

print("="*60)
print("PART 3 - INFORMATION RETRIEVAL COMPLETED!")
print("="*60)