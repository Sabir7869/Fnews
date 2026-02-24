'use client';

import { useState } from 'react';
import { updateFeedback, getFeedbackStats } from '@/lib/api';
import { useToast } from '@/components/Toast';
import { useAuth } from '@/context/AuthContext';

export default function FeedbackButtons({ messageId, initialStats, onStatsUpdate }) {
  const { showToast } = useToast();
  const { userId } = useAuth();
  const [stats, setStats] = useState(initialStats);
  const [userVote, setUserVote] = useState(null); // null, 'like', 'dislike'
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (liked) => {
    if (isLoading) return;

    // Use actual userId from auth context, fallback to 1 for testing
    const userIdToUse = userId || 1;

    setIsLoading(true);
    try {
      // Token is read from localStorage by API functions
      await updateFeedback(userIdToUse, messageId, liked);
      
      // Refresh stats
      const newStats = await getFeedbackStats(messageId);
      setStats(newStats);
      setUserVote(liked ? 'like' : 'dislike');
      
      if (onStatsUpdate) {
        onStatsUpdate(newStats);
      }
      
      showToast(liked ? 'Thanks for your feedback!' : 'Feedback recorded', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        {/* Like Button */}
        <button
          onClick={() => handleVote(true)}
          disabled={isLoading}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg transition
            ${userVote === 'like' 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          <span className="font-medium">{stats?.totalLikes || 0}</span>
        </button>

        {/* Dislike Button */}
        <button
          onClick={() => handleVote(false)}
          disabled={isLoading}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg transition
            ${userVote === 'dislike' 
              ? 'bg-red-500 text-white' 
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900'
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <svg className="w-5 h-5 rotate-180" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          <span className="font-medium">{stats?.totalDislikes || 0}</span>
        </button>
      </div>

      {/* Like Percentage Bar */}
      {(stats?.totalLikes > 0 || stats?.totalDislikes > 0) && (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-red-200 dark:bg-red-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${stats?.likePercent || 0}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px]">
            {stats?.likePercent?.toFixed(0) || 0}% agree
          </span>
        </div>
      )}
    </div>
  );
}
