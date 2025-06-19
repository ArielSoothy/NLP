# Part 1.7 - Adding Temporal Features (Simple Implementation)
# Google Colab Code - Ariel Soothy

"""
GOAL: Add time and age information to improve text classification
APPROACH: Feature concatenation (most straightforward method)
"""

# ====================================================================
# Setup
# ====================================================================
!pip install scikit-learn transformers torch pandas numpy matplotlib

import torch
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_recall_fscore_support
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, Trainer, TrainingArguments
import torch.nn as nn

# ====================================================================
# Create Simple Dataset with Temporal Features
# ====================================================================

# Create sample data that shows temporal patterns
data = []
texts = [
    "I'm so happy today!", "Feeling sad and lonely", "This is amazing news!",
    "Having a terrible day", "Love this beautiful weather", "Worried about tomorrow",
    "Excited for the weekend!", "Feeling down lately", "Great job everyone!",
    "This is frustrating", "Perfect day with friends", "Anxious about the meeting"
] * 100  # Repeat to get more data

# Add temporal patterns - people post different emotions at different times/ages
for i, text in enumerate(texts):
    # Simple temporal logic
    if "happy" in text or "amazing" in text or "love" in text or "excited" in text:
        emotion = "positive"
        hour = np.random.choice([10, 11, 12, 19, 20])  # Happy people post morning/evening
        age = np.random.choice([22, 25, 28, 30, 35])   # Younger people more positive
    elif "sad" in text or "terrible" in text or "down" in text:
        emotion = "negative" 
        hour = np.random.choice([1, 2, 23, 0, 3])      # Sad people post at night
        age = np.random.choice([35, 40, 45, 50, 55])   # Older people more sad
    else:
        emotion = "neutral"
        hour = np.random.choice(range(9, 18))          # Neutral posts during work hours
        age = np.random.choice(range(20, 60))
    
    label = 0 if emotion == "neutral" else 1  # 0=neutral, 1=emotional
    
    data.append({
        'text': text,
        'hour': hour,
        'age': age, 
        'label': label
    })

df = pd.DataFrame(data)
print(f"✅ Created dataset: {len(df)} samples")
print(f"📊 Labels: {df['label'].value_counts().to_dict()}")

# ====================================================================
# Feature Engineering (Simple)
# ====================================================================

# Normalize temporal features to 0-1 range
df['hour_norm'] = df['hour'] / 23.0
df['age_norm'] = (df['age'] - 18) / (80 - 18)

print(f"📊 Hour range: {df['hour_norm'].min():.2f} to {df['hour_norm'].max():.2f}")
print(f"📊 Age range: {df['age_norm'].min():.2f} to {df['age_norm'].max():.2f}")

# ====================================================================
# Model: DistilBERT + Temporal Features
# ====================================================================

class SimpleTemporalModel(nn.Module):
    def __init__(self):
        super().__init__()
        
        # Load DistilBERT
        self.bert = DistilBertForSequenceClassification.from_pretrained(
            'distilbert-base-uncased', num_labels=2
        )
        
        # Simple temporal processor
        self.temporal_layer = nn.Linear(2, 32)  # 2 temporal features -> 32 dims
        self.final_layer = nn.Linear(768 + 32, 2)  # 768 (BERT) + 32 (temporal) -> 2 classes
        
    def forward(self, input_ids, attention_mask, temporal_features, labels=None):
        # Get BERT output
        bert_outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask, output_hidden_states=True)
        text_features = bert_outputs.hidden_states[-1][:, 0, :]  # CLS token
        
        # Process temporal features
        temporal_processed = torch.relu(self.temporal_layer(temporal_features))
        
        # Combine and classify
        combined = torch.cat([text_features, temporal_processed], dim=1)
        logits = self.final_layer(combined)
        
        loss = None
        if labels is not None:
            loss_fn = nn.CrossEntropyLoss()
            loss = loss_fn(logits, labels)
            
        return {'loss': loss, 'logits': logits}

# ====================================================================
# Data Preparation
# ====================================================================

# Split data
train_df, test_df = train_test_split(df, test_size=0.3, random_state=42)

# Tokenizer
tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')

def prepare_data(dataframe):
    texts = dataframe['text'].tolist()
    temporal_features = dataframe[['hour_norm', 'age_norm']].values
    labels = dataframe['label'].tolist()
    
    # Tokenize
    encodings = tokenizer(texts, truncation=True, padding=True, max_length=128, return_tensors='pt')
    
    return {
        'input_ids': encodings['input_ids'],
        'attention_mask': encodings['attention_mask'],
        'temporal_features': torch.tensor(temporal_features, dtype=torch.float),
        'labels': torch.tensor(labels, dtype=torch.long)
    }

