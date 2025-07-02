import React from 'react';

export const SkipNavigation: React.FC = () => {
  return (
    <div className="sr-only focus:not-sr-only">
      <a
        href="#main-content"
        className="absolute top-0 left-0 z-[9999] px-4 py-2 bg-blue-600 text-white font-medium rounded-br-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform -translate-y-full focus:translate-y-0 transition-transform duration-200"
      >
        Skip to main content
      </a>
      <a
        href="#navigation"
        className="absolute top-0 left-32 z-[9999] px-4 py-2 bg-blue-600 text-white font-medium rounded-br-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform -translate-y-full focus:translate-y-0 transition-transform duration-200"
      >
        Skip to navigation
      </a>
    </div>
  );
};