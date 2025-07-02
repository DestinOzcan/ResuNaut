import React from 'react';
import { Check, Loader, Star, Rocket } from 'lucide-react';
import { AnalysisStep } from '../types';
import { ProgressBar } from './ui/ProgressBar';
import { VisuallyHidden } from './accessibility/VisuallyHidden';

interface AnalysisProgressProps {
  steps: AnalysisStep[];
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ steps }) => {
  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const overallProgress = (completedSteps / totalSteps) * 100;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Star className="w-5 h-5 text-blue-400" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-white">Mission Progress</h3>
      </div>
      
      {/* Overall Progress */}
      <div className="mb-6">
        <ProgressBar
          value={overallProgress}
          label="Overall Mission Progress"
          color="purple"
          size="lg"
        />
      </div>

      {/* Individual Steps */}
      <div className="space-y-4" role="list" aria-label="Analysis steps">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-4" role="listitem">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              step.completed
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg shadow-blue-500/25'
                : step.progress > 0
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/25'
                : 'bg-gray-800 border border-gray-700'
            }`}>
              {step.completed ? (
                <>
                  <Check className="w-4 h-4 text-white" aria-hidden="true" />
                  <VisuallyHidden>Completed</VisuallyHidden>
                </>
              ) : step.progress > 0 ? (
                <>
                  <Loader className="w-4 h-4 text-white animate-spin" aria-hidden="true" />
                  <VisuallyHidden>In progress</VisuallyHidden>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-gray-400" aria-hidden="true">{index + 1}</span>
                  <VisuallyHidden>Pending</VisuallyHidden>
                </>
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
                  <span className="text-sm text-purple-400 font-medium" aria-label={`${step.progress}% complete`}>
                    {step.progress}%
                  </span>
                )}
              </div>
              <p className={`text-sm ${
                step.completed ? 'text-blue-300/80' : step.progress > 0 ? 'text-purple-300/80' : 'text-gray-400'
              }`}>
                {step.description}
              </p>
              
              {step.progress > 0 && !step.completed && (
                <div className="mt-2">
                  <ProgressBar
                    value={step.progress}
                    label={`${step.title} progress`}
                    color="purple"
                    size="sm"
                    showPercentage={false}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Status announcement for screen readers */}
      <VisuallyHidden>
        <div aria-live="polite" aria-atomic="true">
          {completedSteps === totalSteps 
            ? 'All analysis steps completed successfully'
            : `Analysis in progress: ${completedSteps} of ${totalSteps} steps completed`
          }
        </div>
      </VisuallyHidden>
    </div>
  );
};