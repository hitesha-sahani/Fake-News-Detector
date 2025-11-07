# Fake News Detection Web App

An AI-powered web application that analyzes news articles to determine their credibility - whether they are real or fake news.

## Features

- **Real-time Analysis**: Submit any news text and get instant credibility assessment
- **Confidence Scores**: See detailed confidence percentages for real vs fake classification
- **Detailed Reasoning**: Understand why a piece of news was classified as real or fake
- **Beautiful UI**: Modern, responsive interface with dark mode support
- **Machine Learning Model**: Trained on the `bharatfakenewskosh.xlsx` dataset

## Project Structure

\`\`\`
├── app/
│   ├── page.tsx                 # Main home page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   └── api/
│       ├── predict/route.ts     # News prediction endpoint
│       └── train/route.ts       # Model training endpoint
├── components/
│   ├── news-analyzer.tsx        # Main analyzer component
│   ├── confidence-chart.tsx     # Confidence visualization
│   └── ui/                      # shadcn/ui components
├── scripts/
│   ├── train_model.py           # Model training pipeline
│   └── predict_news.py          # Test prediction script
├── public/
│   └── ml_models/               # Trained model storage
│       ├── fake_news_model.pkl
│       ├── tfidf_vectorizer.pkl
│       └── model_metadata.pkl
└── bharatfakenewskosh.xlsx      # Training dataset (add to root)
\`\`\`

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

Make sure you have Python 3.7+ installed with required packages:
\`\`\`bash
pip install pandas openpyxl scikit-learn numpy
\`\`\`

### 2. Prepare Training Data

Place your `bharatfakenewskosh.xlsx` file in the project root directory. The file should have:
- A text/content column (news articles)
- A label column (real/fake classification)

The script will auto-detect column names like: `text`, `news`, `content`, `title`, `label`, `class`, `real`, `fake`

### 3. Train the Model

**Option A: Using the API**
\`\`\`bash
curl -X POST http://localhost:3000/api/train
\`\`\`

**Option B: Run Python script directly**
\`\`\`bash
python scripts/train_model.py
\`\`\`

The trained model will be saved to `public/ml_models/`:
- `fake_news_model.pkl` - Trained LogisticRegression model
- `tfidf_vectorizer.pkl` - TF-IDF vectorizer
- `model_metadata.pkl` - Model metadata and metrics

### 4. Run the App

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to access the web app.

## How It Works

### Training Pipeline (`scripts/train_model.py`)

1. **Load Data**: Reads `bharatfakenewskosh.xlsx`
2. **Preprocessing**: Cleans text, handles missing values
3. **Feature Extraction**: Uses TF-IDF vectorization
   - Max features: 5000
   - N-grams: 1-2
   - Removes English stop words
4. **Model Training**: LogisticRegression classifier
   - Train/Test split: 80/20
5. **Evaluation**: Calculates accuracy, precision, recall, F1-score
6. **Save Artifacts**: Stores model, vectorizer, and metadata

### Prediction API (`app/api/predict/route.ts`)

Accepts POST requests with news text:

\`\`\`json
{
  "news_text": "Your news article text here..."
}
\`\`\`

Returns:

\`\`\`json
{
  "prediction": "Real",
  "prediction_index": 1,
  "confidence": {
    "Real": 0.87,
    "Fake": 0.13
  },
  "is_real": true,
  "confidence_percentage": 87,
  "model_accuracy": 0.85,
  "analysis_reason": "Contains well-structured content; ...",
  "status": "success"
}
\`\`\`

## Technical Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **ML/AI**: scikit-learn, TF-IDF, LogisticRegression
- **Data Processing**: pandas, openpyxl
- **Visualization**: Recharts
- **UI Components**: shadcn/ui

## Model Details

- **Algorithm**: LogisticRegression with TF-IDF Vectorizer
- **Features**: 5000 TF-IDF features with 1-2 n-grams
- **Training Data**: bharatfakenewskosh.xlsx dataset
- **Evaluation**: 80/20 train/test split
- **Metrics**: Accuracy, Precision, Recall, F1-Score

## Usage Example

1. Go to the web app homepage
2. Paste news text in the textarea (minimum 10 characters)
3. Click "Analyze News"
4. View the results:
   - Real/Fake prediction
   - Confidence percentage
   - Detailed analysis reasons
   - Visual confidence chart

## Testing

You can test the API using curl:

\`\`\`bash
# Test prediction
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{"news_text": "Breaking news: Scientists discover new renewable energy source..."}'
\`\`\`

## Environment Variables

Currently, no environment variables are required. The app uses local file storage for models.

For production deployment:
- Consider storing models in cloud storage (AWS S3, GCS, etc.)
- Add authentication to training endpoint
- Implement rate limiting for API routes

## Performance Considerations

- **First Prediction**: May take a few seconds as model loads from disk
- **Subsequent Predictions**: Very fast (< 100ms)
- **Model Size**: ~5-10MB depending on feature size

## Troubleshooting

### "Model files not found"
- Run the training script first: `python scripts/train_model.py`
- Check that `public/ml_models/` directory exists

### Python script fails
- Ensure Python 3.7+ is installed
- Install required packages: `pip install pandas openpyxl scikit-learn numpy`
- Check file paths are correct

### Column detection fails
- Ensure your xlsx has clear column names
- Rename columns to match: `text`, `label` or similar variants

## Future Improvements

- [ ] Support for multiple languages
- [ ] Fine-tuning with active learning
- [ ] Ensemble models combining multiple algorithms
- [ ] API authentication and rate limiting
- [ ] Model versioning and A/B testing
- [ ] User feedback mechanism to improve model
- [ ] Browser-based model inference (TensorFlow.js)
- [ ] Advanced NLP features (sentiment, entity extraction)

## License

MIT

## Support

For issues or questions, please check the troubleshooting section or create an issue.
