import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Fight Misinformation with
              <span className="block text-yellow-400">AI-Powered Fact Checking</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto">
              Verify news, claims, and headlines instantly using advanced AI analysis 
              combined with community feedback for accurate results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/register"
                className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition shadow-lg"
              >
                Get Started Free
              </Link>
              <Link 
                href="/login"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                1. Submit a Claim
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enter any news headline, social media post, or claim you want to verify.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                2. AI Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI checks against fact-check databases and analyzes content using Google Gemini.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center mb-6">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                3. Community Feedback
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Results are enhanced with community votes for a dynamic confidence score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verdict Preview Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Clear, Actionable Verdicts
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-6 py-3 rounded-full bg-green-100 text-green-800 font-semibold border border-green-300">
              ✓ TRUE
            </span>
            <span className="px-6 py-3 rounded-full bg-red-100 text-red-800 font-semibold border border-red-300">
              ✗ FALSE
            </span>
            <span className="px-6 py-3 rounded-full bg-yellow-100 text-yellow-800 font-semibold border border-yellow-300">
              ◐ PARTIALLY TRUE
            </span>
            <span className="px-6 py-3 rounded-full bg-gray-100 text-gray-800 font-semibold border border-gray-300">
              ? UNVERIFIABLE
            </span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Fight Fake News?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of users who verify information before sharing.
          </p>
          <Link 
            href="/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 px-10 py-4 rounded-xl font-semibold text-lg transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2026 FactCheck. Powered by AI for a better-informed world.</p>
        </div>
      </footer>
    </div>
  );
}
