"""
Utility script to test the trained model with sample news text
Run this to verify the model works before deploying
"""

import pickle
import os

def load_model_artifacts():
    """Load trained model, vectorizer, and metadata"""
    model_dir = 'public/ml_models'
    
    model_path = os.path.join(model_dir, 'fake_news_model.pkl')
    vectorizer_path = os.path.join(model_dir, 'tfidf_vectorizer.pkl')
    metadata_path = os.path.join(model_dir, 'model_metadata.pkl')
    
    if not all(os.path.exists(p) for p in [model_path, vectorizer_path, metadata_path]):
        print("[v0] Model files not found. Please run train_model.py first")
        return None, None, None
    
    model = pickle.load(open(model_path, 'rb'))
    vectorizer = pickle.load(open(vectorizer_path, 'rb'))
    metadata = pickle.load(open(metadata_path, 'rb'))
    
    return model, vectorizer, metadata

def predict_news(text):
    """
    Predict if a news text is real or fake
    
    Args:
        text (str): News text to analyze
        
    Returns:
        dict: Prediction result with confidence scores
    """
    model, vectorizer, metadata = load_model_artifacts()
    
    if model is None:
        return {
            'error': 'Model not trained yet',
            'status': 'error'
        }
    
    # Vectorize the input text
    text_vec = vectorizer.transform([text])
    
    # Get prediction and confidence
    prediction = model.predict(text_vec)[0]
    confidence = model.predict_proba(text_vec)[0]
    
    # Map prediction back to label
    reverse_mapping = {v: k for k, v in metadata['label_mapping'].items()}
    predicted_label = reverse_mapping[prediction]
    
    # Get confidence for each class
    confidence_dict = {}
    for class_idx, label in reverse_mapping.items():
        confidence_dict[str(label)] = float(confidence[class_idx])
    
    return {
        'prediction': str(predicted_label),
        'prediction_index': int(prediction),
        'confidence': confidence_dict,
        'is_real': prediction == 1,  # Assuming 1 = real, 0 = fake
        'confidence_percentage': float(max(confidence) * 100),
        'model_accuracy': metadata['accuracy'],
        'status': 'success'
    }

if __name__ == "__main__":
    # Test sample
    sample_texts = [
        "Breaking news: Scientists discover new renewable energy source that could revolutionize power generation",
        "SHOCKING: Celebrity announces secret plans to take over the world",
    ]
    
    for text in sample_texts:
        print(f"\nAnalyzing: {text[:100]}...")
        result = predict_news(text)
        print(result)
