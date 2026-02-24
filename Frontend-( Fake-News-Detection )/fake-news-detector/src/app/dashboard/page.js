'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';
import { verifyMessage } from '@/lib/api';
import VerificationForm from '@/components/VerificationForm';
import ResultCard from '@/components/ResultCard';

export default function DashboardPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const { showToast } = useToast();
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  // Load history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('verificationHistory');
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  const handleVerify = async (content) => {
    // Use actual userId from auth context, fallback to 1 for testing
    const userIdToUse = userId || 1;

    setIsVerifying(true);
    setResult(null);

    try {
      // Token is read from localStorage by verifyMessage
      const response = await verifyMessage(content, userIdToUse);
      setResult(response);
      
      // Add to history
      const newHistory = [response, ...history.slice(0, 9)]; // Keep last 10
      setHistory(newHistory);
      localStorage.setItem('verificationHistory', JSON.stringify(newHistory));
      
      showToast('Verification complete!', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Verify News & Claims
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Enter any claim or news headline to check its authenticity
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <VerificationForm onSubmit={handleVerify} isLoading={isVerifying} />
        </div>

        {/* Loading State */}
        {isVerifying && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Analyzing with AI...
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                This may take up to 15 seconds
              </p>
            </div>
          </div>
        )}

        {/* Result */}
        {result && !isVerifying && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Verification Result
            </h2>
            <ResultCard result={result} />
          </div>
        )}

        {/* Recent History */}
        {history.length > 0 && !isVerifying && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Verifications
              </h2>
              <button
                onClick={() => router.push('/history')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {history.slice(0, 3).map((item, index) => (
                <div 
                  key={`${item.id}-${index}`}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 dark:text-white truncate">
                        {item.content}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.createdAt}
                      </p>
                    </div>
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                      ${item.verdict === 'TRUE' ? 'bg-green-100 text-green-800' : ''}
                      ${item.verdict === 'FALSE' ? 'bg-red-100 text-red-800' : ''}
                      ${item.verdict === 'PARTIALLY_TRUE' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${item.verdict === 'UNVERIFIABLE' ? 'bg-gray-100 text-gray-800' : ''}
                      ${item.verdict === 'PENDING' ? 'bg-blue-100 text-blue-800' : ''}
                    `}>
                      {item.verdict?.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {history.length === 0 && !result && !isVerifying && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No verifications yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Enter a claim above to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
