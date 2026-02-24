'use client';

import VerdictBadge from './VerdictBadge';
import ConfidenceBar from './ConfidenceBar';
import FeedbackButtons from './FeedbackButtons';
import { useState } from 'react';

export default function ResultCard({ result, showFeedback = true }) {
  const [expanded, setExpanded] = useState(false);
  const [confidence, setConfidence] = useState(result.confidence);

  const handleStatsUpdate = (newStats) => {
    // Recalculate confidence based on new feedback
    // This is an approximation - actual value comes from backend
    const newConfidence = Math.round(
      (result.confidence * 0.7) + (newStats.likePercent * 0.3)
    );
    setConfidence(newConfidence);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <VerdictBadge verdict={result.verdict} />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {result.createdAt}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Original Claim */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Claim Analyzed
          </h3>
          <p className="text-gray-900 dark:text-white text-lg">
            "{result.content}"
          </p>
        </div>

        {/* Confidence Score */}
        <div className="mb-6">
          <ConfidenceBar confidence={confidence} />
        </div>

        {/* AI Summary */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            AI Analysis Summary
          </h3>
          <div 
            className={`
              text-gray-700 dark:text-gray-300 leading-relaxed
              ${!expanded && result.summary?.length > 300 ? 'line-clamp-3' : ''}
            `}
          >
            {result.summary || 'No summary available.'}
          </div>
          {result.summary?.length > 300 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              {expanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Author Info */}
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Verified by <span className="font-medium">{result.authorName}</span>
        </div>

        {/* Feedback Section */}
        {showFeedback && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
              Was this helpful?
            </h3>
            <FeedbackButtons 
              messageId={result.id} 
              initialStats={result.feedBackStatsDTO}
              onStatsUpdate={handleStatsUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
