export interface UserData {
  age: number;
  height: number;
  currentWeight: number;
  targetWeight: number;
  fitnessGoal: 'lose_weight' | 'gain_weight' | 'build_muscle' | 'maintain';
  dietaryPreference: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'keto' | 'paleo';
  sugarIntake: 'low' | 'moderate' | 'high';
  waterIntake: number;
  upcomingEvent?: string;
  sportsInterest?: string;
  pastFitnessIssues?: string;
}

export interface BMIData {
  bmi: number;
  category: string;
  estimatedGoalDate: string;
}

export interface DietPlanResponse {
  userData: UserData;
  bmiData: BMIData;
  aiResponse: string;
  timestamp: string;
}