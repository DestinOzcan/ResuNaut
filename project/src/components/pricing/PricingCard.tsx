import React, { useState } from 'react';
import { Check, Loader, Star } from 'lucide-react';
import { StripeProduct } from '../../stripe-config';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface PricingCardProps {
  product: StripeProduct;
  isPopular?: boolean;
  onAuthRequired: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({ product, isPopular, onAuthRequired }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Free';
    
    const formatter = new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: currency.toUpperCase(),
    });
    
    return formatter.format(price);
  };

  const handlePurchase = async () => {
    setLoading(true);

    try {
      // Get the current session (user must be logged in)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('You must be logged in to purchase.');
        setLoading(false);
        return;
      }

      const res = await fetch('https://wpjmggsotpnqcbyjkcyt.supabase.co/functions/v1/stripe-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          price_id: product.priceId,
          mode: product.mode,
          success_url: window.location.origin + '/success',
          cancel_url: window.location.origin + '/pricing',
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Unknown error');
        console.error('Stripe error:', data);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  const getFeatures = (productName: string) => {
    switch (productName) {
      case 'ResuNaut Explorer':
        return [
          'Basic resume scan',
          '3 optimizations per month',
          'ATS compatibility check',
          'Basic keyword analysis'
        ];
      case 'ResuNaut Boost Pack':
        return [
          'AI-powered resume optimization',
          'Custom cover letter generation',
          'ATS compatibility check',
          'Keyword optimization',
          'One-time use'
        ];
      case 'ResuNaut Pilot':
        return [
          'Unlimited resume optimizations',
          'Advanced ATS compatibility',
          'Real-time keyword analysis',
          'Cover letter generation',
          'Priority support'
        ];
      case 'ResuNaut Commander':
        return [
          'Everything in Pilot',
          'Advanced AI insights',
          'Industry-specific optimization',
          'Personal career advisor',
          'Save 20% with annual billing'
        ];
      default:
        return [];
    }
  };

  return (
    <div className={`relative p-6 rounded-xl border transition-all duration-300 hover:scale-105 ${
      isPopular
        ? 'border-blue-500/50 bg-gradient-to-b from-blue-500/10 to-purple-500/10 shadow-lg shadow-blue-500/25'
        : 'border-gray-700/50 bg-gray-900/50 hover:border-gray-600/50'
    }`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            <Star className="w-3 h-3" />
            <span>Most Popular</span>
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
        <div className="mb-4">
          <span className="text-3xl font-bold text-white">
            {formatPrice(product.price, product.currency)}
          </span>
          {product.interval && (
            <span className="text-gray-400 ml-1">
              /{product.interval}
            </span>
          )}
        </div>
        <p className="text-gray-400 text-sm">{product.description}</p>
      </div>

      <ul className="space-y-3 mb-6">
        {getFeatures(product.name).map((feature, index) => (
          <li key={index} className="flex items-center space-x-3">
            <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handlePurchase}
        disabled={loading}
        className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
          product.price === 0
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
            : isPopular
            ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25'
            : 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </div>
        ) : product.price === 0 ? (
          'Get Started Free'
        ) : product.mode === 'subscription' ? (
          'Start Subscription'
        ) : (
          'Purchase Now'
        )}
      </button>
    </div>
  );
};