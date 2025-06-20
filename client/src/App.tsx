import React, { useState } from 'react';
import { Moon, Sun, Heart, Zap, Target } from 'lucide-react';
import DietForm from './components/DietForm';
import DietPlan from './components/DietPlan';
import Header from './components/Header';
import Footer from './components/Footer';
import { UserData, DietPlanResponse } from './types';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [dietPlan, setDietPlan] = useState<DietPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handlePlanGenerated = (plan: DietPlanResponse) => {
    setDietPlan(plan);
    setLoading(false);
  };

  const handleNewPlan = () => {
    setDietPlan(null);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        
        <main className="container mx-auto px-4 py-8">
          {!dietPlan ? (
            <>
              {/* Hero Section */}
              <div className="text-center mb-12 animate-fade-in">
                <div className="gradient-bg text-white rounded-2xl p-8 mb-8">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    AI-Powered Diet Plan Generator
                  </h1>
                  <p className="text-xl md:text-2xl opacity-90 mb-6">
                    Get personalized nutrition plans tailored to your goals
                  </p>
                  <div className="flex justify-center space-x-8 text-sm md:text-base">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5" />
                      <span>Personalized</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span>AI-Powered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Goal-Oriented</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <DietForm 
                onPlanGenerated={handlePlanGenerated}
                loading={loading}
                setLoading={setLoading}
              />
            </>
          ) : (
            <DietPlan 
              plan={dietPlan} 
              onNewPlan={handleNewPlan}
            />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;