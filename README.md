```markdown
# Fake News Detection Web App

An AI-powered web application that analyzes news articles and determines whether they are **Real** or **Fake**, along with confidence scores, reasoning, and visual charts.  
Built using **Next.js + TypeScript** (frontend/API) and **Python + scikit-learn** (ML model).

---

## ✅ Features

- **Real-time Fake News Detection**
- **Confidence Breakdown (Real vs Fake %)**
- **Explainability / Reasoning**
- **Interactive Charts using Recharts**
- **Beautiful UI with Tailwind + shadcn/ui**
- **ML model trained on Bharat Fake News Kosh dataset**

---

## ✅ Project Structure

```

├── app/
│   ├── page.tsx                  # Home page UI
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   └── api/
│       ├── predict/route.ts      # API endpoint for predictions
│       └── train/route.ts        # API endpoint for training
├── components/
│   ├── news-analyzer.tsx         # Main analyzer component
│   ├── confidence-chart.tsx      # Visualization component
│   └── ui/                       # shadcn/ui components
├── scripts/
│   ├── train_model.py            # ML training pipeline
│   └── predict_news.py           # Local prediction tester
├── public/ml_models/
│   ├── fake_news_model.pkl
│   ├── tfidf_vectorizer.pkl
│   └── model_metadata.pkl
└── bharatfakenewskosh.xlsx       # Dataset (add manually)

````

---

## ✅ Installation

### **1. Install Node.js dependencies**
```bash
npm install
````

### **2. Install Python dependencies**

```bash
pip install pandas openpyxl scikit-learn numpy
```

---

## ✅ Add Training Dataset

Place your dataset:

```
bharatfakenewskosh.xlsx
```

into the **project root folder**.

It must contain:

* A text/content column
* A label/class column

The script auto-detects common names like:
`text, content, news, title, label, class, real, fake`

---

## ✅ Training the Model

### **Option A — Train through API**

```bash
curl -X POST http://localhost:3000/api/train
```

### **Option B — Train using Python**

```bash
python scripts/train_model.py
```

This will generate:

* `fake_news_model.pkl`
* `tfidf_vectorizer.pkl`
* `model_metadata.pkl`

stored in `public/ml_models/`.

---

## ✅ Running the App

```bash
npm run dev
```

Open:

👉 [http://localhost:3000](http://localhost:3000)

---

## ✅ How the System Works

### 🔹 **Training Pipeline (Python)**

1. Load dataset
2. Clean and preprocess text
3. Vectorize using **TF-IDF (1–2 n-grams, 5000 features)**
4. Train **LogisticRegression** ML model
5. Evaluate using accuracy, precision, recall, F1-score
6. Save model + metadata

---

### 🔹 **Prediction API (Next.js Route Handler)**

Send:

```json
{
  "news_text": "Your news article text here..."
}
```

Receive:

```json
{
  "prediction": "Real",
  "confidence": {
    "Real": 0.87,
    "Fake": 0.13
  },
  "confidence_percentage": 87,
  "model_accuracy": 0.85,
  "analysis_reason": "Contains well-structured content...",
  "status": "success"
}
```

---

## ✅ Tech Stack

### **Frontend & API**

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

### **Machine Learning**

* scikit-learn
* TF-IDF Vectorizer
* LogisticRegression
* pandas / numpy

---

## ✅ Performance Notes

* First prediction loads model → may take 1–2s
* Next predictions → **fast (<100ms)**
* Model size: 5–10MB

---

## ✅ Troubleshooting

### ❗ *Model files not found*

* Run training script again
* Ensure `public/ml_models/` exists

### ❗ *Python script issues*

* Install dependencies
* Check dataset file path
* Ensure Python 3.7+

### ❗ *Column detection errors*

Rename dataset columns to:
`text`, `news`, `content`, `label`, or similar names.

---

## ✅ Roadmap / Future Improvements

* [ ] Support for Hindi & multilingual datasets
* [ ] Transformer-based models (BERT, DistilBERT)
* [ ] Active learning loop
* [ ] API authentication
* [ ] Cloud hosting for model
* [ ] Feedback mechanism
* [ ] Model versioning (A/B testing)
* [ ] TensorFlow.js browser inference

---

## ✅ License

MIT License

---

## ✅ Support

If you have questions or encounter issues, feel free to open a GitHub issue.

```