train_data = prepare_data(train_df)
test_data = prepare_data(test_df)

print(f"✅ Training samples: {len(train_data['labels'])}")
print(f"✅ Test samples: {len(test_data['labels'])}")

# ====================================================================
# Training (Simple)
# ====================================================================

model = SimpleTemporalModel()

# Simple training loop
optimizer = torch.optim.Adam(model.parameters(), lr=2e-5)
model.train()

print("🔄 Training model...")
for epoch in range(3):
    optimizer.zero_grad()
    
    outputs = model(
        input_ids=train_data['input_ids'],
        attention_mask=train_data['attention_mask'],
        temporal_features=train_data['temporal_features'],
        labels=train_data['labels']
    )
    
    loss = outputs['loss']
    loss.backward()
    optimizer.step()
    
    print(f"Epoch {epoch+1}: Loss = {loss.item():.4f}")

# ====================================================================
# Evaluation
# ====================================================================

model.eval()
with torch.no_grad():
    # Test temporal model
    temporal_outputs = model(
        input_ids=test_data['input_ids'],
        attention_mask=test_data['attention_mask'],
        temporal_features=test_data['temporal_features']
    )
    temporal_preds = torch.argmax(temporal_outputs['logits'], dim=1).numpy()
    
    # Test baseline (text only) - set temporal features to zero
    zero_temporal = torch.zeros_like(test_data['temporal_features'])
    baseline_outputs = model(
        input_ids=test_data['input_ids'],
        attention_mask=test_data['attention_mask'],
        temporal_features=zero_temporal
    )
    baseline_preds = torch.argmax(baseline_outputs['logits'], dim=1).numpy()

# Calculate metrics
true_labels = test_data['labels'].numpy()

temporal_accuracy = accuracy_score(true_labels, temporal_preds)
baseline_accuracy = accuracy_score(true_labels, baseline_preds)

temporal_precision, temporal_recall, temporal_f1, _ = precision_recall_fscore_support(true_labels, temporal_preds, average='weighted')
baseline_precision, baseline_recall, baseline_f1, _ = precision_recall_fscore_support(true_labels, baseline_preds, average='weighted')

# ====================================================================
# Results
# ====================================================================

print("\n🎉 RESULTS:")
print("="*50)
print(f"BASELINE (Text Only):")
print(f"  Accuracy:  {baseline_accuracy:.4f}")
print(f"  Precision: {baseline_precision:.4f}")
print(f"  Recall:    {baseline_recall:.4f}")
print(f"  F1-Score:  {baseline_f1:.4f}")

print(f"\nTEMPORAL (Text + Time/Age):")
print(f"  Accuracy:  {temporal_accuracy:.4f}")
print(f"  Precision: {temporal_precision:.4f}")
print(f"  Recall:    {temporal_recall:.4f}")
print(f"  F1-Score:  {temporal_f1:.4f}")

print(f"\nIMPROVEMENT:")
print(f"  Accuracy:  {temporal_accuracy - baseline_accuracy:+.4f}")
print(f"  Precision: {temporal_precision - baseline_precision:+.4f}")
print(f"  Recall:    {temporal_recall - baseline_recall:+.4f}")
print(f"  F1-Score:  {temporal_f1 - baseline_f1:+.4f}")

if temporal_accuracy > baseline_accuracy:
    print(f"\n✅ SUCCESS: Temporal features improved performance!")
    print(f"   Best improvement: {max(temporal_accuracy-baseline_accuracy, temporal_f1-baseline_f1):.4f}")
else:
    print(f"\n📉 Temporal features didn't help much in this simple example")
    print(f"   (Real datasets might show different results)")

print(f"\n💡 IMPLEMENTATION:")
print(f"   • Method: Feature concatenation (most straightforward)")
print(f"   • Temporal features: normalized hour (0-1) + normalized age (0-1)")
print(f"   • Architecture: DistilBERT + Simple MLP + Combined classifier")
print(f"   • Training: 3 epochs, simple optimization")

print(f"\n🎓 CONCLUSION:")
print(f"   Adding temporal features is straightforward with feature concatenation.")
print(f"   Performance improvement depends on the strength of temporal patterns in data.")
print("="*50)
