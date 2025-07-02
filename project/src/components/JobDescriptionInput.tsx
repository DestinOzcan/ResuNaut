import React, { useState } from 'react';
import { Briefcase, Star, Rocket } from 'lucide-react';

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  value,
  onChange,
  onAnalyze,
  isAnalyzing
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const sampleJobDescription = `Senior Software Engineer - Stellar Tech Solutions

We are seeking a Senior Software Engineer to join our mission to revolutionize space technology. The ideal candidate will have 5+ years of experience in full-stack development.

Requirements:
• 5+ years of software development experience
• Proficiency in JavaScript, TypeScript, React, and Node.js
• Experience with cloud platforms (AWS, Azure, or GCP)
• Strong knowledge of databases (SQL and NoSQL)
• Experience with containerization (Docker, Kubernetes)
• Familiarity with CI/CD pipelines and DevOps practices
• Strong problem-solving and communication skills
• Experience with Agile/Scrum methodologies

Preferred Qualifications:
• Experience with machine learning or data science
• Knowledge of microservices architecture
• Experience with GraphQL and REST APIs
• Familiarity with testing frameworks (Jest, Cypress)

We offer competitive compensation, excellent benefits, and opportunities for professional growth in the space technology sector.`;

  const handleSampleClick = () => {
    onChange(sampleJobDescription);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-medium text-white">Mission Briefing</h3>
        </div>
        {!value && (
          <button
            onClick={handleSampleClick}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center space-x-1"
          >
            <Star className="w-3 h-3" />
            <span>Use Sample Mission</span>
          </button>
        )}
      </div>

      <div className={`relative transition-all duration-300 ${
        isFocused ? 'ring-2 ring-blue-500/50' : ''
      }`}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Paste the job description here..."
          className="w-full h-64 p-4 bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl resize-none focus:outline-none focus:border-blue-500/50 transition-all duration-300 text-white placeholder-gray-500"
        />
        {value && (
          <div className="absolute bottom-4 right-4 text-sm text-gray-500">
            {value.length} characters
          </div>
        )}
      </div>

      <button
        onClick={onAnalyze}
        disabled={!value || isAnalyzing}
        className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
          !value || isAnalyzing
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25'
        }`}
      >
        {isAnalyzing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Launching Analysis...</span>
          </>
        ) : (
          <>
            <Rocket className="w-5 h-5" />
            <span>Launch Career Mission</span>
          </>
        )}
      </button>
    </div>
  );
};