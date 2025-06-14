# Information Retrieval Implementation
# Simple document search and retrieval system

import re
import string
import math
from collections import Counter, defaultdict

print("🔍 Information Retrieval System")
print("=" * 50)

# Sample document collection for demonstration
documents = [
    {
        'id': 1,
        'title': 'Introduction to Machine Learning',
        'content': 'Machine learning is a subset of artificial intelligence that focuses on algorithms and statistical models. It enables computers to learn and improve from experience without being explicitly programmed. Common applications include image recognition, natural language processing, and recommendation systems.'
    },
    {
        'id': 2,
        'title': 'Deep Learning Fundamentals',
        'content': 'Deep learning is a specialized area of machine learning that uses neural networks with multiple layers. These networks can automatically learn representations from data. Deep learning has revolutionized fields like computer vision, speech recognition, and natural language understanding.'
    },
    {
        'id': 3,
        'title': 'Natural Language Processing Basics',
        'content': 'Natural language processing combines computational linguistics with machine learning to help computers understand human language. Key tasks include text classification, sentiment analysis, machine translation, and information extraction. NLP is essential for chatbots and virtual assistants.'
    },
    {
        'id': 4,
        'title': 'Computer Vision Applications',
        'content': 'Computer vision enables machines to interpret visual information from the world. Applications include facial recognition, autonomous vehicles, medical imaging, and quality control in manufacturing. Modern computer vision relies heavily on convolutional neural networks.'
    },
    {
        'id': 5,
        'title': 'Artificial Intelligence Ethics',
        'content': 'AI ethics addresses the moral implications of artificial intelligence systems. Important considerations include bias in algorithms, privacy concerns, job displacement, and the need for transparency in AI decision-making. Responsible AI development requires careful attention to these ethical issues.'
    },
    {
        'id': 6,
        'title': 'Data Science Methodology',
        'content': 'Data science combines statistical analysis, machine learning, and domain expertise to extract insights from data. The process typically involves data collection, cleaning, exploration, modeling, and visualization. Data scientists use tools like Python, R, and SQL to analyze large datasets.'
    }
]

print(f"📚 Document Collection: {len(documents)} documents loaded")

def preprocess_text(text):
    """Clean and preprocess text for information retrieval"""
    # Convert to lowercase
    text = text.lower()
    # Remove punctuation
    text = text.translate(str.maketrans('', '', string.punctuation))
    # Split into words
    words = text.split()
    
    # Simple stop words removal
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
        'of', 'with', 'by', 'this', 'that', 'is', 'are', 'was', 'were', 'be', 
        'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 
        'could', 'should', 'may', 'might', 'can', 'must', 'i', 'you', 'he', 
        'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'from'
    }
    
    # Remove stop words
    words = [word for word in words if word not in stop_words and word.isalpha()]
    
    return words

class TFIDFRetriever:
    """TF-IDF based information retrieval system"""
    
    def __init__(self):
        self.documents = []
        self.vocabulary = set()
        self.doc_freq = defaultdict(int)  # Document frequency for each term
        self.tf_idf_matrix = []
        self.N = 0  # Total number of documents
    
    def build_index(self, documents):
        """Build TF-IDF index from document collection"""
        self.documents = documents
        self.N = len(documents)
        
        print("\n🏗️  Building TF-IDF Index...")
        
        # Process all documents and build vocabulary
        processed_docs = []
        for doc in documents:
            # Combine title and content
            full_text = doc['title'] + ' ' + doc['content']
            processed_text = preprocess_text(full_text)
            processed_docs.append(processed_text)
            
            # Update vocabulary and document frequency
            unique_terms = set(processed_text)
            self.vocabulary.update(unique_terms)
            for term in unique_terms:
                self.doc_freq[term] += 1
        
        # Convert vocabulary to sorted list for consistent indexing
        self.vocabulary = sorted(list(self.vocabulary))
        
        print(f"✅ Vocabulary built: {len(self.vocabulary)} unique terms")
        print(f"📊 Sample terms: {self.vocabulary[:10]}")
        
        # Calculate TF-IDF for each document
        self.tf_idf_matrix = []
        for doc_idx, processed_doc in enumerate(processed_docs):
            tf_idf_vector = self.calculate_tf_idf(processed_doc)
            self.tf_idf_matrix.append(tf_idf_vector)
            
        print(f"✅ TF-IDF matrix created: {len(self.tf_idf_matrix)} documents × {len(self.vocabulary)} terms")
    
    def calculate_tf_idf(self, document_terms):
        """Calculate TF-IDF vector for a document"""
        # Calculate term frequency
        term_count = Counter(document_terms)
        doc_length = len(document_terms)
        
        tf_idf_vector = []
        for term in self.vocabulary:
            # Term Frequency (TF)
            tf = term_count[term] / doc_length if doc_length > 0 else 0
            
            # Inverse Document Frequency (IDF)
            idf = math.log(self.N / self.doc_freq[term]) if self.doc_freq[term] > 0 else 0
            
            # TF-IDF score
            tf_idf = tf * idf
            tf_idf_vector.append(tf_idf)
        
        return tf_idf_vector
    
    def cosine_similarity(self, vec1, vec2):
        """Calculate cosine similarity between two vectors"""
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        
        mag1 = math.sqrt(sum(a * a for a in vec1))
        mag2 = math.sqrt(sum(a * a for a in vec2))
        
        if mag1 == 0 or mag2 == 0:
            return 0
        
        return dot_product / (mag1 * mag2)
    
    def search(self, query, top_k=3):
        """Search documents using TF-IDF and cosine similarity"""
        print(f"\n🔎 Searching for: '{query}'")
        
        # Process query
        query_terms = preprocess_text(query)
        query_vector = self.calculate_tf_idf(query_terms)
        
        # Calculate similarity scores
        scores = []
        for doc_idx, doc_vector in enumerate(self.tf_idf_matrix):
            similarity = self.cosine_similarity(query_vector, doc_vector)
            scores.append((doc_idx, similarity))
        
        # Sort by similarity score (descending)
        scores.sort(key=lambda x: x[1], reverse=True)
        
        # Return top-k results
        results = []
        for i in range(min(top_k, len(scores))):
            doc_idx, score = scores[i]
            results.append({
                'document': self.documents[doc_idx],
                'score': score,
                'rank': i + 1
            })
        
        return results

