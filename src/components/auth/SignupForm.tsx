import React, { useState } from 'react';
import { Rocket, Mail, Lock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AccessibleInput } from '../ui/AccessibleInput';
import { AccessibleButton } from '../ui/AccessibleButton';
import { useAnnouncement } from '../../hooks/useAnnouncement';
import { LiveRegion } from '../accessibility/LiveRegion';

interface SignupFormProps {
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const { announcement, announce } = useAnnouncement();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    announce('Creating your account, please wait...');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      announce('Account creation failed: Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      announce('Account creation failed: Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const { error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setError(signUpError.message);
      announce(`Account creation failed: ${signUpError.message}`);
    } else {
      setSuccess(true);
      announce('Account created successfully! Welcome to the crew. Redirecting you to mission control...');
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <>
        <LiveRegion message={announcement} />
        <div className="max-w-md mx-auto text-center" role="status" aria-live="polite">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <CheckCircle className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to the Crew!</h2>
          <p className="text-gray-400 mb-6">
            Your account has been created successfully. You're now ready to launch your career mission.
          </p>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 text-sm">
              Redirecting you to mission control...
            </p>
          </div>
        </div>
      </>
    );
  }

  const passwordsMatch = password === confirmPassword;
  const passwordLongEnough = password.length >= 6;

  return (
    <>
      <LiveRegion message={announcement} />
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <Rocket className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Join the Mission</h2>
          <p className="text-gray-400">Create your account and start your career journey</p>
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
            placeholder="Create a password"
            showPasswordToggle
            isRequired
            autoComplete="new-password"
            helperText="Must be at least 6 characters long"
            error={password && !passwordLongEnough ? 'Password must be at least 6 characters long' : undefined}
          />

          <AccessibleInput
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            leftIcon={<Lock className="w-5 h-5" />}
            placeholder="Confirm your password"
            showPasswordToggle
            isRequired
            autoComplete="new-password"
            error={confirmPassword && !passwordsMatch ? 'Passwords do not match' : undefined}
          />

          <AccessibleButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={loading}
            loadingText="Preparing Launch..."
            disabled={!email || !password || !confirmPassword || !passwordsMatch || !passwordLongEnough}
            leftIcon={!loading ? <Rocket className="w-5 h-5" /> : undefined}
          >
            Join the Crew
          </AccessibleButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <AccessibleButton
              variant="ghost"
              onClick={onSwitchToLogin}
              className="text-blue-400 hover:text-blue-300 font-medium p-0 h-auto"
            >
              Sign in
            </AccessibleButton>
          </p>
        </div>
      </div>
    </>
  );
};