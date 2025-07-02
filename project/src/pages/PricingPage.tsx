import React from 'react';
import { Rocket } from 'lucide-react';
import { PricingSection } from '../components/pricing/PricingSection';
import { Link } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
      </div>

      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ResuNaut</h1>
                <p className="text-sm text-gray-400">Navigate your career journey</p>
              </div>
            </Link>
            
            <Link
              to="/"
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 transition-all duration-200 hover:text-white"
            >
              Back to App
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <PricingSection />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/30 border-t border-gray-800/50 mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 ResuNaut. Powered by AI to navigate your career journey to the stars.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};