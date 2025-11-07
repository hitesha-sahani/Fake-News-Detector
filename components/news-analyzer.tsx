"use client"

import { useState, type FormEvent, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, Loader2, Copy, Check } from "lucide-react"
import ConfidenceChart from "./confidence-chart"

interface AnalysisResult {
  prediction: string
  prediction_index: number
  confidence: Record<string, number>
  is_real: boolean
  confidence_percentage: number
  model_accuracy: number
  analysis_reason: string
  status: string
}

export default function NewsAnalyzer() {
  const [newsText, setNewsText] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string>("")
  const [copied, setCopied] = useState<boolean>(false)

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewsText(e.target.value)
    setError("")
  }

  const handleAnalyze = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setResult(null)

    if (!newsText.trim()) {
      setError("Please enter some news text to analyze")
      return
    }

    if (newsText.trim().length < 10) {
      setError("Please enter at least 10 characters of news text")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ news_text: newsText }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const data: AnalysisResult = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis")
      console.error("[v0] Analysis error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(newsText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setNewsText("")
    setResult(null)
    setError("")
  }

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Enter News Text</CardTitle>
          <CardDescription>Paste the news article or text you want to analyze</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="relative">
              <textarea
                value={newsText}
                onChange={handleInputChange}
                placeholder="Paste your news text here... (minimum 10 characters)"
                className="w-full h-32 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              {newsText && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                  title="Copy text"
                >
                  {copied ? (
                    <Check size={18} className="text-green-500" />
                  ) : (
                    <Copy size={18} className="text-slate-400" />
                  )}
                </button>
              )}
            </div>

            {newsText && <div className="text-sm text-slate-500 dark:text-slate-400">{newsText.length} characters</div>}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
                <AlertCircle size={18} className="flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={loading || !newsText.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze News"
                )}
              </Button>
              <Button type="button" onClick={handleClear} variant="outline" disabled={loading}>
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results Card */}
      {result && (
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.is_real ? (
                <>
                  <CheckCircle className="text-green-500" size={24} />
                  <span>Likely Real News</span>
                </>
              ) : (
                <>
                  <AlertCircle className="text-red-500" size={24} />
                  <span>Likely Fake News</span>
                </>
              )}
            </CardTitle>
            <CardDescription>Analysis based on text patterns and model training</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Confidence Chart */}
            <ConfidenceChart
              real_confidence={result.confidence["Real"] * 100}
              fake_confidence={result.confidence["Fake"] * 100}
            />

            {/* Confidence Percentage */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {result.confidence_percentage.toFixed(1)}%
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {result.is_real ? "Credibility Score (Real)" : "Likelihood of Being Fake"}
                </p>
              </div>
            </div>

            {/* Analysis Reason */}
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Why this classification:</h3>
              <ul className="space-y-2">
                {result.analysis_reason.split(";").map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                    <span className="text-blue-500 font-bold mt-1 min-w-5">•</span>
                    <span>{reason.trim()}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Model Info */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                <span>Model Accuracy:</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {(result.model_accuracy * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Test Another Button */}
            <Button onClick={handleClear} variant="outline" className="w-full bg-transparent">
              Analyze Another News
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
