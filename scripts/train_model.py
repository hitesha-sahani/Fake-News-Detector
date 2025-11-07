"""
Fake News Detection Model Training Pipeline
Reads bharatfakenewskosh.xlsx and trains a TfidfVectorizer + LogisticRegression model
"""

import pandas as pd
import numpy as np
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import warnings
warnings.filterwarnings('ignore')

def train_model():
    """
    Load data from xlsx, preprocess, train model, and save artifacts
    """
    
    # File paths
    input_file = 'bharatfakenewskosh.xlsx'
    model_dir = 'public/ml_models'
    
    # Create model directory if it doesn't exist
    os.makedirs(model_dir, exist_ok=True)
    
    print("[v0] Loading data from:", input_file)
    
    try:
        df = pd.read_excel(input_file)
        print(f"[v0] Data loaded successfully. Shape: {df.shape}")
        print(f"[v0] Columns: {df.columns.tolist()}")
        print(f"[v0] First few rows:\n{df.head()}")
    except Exception as e:
        print(f"[v0] Error loading file: {e}")
        print(f"[v0] Make sure bharatfakenewskosh.xlsx exists in the root directory")
        return False
    
    # Explicitly choose the correct text and label columns
    # 'Eng_Trans_Statement' contains actual news content in English
    # 'Label' is the target
    text_column = 'Eng_Trans_Statement'
    label_column = 'Label'
    
    # Clean data
    df = df[[text_column, label_column]].dropna()
    print(f"[v0] Data after cleaning. Shape: {df.shape}")
    
    # Convert labels to binary (0=fake, 1=real)
    unique_labels = df[label_column].unique()
    print(f"[v0] Unique labels: {unique_labels}")
    
    # Map labels to 0/1
    label_mapping = {label: i for i, label in enumerate(sorted(unique_labels))}
    df['label_encoded'] = df[label_column].map(label_mapping)
    
    print(f"[v0] Label mapping: {label_mapping}")
    print(f"[v0] Label distribution:\n{df['label_encoded'].value_counts()}")
    
    # Prepare features and labels
    X = df[text_column].values
    y = df['label_encoded'].values
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    print(f"[v0] Training set size: {len(X_train)}, Test set size: {len(X_test)}")
    
    # TF-IDF Vectorizer
    print("[v0] Training TF-IDF Vectorizer...")
    vectorizer = TfidfVectorizer(
        max_features=5000,
        min_df=2,
        max_df=0.8,
        ngram_range=(1, 2),
        lowercase=True,
        stop_words='english'
    )
    
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    print(f"[v0] Feature matrix shape: {X_train_vec.shape}  # should be thousands of features")
    
    # Logistic Regression
    print("[v0] Training Logistic Regression model...")
    model = LogisticRegression(
        max_iter=1000,
        random_state=42,
        solver='liblinear',
        C=1.0
    )
    
    model.fit(X_train_vec, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_vec)
    y_pred_proba = model.predict_proba(X_test_vec)
    
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted')
    recall = recall_score(y_test, y_pred, average='weighted')
    f1 = f1_score(y_test, y_pred, average='weighted')
    
    print(f"\n[v0] Model Performance:")
    print(f"[v0] Accuracy:  {accuracy:.4f}")
    print(f"[v0] Precision: {precision:.4f}")
    print(f"[v0] Recall:    {recall:.4f}")
    print(f"[v0] F1 Score:  {f1:.4f}")
    
    # Save artifacts
    print("[v0] Saving model artifacts...")
    model_path = os.path.join(model_dir, 'fake_news_model.pkl')
    vectorizer_path = os.path.join(model_dir, 'tfidf_vectorizer.pkl')
    metadata_path = os.path.join(model_dir, 'model_metadata.pkl')
    
    pickle.dump(model, open(model_path, 'wb'))
    pickle.dump(vectorizer, open(vectorizer_path, 'wb'))
    
    metadata = {
        'label_mapping': label_mapping,
        'accuracy': accuracy,
        'precision': precision,
        'recall': recall,
        'f1_score': f1,
        'text_column': text_column,
        'label_column': label_column,
        'model_type': 'LogisticRegression',
        'vectorizer_type': 'TfidfVectorizer'
    }
    
    pickle.dump(metadata, open(metadata_path, 'wb'))
    
    print(f"[v0] Model saved to: {model_path}")
    print(f"[v0] Vectorizer saved to: {vectorizer_path}")
    print(f"[v0] Metadata saved to: {metadata_path}")
    
    print("\n[v0] Model training completed successfully!")
    return True

if __name__ == "__main__":
    train_model()
