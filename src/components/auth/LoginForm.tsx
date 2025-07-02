import React, { useState } from 'react';
import { Rocket, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AccessibleInput } from '../ui/AccessibleInput';
import { AccessibleButton } from '../ui/AccessibleButton';
import { useAnnouncement } from '../../hooks/useAnnouncement';
import { LiveRegion } from '../accessibility/LiveRegion';

interface LoginFormProps {
  onSwitchToSignup: () => void;
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToSignup, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const { announcement, announce } = useAnnouncement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    announce('Signing in, please wait...');

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      announce(`Sign in failed: ${signInError.message}`);
    } else {
      announce('Successfully signed in! Welcome back, astronaut.');
      onSuccess?.();
    }

    setLoading(false);
  };

  return (
    <>
      <LiveRegion message={announcement} />
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Rocket className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back, Astronaut</h2>
          <p className="text-gray-400">Sign in to continue your career mission</p>
        </div>

        {error && (
          <div 
            className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
            role="alert"
            aria-live="polite"
          >
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <AccessibleInput
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-5 h-5" />}
            placeholder="Enter your email"
            isRequired
            autoComplete="email"
          />

          <AccessibleInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-5 h-5" />}
            placeholder="Enter your password"
            showPasswordToggle
            isRequired
            autoComplete="current-password"
          />

          <AccessibleButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={loading}
            loadingText="Launching..."
            disabled={!email || !password}
            leftIcon={!loading ? <Rocket className="w-5 h-5" /> : undefined}
          >
            Launch Mission
          </AccessibleButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            New to ResuNaut?{' '}
            <AccessibleButton
              variant="ghost"
              onClick={onSwitchToSignup}
              className="text-blue-400 hover:text-blue-300 font-medium p-0 h-auto"
            >
              Join the crew
            </AccessibleButton>
          </p>
        </div>
      </div>
    </>
  );
};