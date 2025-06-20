import React, { useState } from 'react';
import { Calculator, Target, Droplets, Calendar, Activity, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { UserData, DietPlanResponse } from '../types';
import BMICalculator from './BMICalculator';
import LoadingSpinner from './LoadingSpinner';

interface DietFormProps {
  onPlanGenerated: (plan: DietPlanResponse) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const DietForm: React.FC<DietFormProps> = ({ onPlanGenerated, loading, setLoading }) => {
  const [formData, setFormData] = useState<UserData>({
    age: 25,
    height: 170,
    currentWeight: 70,
    targetWeight: 65,
    fitnessGoal: 'lose_weight',
    dietaryPreference: 'vegetarian',
    sugarIntake: 'moderate',
    waterIntake: 8,
    upcomingEvent: '',
    sportsInterest: '',
    pastFitnessIssues: '',
  });

  const [errors, setErrors] = useState<Partial<UserData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<UserData> = {};

    if (formData.age < 16 || formData.age > 100) {
      newErrors.age = 16;
    }
    if (formData.height < 100 || formData.height > 250) {
      newErrors.height = 100;
    }
    if (formData.currentWeight < 30 || formData.currentWeight > 300) {
      newErrors.currentWeight = 30;
    }
    if (formData.targetWeight < 30 || formData.targetWeight > 300) {
      newErrors.targetWeight = 30;
    }
    if (formData.waterIntake < 1 || formData.waterIntake > 20) {
      newErrors.waterIntake = 1;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post('/api/generate-plan', formData);
      onPlanGenerated(response.data);
    } catch (error) {
      console.error('Error generating plan:', error);
      alert('Failed to generate diet plan. Please try again.');
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card p-8 animate-slide-up">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Tell us about yourself
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Provide your details to get a personalized diet plan
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calculator className="w-4 h-4 inline mr-2" />
                Age (years)
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                className={`input-field ${errors.age ? 'border-red-500' : ''}`}
                min="16"
                max="100"
                required
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Age must be between 16-100
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Height (cm)
              </label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                className={`input-field ${errors.height ? 'border-red-500' : ''}`}
                min="100"
                max="250"
                required
              />
              {errors.height && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Height must be between 100-250 cm
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Weight (kg)
              </label>
              <input
                type="number"
                value={formData.currentWeight}
                onChange={(e) => handleInputChange('currentWeight', parseInt(e.target.value))}
                className={`input-field ${errors.currentWeight ? 'border-red-500' : ''}`}
                min="30"
                max="300"
                required
              />
              {errors.currentWeight && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Weight must be between 30-300 kg
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Target className="w-4 h-4 inline mr-2" />
                Target Weight (kg)
              </label>
              <input
                type="number"
                value={formData.targetWeight}
                onChange={(e) => handleInputChange('targetWeight', parseInt(e.target.value))}
                className={`input-field ${errors.targetWeight ? 'border-red-500' : ''}`}
                min="30"
                max="300"
                required
              />
              {errors.targetWeight && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Weight must be between 30-300 kg
                </p>
              )}
            </div>
          </div>

          {/* BMI Calculator */}
          <BMICalculator 
            height={formData.height} 
            weight={formData.currentWeight}
            targetWeight={formData.targetWeight}
          />

          {/* Goals and Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fitness Goal
              </label>
              <select
                value={formData.fitnessGoal}
                onChange={(e) => handleInputChange('fitnessGoal', e.target.value)}
                className="input-field"
                required
              >
                <option value="lose_weight">Lose Weight</option>
                <option value="gain_weight">Gain Weight</option>
                <option value="build_muscle">Build Muscle</option>
                <option value="maintain">Maintain Current Weight</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dietary Preference
              </label>
              <select
                value={formData.dietaryPreference}
                onChange={(e) => handleInputChange('dietaryPreference', e.target.value)}
                className="input-field"
                required
              >
                <option value="vegetarian">Vegetarian</option>
                <option value="non_vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="keto">Keto</option>
                <option value="paleo">Paleo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sugar Intake Frequency
              </label>
              <select
                value={formData.sugarIntake}
                onChange={(e) => handleInputChange('sugarIntake', e.target.value)}
                className="input-field"
                required
              >
                <option value="low">Low (Rarely)</option>
                <option value="moderate">Moderate (Sometimes)</option>
                <option value="high">High (Frequently)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Droplets className="w-4 h-4 inline mr-2" />
                Daily Water Intake (glasses)
              </label>
              <input
                type="number"
                value={formData.waterIntake}
                onChange={(e) => handleInputChange('waterIntake', parseInt(e.target.value))}
                className={`input-field ${errors.waterIntake ? 'border-red-500' : ''}`}
                min="1"
                max="20"
                required
              />
              {errors.waterIntake && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Water intake must be between 1-20 glasses
                </p>
              )}
            </div>
          </div>

          {/* Optional Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Additional Information (Optional)
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Upcoming Event
              </label>
              <input
                type="text"
                value={formData.upcomingEvent}
                onChange={(e) => handleInputChange('upcomingEvent', e.target.value)}
                className="input-field"
                placeholder="e.g., Wedding, Marathon, Beach vacation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Activity className="w-4 h-4 inline mr-2" />
                Sports Interest
              </label>
              <input
                type="text"
                value={formData.sportsInterest}
                onChange={(e) => handleInputChange('sportsInterest', e.target.value)}
                className="input-field"
                placeholder="e.g., Running, Swimming, Yoga, Gym"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Past Fitness Issues
              </label>
              <textarea
                value={formData.pastFitnessIssues}
                onChange={(e) => handleInputChange('pastFitnessIssues', e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Any past injuries, medical conditions, or dietary restrictions"
              />
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating Your Plan...' : 'Generate My Diet Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DietForm;