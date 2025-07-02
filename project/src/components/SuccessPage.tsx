import React, { useEffect, useState } from 'react';
import { CheckCircle, Rocket, ArrowRight, Star } from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

export const SuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-blue-500/25 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          {/* Success Message */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Mission Successful</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Payment{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Confirmed!
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-6">
              Welcome aboard, astronaut! Your payment has been processed successfully 
              and you're now ready to launch your career to new heights.
            </p>
          </div>

          {/* Features Unlocked */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-center">
              <Rocket className="w-5 h-5 mr-2 text-blue-400" />
              Mission Control Activated
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span>AI-powered resume optimization</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span>ATS compatibility checks</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span>Keyword analysis & suggestions</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span>Cover letter generation</span>
              </div>
            </div>
          </div>

          {/* Session Info */}
          {sessionId && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8">
              <p className="text-blue-400 text-sm">
                Transaction ID: <span className="font-mono">{sessionId}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              <Rocket className="w-5 h-5" />
              <span>Start Your Mission</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <p className="text-gray-400 text-sm">
              Redirecting automatically in {countdown} seconds...
            </p>
          </div>

          {/* Support Info */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              Need help? Contact our mission control team at{' '}
              <a href="mailto:support@resunaut.com" className="text-blue-400 hover:text-blue-300">
                support@resunaut.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};