# Initialize and build the retrieval system
print("\n🚀 Initializing TF-IDF Retrieval System")
retriever = TFIDFRetriever()
retriever.build_index(documents)

# Test queries
test_queries = [
    "machine learning algorithms",
    "neural networks deep learning",
    "natural language processing chatbots",
    "computer vision applications",
    "artificial intelligence ethics"
]

print("\n🧪 Testing Information Retrieval")
print("=" * 60)

for query in test_queries:
    results = retriever.search(query, top_k=3)
    
    print(f"\nQuery: '{query}'")
    print("-" * 40)
    
    for result in results:
        doc = result['document']
        score = result['score']
        rank = result['rank']
        
        print(f"Rank {rank} (Score: {score:.4f})")
        print(f"Title: {doc['title']}")
        print(f"Content: {doc['content'][:100]}...")
        print()

# Evaluation metrics
print("\n📊 EVALUATION METRICS")
print("=" * 40)

def evaluate_retrieval(retriever, test_cases):
    """Evaluate retrieval system with test cases"""
    
    # Test cases with expected relevant documents
    evaluation_queries = [
        {
            'query': 'machine learning algorithms',
            'relevant_docs': [1, 2, 3, 6]  # Doc IDs that should be relevant
        },
        {
            'query': 'neural networks',
            'relevant_docs': [2, 4]  # Deep learning and computer vision docs
        },
        {
            'query': 'ethics AI',
            'relevant_docs': [5]  # AI ethics doc
        }
    ]
    
    total_precision = 0
    total_recall = 0
    total_queries = len(evaluation_queries)
    
    for test_case in evaluation_queries:
        query = test_case['query']
        relevant_docs = set(test_case['relevant_docs'])
        
        # Get search results
        results = retriever.search(query, top_k=3)
        retrieved_docs = set([result['document']['id'] for result in results])
        
        # Calculate precision and recall
        relevant_retrieved = relevant_docs.intersection(retrieved_docs)
        
        precision = len(relevant_retrieved) / len(retrieved_docs) if retrieved_docs else 0
        recall = len(relevant_retrieved) / len(relevant_docs) if relevant_docs else 0
        
        total_precision += precision
        total_recall += recall
        
        print(f"Query: '{query}'")
        print(f"  Retrieved: {retrieved_docs}")
        print(f"  Relevant: {relevant_docs}")
        print(f"  Precision: {precision:.3f}")
        print(f"  Recall: {recall:.3f}")
        print()
    
    avg_precision = total_precision / total_queries
    avg_recall = total_recall / total_queries
    f1_score = 2 * (avg_precision * avg_recall) / (avg_precision + avg_recall) if (avg_precision + avg_recall) > 0 else 0
    
    print(f"📈 OVERALL PERFORMANCE:")
    print(f"  Average Precision: {avg_precision:.3f}")
    print(f"  Average Recall: {avg_recall:.3f}")
    print(f"  F1-Score: {f1_score:.3f}")
    
    return avg_precision, avg_recall, f1_score

# Run evaluation
precision, recall, f1 = evaluate_retrieval(retriever, test_queries)

print("\n🎯 INFORMATION RETRIEVAL SYSTEM SUMMARY")
print("=" * 50)
print("✅ Successfully implemented TF-IDF based retrieval system")
print("✅ Built vocabulary and document index")
print("✅ Implemented cosine similarity for ranking")
print("✅ Evaluated system performance with precision/recall metrics")
print(f"✅ Final Performance: Precision={precision:.3f}, Recall={recall:.3f}, F1={f1:.3f}")
print("\n💡 Key Features:")
print("  • Text preprocessing and stop word removal")
print("  • TF-IDF vectorization for documents and queries")
print("  • Cosine similarity for document ranking")
print("  • Evaluation metrics (Precision, Recall, F1-score)")
print("  • Scalable to larger document collections")
