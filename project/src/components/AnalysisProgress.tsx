import React from 'react';
import { Check, Loader, Star, Rocket } from 'lucide-react';
import { AnalysisStep } from '../types';

interface AnalysisProgressProps {
  steps: AnalysisStep[];
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ steps }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Star className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Mission Progress</h3>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-4">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              step.completed
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25'
                : step.progress > 0
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/25'
                : 'bg-gray-800 border border-gray-700'
            }`}>
              {step.completed ? (
                <Check className="w-4 h-4 text-white" />
              ) : step.progress > 0 ? (
                <Loader className="w-4 h-4 text-white animate-spin" />
              ) : (
                <span className="text-sm font-medium text-gray-400">{index + 1}</span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-medium ${
                  step.completed ? 'text-blue-400' : step.progress > 0 ? 'text-purple-400' : 'text-white'
                }`}>
                  {step.title}
                </h4>
                {step.progress > 0 && !step.completed && (
                  <span className="text-sm text-purple-400 font-medium">{step.progress}%</span>
                )}
              </div>
              <p className={`text-sm ${
                step.completed ? 'text-blue-300/80' : step.progress > 0 ? 'text-purple-300/80' : 'text-gray-400'
              }`}>
                {step.description}
              </p>
              
              {step.progress > 0 && !step.completed && (
                <div className="mt-2 bg-gray-800 rounded-full h-1">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${step.progress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};