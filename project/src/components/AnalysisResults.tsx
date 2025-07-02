import React, { useState, useMemo } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Download, Star, Rocket, RotateCcw, Check } from 'lucide-react';
import { AnalysisResult, Suggestion, OptimizationState } from '../types';

interface AnalysisResultsProps {
  result: AnalysisResult;
  originalResume: string;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, originalResume }) => {
  const [optimizationState, setOptimizationState] = useState<OptimizationState>(() => {
    // Initialize all suggestions as enabled by default
    const initialState: OptimizationState = {};
    result.suggestions.forEach(suggestion => {
      initialState[suggestion.id] = true;
    });
    return initialState;
  });

  // Generate optimized content based on selected optimizations
  const optimizedContent = useMemo(() => {
    let content = originalResume;
    
    result.suggestions.forEach(suggestion => {
      if (optimizationState[suggestion.id]) {
        if (suggestion.type === 'keyword') {
          // Add missing keywords to skills section
          const keyword = suggestion.title.match(/"([^"]+)"/)?.[1];
          if (keyword) {
            const skillsRegex = /(skills?:?\s*)([^\n]+)/i;
            const match = content.match(skillsRegex);
            
            if (match && !match[2].toLowerCase().includes(keyword.toLowerCase())) {
              const currentSkills = match[2];
              const newSkills = `${currentSkills}, ${keyword}`;
              content = content.replace(skillsRegex, `$1${newSkills}`);
            } else if (!match) {
              // Add skills section if it doesn't exist
              content += `\n\nSKILLS\n${keyword}`;
            }
          }
        } else if (suggestion.original && suggestion.improved) {
          // Replace original text with improved version
          content = content.replace(suggestion.original, suggestion.improved);
        }
      }
    });
    
    return content;
  }, [originalResume, result.suggestions, optimizationState]);

  const toggleOptimization = (suggestionId: string) => {
    setOptimizationState(prev => ({
      ...prev,
      [suggestionId]: !prev[suggestionId]
    }));
  };

  const applyAllOptimizations = () => {
    const newState: OptimizationState = {};
    result.suggestions.forEach(suggestion => {
      newState[suggestion.id] = true;
    });
    setOptimizationState(newState);
  };

  const resetAllOptimizations = () => {
    const newState: OptimizationState = {};
    result.suggestions.forEach(suggestion => {
      newState[suggestion.id] = false;
    });
    setOptimizationState(newState);
  };

  const enabledOptimizations = Object.values(optimizationState).filter(Boolean).length;
  const totalOptimizations = result.suggestions.length;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-blue-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30';
    if (score >= 60) return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-yellow-500/30';
    return 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/30';
  };

  const getPriorityColor = (priority: Suggestion['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getSuggestionIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'keyword': return '🚀';
      case 'formatting': return '🛸';
      case 'content': return '⭐';
      case 'ats': return '🌌';
    }
  };

  return (
    <div className="space-y-6">
      {/* Score Overview */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Mission Results</h3>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/25">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Download Resume</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Match Score */}
          <div className={`p-4 rounded-lg border ${getScoreBgColor(result.matchScore)}`}>
            <div className="flex items-center space-x-3">
              <TrendingUp className={`w-6 h-6 ${getScoreColor(result.matchScore)}`} />
              <div>
                <h4 className="text-sm font-medium text-gray-300">Mission Score</h4>
                <p className={`text-2xl font-bold ${getScoreColor(result.matchScore)}`}>
                  {result.matchScore}%
                </p>
              </div>
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="p-4 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-300">Missing Elements</h4>
                <p className="text-2xl font-bold text-orange-400">{result.missingKeywords.length}</p>
              </div>
            </div>
          </div>

          {/* Matched Keywords */}
          <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-blue-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-300">Aligned Skills</h4>
                <p className="text-2xl font-bold text-blue-400">{result.strengthKeywords.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Keywords Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Missing Elements</h4>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-full border border-red-500/30"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-3">Aligned Skills</h4>
            <div className="flex flex-wrap gap-2">
              {result.strengthKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mission Optimization Panel */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-semibold text-white">Mission Optimization</h3>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
              {enabledOptimizations}/{totalOptimizations} active
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={resetAllOptimizations}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors text-gray-300 hover:text-white text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All</span>
            </button>
            <button
              onClick={applyAllOptimizations}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-all duration-200 text-sm"
            >
              <Check className="w-4 h-4" />
              <span>Apply All</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {result.suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                optimizationState[suggestion.id]
                  ? 'border-blue-500/50 bg-blue-500/10'
                  : 'border-gray-700/50 bg-gray-800/30'
              }`}
            >
              <div className="flex items-start space-x-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={optimizationState[suggestion.id] || false}
                    onChange={() => toggleOptimization(suggestion.id)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                    optimizationState[suggestion.id]
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}>
                    {optimizationState[suggestion.id] && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                </label>
                
                <span className="text-xl">{getSuggestionIcon(suggestion.type)}</span>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-sm font-medium transition-colors ${
                      optimizationState[suggestion.id] ? 'text-blue-400' : 'text-white'
                    }`}>
                      {suggestion.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(suggestion.priority)}`}>
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{suggestion.description}</p>
                  
                  {suggestion.original && suggestion.improved && (
                    <div className="space-y-2">
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <p className="text-xs font-medium text-red-400 mb-1">Before:</p>
                        <p className="text-sm text-red-300">{suggestion.original}</p>
                      </div>
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-xs font-medium text-blue-400 mb-1">After:</p>
                        <p className="text-sm text-blue-300">{suggestion.improved}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-Side Resume Comparison */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Star className="w-5 h-5 text-blue-400" />
          <h3 className="text-xl font-semibold text-white">Mission Comparison</h3>
          <span className="text-sm text-gray-400">
            Live preview with {enabledOptimizations} optimization{enabledOptimizations !== 1 ? 's' : ''} applied
          </span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Resume */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <h4 className="text-sm font-medium text-gray-300">Original Resume</h4>
            </div>
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg overflow-hidden">
              <div className="bg-gray-800/80 px-4 py-2 border-b border-gray-700/50">
                <p className="text-xs text-gray-400">Original • {Math.round(originalResume.length / 1000)}k characters</p>
              </div>
              <div className="p-4 h-96 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {originalResume}
                </pre>
              </div>
            </div>
          </div>

          {/* Optimized Resume */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <h4 className="text-sm font-medium text-gray-300">Optimized Resume</h4>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg overflow-hidden">
              <div className="bg-blue-500/20 px-4 py-2 border-b border-blue-500/30">
                <p className="text-xs text-blue-400">
                  Optimized • {Math.round(optimizedContent.length / 1000)}k characters • 
                  {enabledOptimizations} improvement{enabledOptimizations !== 1 ? 's' : ''} applied
                </p>
              </div>
              <div className="p-4 h-96 overflow-y-auto">
                <pre className="text-sm text-blue-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {optimizedContent}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
            <div className="text-center">
              <p className="text-lg font-bold text-white">{enabledOptimizations}</p>
              <p className="text-xs text-gray-400">Active Optimizations</p>
            </div>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <div className="text-center">
              <p className="text-lg font-bold text-blue-400">
                +{Math.round(((optimizedContent.length - originalResume.length) / originalResume.length) * 100)}%
              </p>
              <p className="text-xs text-blue-300">Content Enhancement</p>
            </div>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30">
            <div className="text-center">
              <p className="text-lg font-bold text-purple-400">
                {Math.min(result.matchScore + (enabledOptimizations * 5), 100)}%
              </p>
              <p className="text-xs text-purple-300">Projected Match Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};