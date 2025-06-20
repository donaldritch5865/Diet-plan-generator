import React from 'react';
import { Brain, Utensils, Heart } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="relative">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4 text-primary-600">
          <Brain className="w-8 h-8 animate-pulse" />
          <Utensils className="w-8 h-8 animate-pulse" style={{ animationDelay: '0.2s' }} />
          <Heart className="w-8 h-8 animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Generating Your Personalized Diet Plan
        </h2>
        
        <div className="space-y-2 text-gray-600 dark:text-gray-400">
          <p className="animate-pulse">🧠 Analyzing your health profile...</p>
          <p className="animate-pulse" style={{ animationDelay: '1s' }}>
            🍽️ Creating customized meal plans...
          </p>
          <p className="animate-pulse" style={{ animationDelay: '2s' }}>
            💪 Calculating nutritional requirements...
          </p>
          <p className="animate-pulse" style={{ animationDelay: '3s' }}>
            ✨ Finalizing your recommendations...
          </p>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          This usually takes 10-15 seconds
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;