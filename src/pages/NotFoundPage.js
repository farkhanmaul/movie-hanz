import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-netflix-red mb-4">404</h1>
          <div className="w-24 h-1 bg-netflix-red mx-auto mb-8"></div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
          <p className="text-xl text-gray-300 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-400">
            The cast member or content you're trying to access might have been removed or the URL is incorrect.
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            to="/" 
            className="inline-block bg-netflix-red hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Back to Home
          </Link>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link 
              to="/trending" 
              className="text-gray-300 hover:text-white transition-colors duration-300 underline"
            >
              Trending
            </Link>
            <Link 
              to="/nowplaying" 
              className="text-gray-300 hover:text-white transition-colors duration-300 underline"
            >
              Now Playing
            </Link>
            <Link 
              to="/toprated" 
              className="text-gray-300 hover:text-white transition-colors duration-300 underline"
            >
              Top Rated
            </Link>
            <Link 
              to="/genres" 
              className="text-gray-300 hover:text-white transition-colors duration-300 underline"
            >
              Genres
            </Link>
          </div>
        </div>

        <div className="mt-12 opacity-50">
          <svg 
            className="w-24 h-24 mx-auto text-gray-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9zM6 7v11h12V7H6zm3 3a1 1 0 012 0v5a1 1 0 01-2 0v-5zm4 0a1 1 0 012 0v5a1 1 0 01-2 0v-5z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;