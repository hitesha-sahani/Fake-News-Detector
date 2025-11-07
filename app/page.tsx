import NewsAnalyzer from "@/components/news-analyzer"

export default async function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 text-balance">
            Fake News Detector
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-pretty">
            AI-powered analysis to detect whether news articles are real or fake. Paste any news text and get instant
            credibility assessment with detailed reasoning.
          </p>
        </div>

        {/* Main Analyzer Component */}
        <div className="max-w-4xl mx-auto">
          <NewsAnalyzer />
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Advanced Analysis</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Machine learning model trained on thousands of news articles
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Instant Results</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Get credibility scores and reasoning in seconds
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Detailed Insights</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Understand why news is classified as real or fake
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
