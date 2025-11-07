# api.py
from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import os

# Request model
class NewsRequest(BaseModel):
    news_text: str

# Load model and vectorizer once
model_dir = os.path.join("public", "ml_models")
with open(os.path.join(model_dir, "fake_news_model.pkl"), "rb") as f:
    model = pickle.load(f)
with open(os.path.join(model_dir, "tfidf_vectorizer.pkl"), "rb") as f:
    vectorizer = pickle.load(f)

app = FastAPI()

@app.post("/predict")
def predict(data: NewsRequest):
    text = data.news_text.strip()
    if not text:
        return {"error": "Empty text", "status": "error"}

    X_vec = vectorizer.transform([text])
    proba = model.predict_proba(X_vec)[0]  # [fake_prob, real_prob]
    is_real = proba[1] > 0.5

    return {
        "prediction": "Real" if is_real else "Fake",
        "confidence": {"Fake": proba[0], "Real": proba[1]},
        "is_real": is_real,
        "confidence_percentage": proba[1] * 100,
        "status": "success"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
