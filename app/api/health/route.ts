import { NextResponse } from "next/server"
import * as fs from "fs"
import * as path from "path"

export async function GET() {
  try {
    const modelDir = path.join(process.cwd(), "public", "ml_models")

    const modelPath = path.join(modelDir, "fake_news_model.pkl")
    const vectorizerPath = path.join(modelDir, "tfidf_vectorizer.pkl")
    const metadataPath = path.join(modelDir, "model_metadata.pkl")

    const modelExists = fs.existsSync(modelPath)
    const vectorizerExists = fs.existsSync(vectorizerPath)
    const metadataExists = fs.existsSync(metadataPath)

    return NextResponse.json({
      status: "healthy",
      model_trained: modelExists && vectorizerExists && metadataExists,
      files: {
        model: modelExists,
        vectorizer: vectorizerExists,
        metadata: metadataExists,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
