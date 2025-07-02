import React, { useState } from 'react';
import { Rocket, Star } from 'lucide-react';
import { stripeProducts } from '../../stripe-config';
import { PricingCard } from './PricingCard';
import { AuthModal } from '../auth/AuthModal';

export const PricingSection: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuthRequired = () => {
    setShowAuthModal(true);
  };

  return (
    <div className="py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
          <Star className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-blue-400">Mission Packages</span>
        </div>
        
        <h2 className="text-4xl font-bold text-white mb-4">
          Choose Your{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Career Mission
          </span>
        </h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Select the perfect plan to launch your career to new heights. 
          From basic scans to full mission control, we've got you covered.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {stripeProducts.map((product, index) => (
          <PricingCard
            key={product.id}
            product={product}
            isPopular={product.name === 'ResuNaut Pilot'}
            onAuthRequired={handleAuthRequired}
          />
        ))}
      </div>

      <div className="text-center mt-12">
        <div className="inline-flex items-center space-x-2 bg-gray-900/50 border border-gray-800/50 rounded-lg px-4 py-3">
          <Rocket className="w-5 h-5 text-blue-400" />
          <span className="text-gray-300 text-sm">
            All plans include secure payment processing and instant access
          </span>
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signup"
      />
    </div>
  );
};