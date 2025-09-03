'use client';
import React, { useState } from 'react';
import cleanYoutubeUrl from './utils/youtubeUtils';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const cleanedQuery = cleanYoutubeUrl(searchQuery);
      console.log('Search submitted with cleaned ID:', cleanedQuery);
      router.push(`/${cleanedQuery}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          YouTube Video Tool
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Enter a YouTube video URL or ID to analyze and extract information from your favorite videos.
        </p>

        <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-teal-500 dark:focus:border-teal-500"
              placeholder="Paste YouTube URL or video ID..."
            />
            <button
              type="submit"
              className="px-6 py-3 bg-teal-600 text-white rounded-r-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:bg-teal-500 dark:hover:bg-teal-600 transition-colors"
            >
              Analyze
            </button>
          </div>
        </form>

        <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Examples:</p>
          <p className="mt-2 font-mono text-xs">
          https://www.youtube.com/watch?v=M2WTUoy4y6E
          </p>
          <p className="font-mono text-xs">
          M2WTUoy4y6E
          </p>
        </div>
      </div>
    </div>
  );
}
