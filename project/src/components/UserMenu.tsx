import React, { useState } from 'react';
import { User, LogOut, Settings, Crown, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useSubscription } from '../hooks/useSubscription';

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth();
  const { subscription, isActive } = useSubscription();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const getDisplayName = () => {
    return user.email?.split('@')[0] || 'Astronaut';
  };

  const getPlanName = () => {
    if (subscription?.product_name) {
      return subscription.product_name;
    }
    return 'Free Explorer';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-all duration-200"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-medium text-white">{getDisplayName()}</p>
          <div className="flex items-center space-x-1">
            {isActive && <Crown className="w-3 h-3 text-yellow-400" />}
            <p className="text-xs text-gray-400">{getPlanName()}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-20">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">{getDisplayName()}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>
              </div>
              
              {subscription && (
                <div className="mt-3 p-2 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Current Plan</span>
                    {isActive && <Crown className="w-4 h-4 text-yellow-400" />}
                  </div>
                  <p className="text-sm font-medium text-white">{getPlanName()}</p>
                  {subscription.subscription_status && (
                    <p className="text-xs text-gray-400 capitalize">
                      Status: {subscription.subscription_status.replace('_', ' ')}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Navigate to settings page
                }}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};