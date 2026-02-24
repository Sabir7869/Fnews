'use client';

import { useState } from 'react';

export default function VerificationForm({ onSubmit, isLoading }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim() && !isLoading) {
      onSubmit(content.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a news headline, claim, or statement to verify..."
          rows={4}
          disabled={isLoading}
          className={`
            w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            resize-none transition
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        
        {/* Character count */}
        <span className="absolute bottom-3 right-3 text-xs text-gray-400">
          {content.length} characters
        </span>
      </div>

      <button
        type="submit"
        disabled={!content.trim() || isLoading}
        className={`
          mt-4 w-full py-3 px-6 rounded-xl font-semibold text-white
          transition-all duration-200
          ${content.trim() && !isLoading
            ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            : 'bg-gray-400 cursor-not-allowed'
          }
        `}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Analyzing with AI... (This may take a moment)
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Verify This Claim
          </span>
        )}
      </button>
    </form>
  );
}
