// components/LoadingSpinner.js
import React from 'react';

const LoadingSpinner = ({ darkMode, message = "Loading your tasks..." }) => (
  <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{message}</p>
    </div>
  </div>
);

export default LoadingSpinner;