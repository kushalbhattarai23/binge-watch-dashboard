
import React from 'react';

export const MoviesApp: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-movies-secondary via-blue-50 to-movies-accent dark:from-gray-900 dark:via-movies-secondary dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-movies-primary dark:text-movies-primary mb-2">Movies App</h1>
          <p className="text-gray-700 dark:text-gray-300">Track your movie watchlist and ratings</p>
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-8 shadow-lg text-center border border-movies-primary/20">
          <p className="text-lg text-gray-600 dark:text-gray-300">Movies app functionality coming soon...</p>
        </div>
      </div>
    </div>
  );
};
