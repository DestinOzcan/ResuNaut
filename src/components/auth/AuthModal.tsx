import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { AccessibleModal } from '../ui/AccessibleModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  const handleSuccess = () => {
    onClose();
  };

  const title = mode === 'login' ? 'Sign In to ResuNaut' : 'Join the ResuNaut Crew';
  const description = mode === 'login' 
    ? 'Sign in to your account to continue your career mission'
    : 'Create your account to start optimizing your resume with AI';

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      size="md"
    >
      {mode === 'login' ? (
        <LoginForm
          onSwitchToSignup={() => setMode('signup')}
          onSuccess={handleSuccess}
        />
      ) : (
        <SignupForm
          onSwitchToLogin={() => setMode('login')}
          onSuccess={handleSuccess}
        />
      )}
    </AccessibleModal>
  );
};