import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Rocket, Zap, Target, Users, Sparkles, Star, CreditCard } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { AnalysisProgress } from './components/AnalysisProgress';
import { AnalysisResults } from './components/AnalysisResults';
import { AuthModal } from './components/auth/AuthModal';
import { UserMenu } from './components/UserMenu';
import { PricingPage } from './pages/PricingPage';
import { SuccessPage } from './components/SuccessPage';
import { SkipNavigation } from './components/accessibility/SkipNavigation';
import { VisuallyHidden } from './components/accessibility/VisuallyHidden';
import { AccessibleButton } from './components/ui/AccessibleButton';
import { Resume, AnalysisResult, AnalysisStep } from './types';
import { parseJobDescription, analyzeResume, getAnalysisSteps } from './utils/resumeAnalysis';
import { useAuth } from './hooks/useAuth';
import { useAnnouncement } from './hooks/useAnnouncement';
import { LiveRegion } from './components/accessibility/LiveRegion';
import { Link } from 'react-router-dom';

type AppState = 'upload' | 'input' | 'analyzing' | 'results';

function MainApp() {
  const { user, loading } = useAuth();
  const { announcement, announce } = useAnnouncement();
  const [currentState, setCurrentState] = useState<AppState>('upload');
  const [uploadedResume, setUploadedResume] = useState<Resume | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisSteps, setAnalysisSteps] = useState<AnalysisStep[]>(getAnalysisSteps());
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleFileUpload = (resume: Resume) => {
    setUploadedResume(resume);
    setCurrentState('input');
    announce('Resume uploaded successfully. Please enter the job description to continue.');
  };

  const handleAnalyze = async () => {
    if (!uploadedResume || !jobDescription) return;

    if (!user) {
      setShowAuthModal(true);
      announce('Please sign in to analyze your resume.');
      return;
    }

    setCurrentState('analyzing');
    announce('Starting resume analysis. This may take a few moments.');
    
    // Reset analysis steps
    const steps = getAnalysisSteps();
    setAnalysisSteps(steps);

    // Simulate analysis process
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      
      // Update progress
      for (let progress = 0; progress <= 100; progress += 20) {
        setAnalysisSteps(prev => prev.map((s, index) => 
          index === i ? { ...s, progress } : s
        ));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Mark as completed
      setAnalysisSteps(prev => prev.map((s, index) => 
        index === i ? { ...s, completed: true, progress: 100 } : s
      ));
      
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Perform actual analysis
    const jobDesc = parseJobDescription(jobDescription);
    const result = analyzeResume(uploadedResume.content, jobDesc);
    setAnalysisResult(result);
    setCurrentState('results');
    announce(`Analysis complete! Your resume has a ${result.matchScore}% match score with ${result.suggestions.length} optimization suggestions.`);
  };

  const resetApplication = () => {
    setCurrentState('upload');
    setUploadedResume(null);
    setJobDescription('');
    setAnalysisResult(null);
    setAnalysisSteps(getAnalysisSteps());
    announce('Application reset. You can upload a new resume to start over.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center" role="status" aria-live="polite">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Rocket className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <p className="text-gray-400">Initializing mission control...</p>
          <VisuallyHidden>Loading application, please wait</VisuallyHidden>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      <SkipNavigation />
      <LiveRegion message={announcement} />
      
      {/* Cosmic Background */}
      <div className="absolute inset-0 opacity-30" aria-hidden="true">
        <div className="absolute top-20 left-10 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-40 right-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-300"></div>
      </div>

      {/* Header */}
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-50" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Rocket className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ResuNaut</h1>
                <p className="text-sm text-gray-400">Navigate your career journey</p>
              </div>
            </div>
            
            <nav id="navigation" role="navigation" aria-label="Main navigation">
              <div className="flex items-center space-x-4">
                <Link
                  to="/pricing"
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 transition-all duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950"
                >
                  <CreditCard className="w-4 h-4" aria-hidden="true" />
                  <span>Pricing</span>
                </Link>
                
                {user ? (
                  <UserMenu />
                ) : (
                  <div className="flex items-center space-x-2">
                    <AccessibleButton
                      variant="ghost"
                      onClick={() => setShowAuthModal(true)}
                      className="text-gray-300 hover:text-white"
                    >
                      Sign In
                    </AccessibleButton>
                    <AccessibleButton
                      variant="primary"
                      onClick={() => setShowAuthModal(true)}
                    >
                      Get Started
                    </AccessibleButton>
                  </div>
                )}
                
                {currentState === 'results' && (
                  <AccessibleButton
                    variant="secondary"
                    onClick={resetApplication}
                    ariaLabel="Start a new resume analysis"
                  >
                    New Mission
                  </AccessibleButton>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10" role="main">
        {currentState === 'upload' && (
          <div className="max-w-2xl mx-auto">
            {/* Hero Section */}
            <section className="text-center mb-12" aria-labelledby="hero-heading">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <Star className="w-4 h-4 text-blue-400" aria-hidden="true" />
                <span className="text-sm font-medium text-blue-400">AI-Powered Mission Control</span>
              </div>
              
              <h2 id="hero-heading" className="text-4xl font-bold text-white mb-4">
                Launch Your Career with{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Cosmic Intelligence
                </span>
              </h2>
              <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                Upload your resume and job description to get AI-powered optimization 
                that propels your career to new heights. Ready for liftoff?
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" role="list" aria-label="Key features">
                <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 hover:border-blue-500/30 transition-all duration-300 group" role="listitem">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-blue-400" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Smart Navigation</h3>
                  <p className="text-sm text-gray-400">
                    AI analyzes job requirements and charts your optimal career course
                  </p>
                </div>
                <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 hover:border-purple-500/30 transition-all duration-300 group" role="listitem">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 h-6 text-purple-400" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Mission Ready</h3>
                  <p className="text-sm text-gray-400">
                    Ensures your resume passes through any tracking system
                  </p>
                </div>
                <div className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 hover:border-cyan-500/30 transition-all duration-300 group" role="listitem">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-cyan-400" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">Expert Guidance</h3>
                  <p className="text-sm text-gray-400">
                    Get insights from the career cosmos to land your dream role
                  </p>
                </div>
              </div>
            </section>

            <FileUpload 
              onFileUpload={handleFileUpload}
              uploadedFile={uploadedResume || undefined}
            />
          </div>
        )}

        {currentState === 'input' && (
          <section className="max-w-4xl mx-auto" aria-labelledby="input-heading">
            <VisuallyHidden>
              <h2 id="input-heading">Enter Job Description</h2>
            </VisuallyHidden>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={setJobDescription}
                  onAnalyze={handleAnalyze}
                  isAnalyzing={false}
                />
              </div>
              <aside aria-labelledby="payload-heading">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6">
                  <h3 id="payload-heading" className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Rocket className="w-5 h-5 mr-2 text-blue-400" aria-hidden="true" />
                    Mission Payload
                  </h3>
                  {uploadedResume && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                          <Rocket className="w-5 h-5 text-blue-400" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{uploadedResume.fileName}</p>
                          <p className="text-sm text-gray-400">
                            Uploaded {uploadedResume.uploadedAt.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-800/50 p-4 rounded-lg max-h-40 overflow-y-auto border border-gray-700/50">
                        <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                          {uploadedResume.content.substring(0, 300)}...
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </section>
        )}

        {currentState === 'analyzing' && (
          <section className="max-w-2xl mx-auto" aria-labelledby="analysis-heading">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Rocket className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h2 id="analysis-heading" className="text-3xl font-bold text-white mb-4">Mission in Progress</h2>
              <p className="text-lg text-gray-400">
                Our AI astronauts are analyzing your resume and charting the optimal course to your dream job.
              </p>
            </div>
            <AnalysisProgress steps={analysisSteps} />
          </section>
        )}

        {currentState === 'results' && analysisResult && uploadedResume && (
          <section className="max-w-6xl mx-auto" aria-labelledby="results-heading">
            <div className="text-center mb-8">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
                <Star className="w-4 h-4 text-blue-400" aria-hidden="true" />
                <span className="text-sm font-medium text-blue-400">Mission Complete</span>
              </div>
              <h2 id="results-heading" className="text-3xl font-bold text-white mb-4">Your Optimized Resume</h2>
              <p className="text-lg text-gray-400">
                Houston, we have success! Here's your personalized flight plan to career advancement.
              </p>
            </div>
            <AnalysisResults 
              result={analysisResult}
              originalResume={uploadedResume.content}
            />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/30 border-t border-gray-800/50 mt-16 relative z-10" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 ResuNaut. Powered by AI to navigate your career journey to the stars.</p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;