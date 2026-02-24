'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import ResultCard from '@/components/ResultCard';

export default function HistoryPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('ALL');

  // Load history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('verificationHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const filteredHistory = filter === 'ALL' 
    ? history 
    : history.filter(item => item.verdict === filter);

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
      setSelectedItem(null);
      localStorage.removeItem('verificationHistory');
      showToast('History cleared', 'success');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Verification History
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {history.length} total verifications
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-red-600 hover:text-red-700 text-sm font-medium px-4 py-2 rounded-lg border border-red-200 hover:bg-red-50 transition"
            >
              Clear History
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        {history.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {['ALL', 'TRUE', 'FALSE', 'PARTIALLY_TRUE', 'UNVERIFIABLE', 'PENDING'].map(verdict => (
              <button
                key={verdict}
                onClick={() => setFilter(verdict)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition
                  ${filter === verdict 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }
                `}
              >
                {verdict.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* History List */}
          <div className="space-y-3">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item, index) => (
                <button
                  key={`${item.id}-${index}`}
                  onClick={() => setSelectedItem(item)}
                  className={`
                    w-full text-left bg-white dark:bg-gray-800 rounded-xl p-4 shadow border transition
                    ${selectedItem?.id === item.id 
                      ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white line-clamp-2 text-sm">
                        {item.content}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.createdAt}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {item.confidence}% confidence
                        </span>
                      </div>
                    </div>
                    <span className={`
                      px-2 py-1 rounded text-xs font-semibold whitespace-nowrap
                      ${item.verdict === 'TRUE' ? 'bg-green-100 text-green-800' : ''}
                      ${item.verdict === 'FALSE' ? 'bg-red-100 text-red-800' : ''}
                      ${item.verdict === 'PARTIALLY_TRUE' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${item.verdict === 'UNVERIFIABLE' ? 'bg-gray-100 text-gray-800' : ''}
                      ${item.verdict === 'PENDING' ? 'bg-blue-100 text-blue-800' : ''}
                    `}>
                      {item.verdict?.replace('_', ' ')}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-gray-600 dark:text-gray-400">
                  {filter === 'ALL' ? 'No verifications yet' : `No ${filter.replace('_', ' ')} results`}
                </p>
              </div>
            )}
          </div>

          {/* Detail View */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {selectedItem ? (
              <ResultCard result={selectedItem} showFeedback={true} />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
                <div className="text-4xl mb-3">👆</div>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a verification to see details
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {history.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No verification history
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start verifying claims to see them here
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
