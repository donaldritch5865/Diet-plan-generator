import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased limit for development
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(express.json({ limit: '10mb' }));

// MongoDB connection (optional)
const connectDB = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB connected successfully');
    } else {
      console.log('ℹ️  MongoDB URI not provided, running without database');
    }
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('ℹ️  Continuing without database...');
  }
};

// User data schema
const userDataSchema = new mongoose.Schema({
  age: { type: Number, required: true },
  height: { type: Number, required: true },
  currentWeight: { type: Number, required: true },
  targetWeight: { type: Number, required: true },
  fitnessGoal: { type: String, required: true },
  dietaryPreference: { type: String, required: true },
  sugarIntake: { type: String, required: true },
  waterIntake: { type: Number, required: true },
  upcomingEvent: String,
  sportsInterest: String,
  pastFitnessIssues: String,
  bmi: Number,
  bmiCategory: String,
  estimatedGoalDate: String,
  aiResponse: String,
  timestamp: { type: Date, default: Date.now }
});

const UserData = mongoose.models.UserData || mongoose.model('UserData', userDataSchema);

// Initialize Gemini AI
let genAI;
if (process.env.GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini AI initialized successfully with key:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
  } catch (error) {
    console.error('❌ Gemini AI initialization error:', error.message);
  }
} else {
  console.warn('⚠️  GEMINI_API_KEY not provided. AI features will not work.');
}

// Helper functions
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

const getEstimatedGoalDate = (currentWeight, targetWeight) => {
  const weightDifference = Math.abs(currentWeight - targetWeight);
  const daysNeeded = Math.ceil(weightDifference * 15); // 15 days per kg
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysNeeded);
  return targetDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const buildGeminiPrompt = (userData, bmiData) => {
  const goalText = {
    'lose_weight': 'lose weight',
    'gain_weight': 'gain weight',
    'build_muscle': 'build muscle mass',
    'maintain': 'maintain current weight'
  };

  const dietText = {
    'vegetarian': 'vegetarian',
    'non_vegetarian': 'non-vegetarian',
    'vegan': 'vegan',
    'keto': 'ketogenic',
    'paleo': 'paleo'
  };

  return `You are a certified nutritionist and fitness expert. Create a comprehensive, personalized diet plan for the following individual:

**PERSONAL PROFILE:**
- Age: ${userData.age} years
- Height: ${userData.height} cm
- Current Weight: ${userData.currentWeight} kg
- Target Weight: ${userData.targetWeight} kg

Client Profile: ${userData.age}-year-old, ${userData.height} cm, ${userData.currentWeight} kg, aiming for ${userData.targetWeight} kg, ${dietText[userData.dietaryPreference]}, ${userData.sugarIntake} consumes sugar, drinks ${(userData.waterIntake * 0.25).toFixed(1)}L water daily${userData.sportsInterest ? `, plays ${userData.sportsInterest.toLowerCase()}` : ''}${userData.pastFitnessIssues ? `, ${userData.pastFitnessIssues.toLowerCase()}` : ', no past fitness issues'}.

Goal: ${goalText[userData.fitnessGoal].charAt(0).toUpperCase() + goalText[userData.fitnessGoal].slice(1).replace('_', ' ')} ${Math.abs(userData.currentWeight - userData.targetWeight)} kg through a healthy, balanced ${dietText[userData.dietaryPreference]} diet and exercise regime.

Calorie Target: Approximately ${userData.fitnessGoal === 'lose_weight' ? '1800-2000' : userData.fitnessGoal === 'gain_weight' ? '2200-2500' : '2000-2200'} calories per day (This creates a ${userData.fitnessGoal === 'lose_weight' ? 'deficit for weight loss' : userData.fitnessGoal === 'gain_weight' ? 'surplus for weight gain' : 'balance for maintenance'}, but is enough to support ${userData.sportsInterest ? userData.sportsInterest.toLowerCase() + ' training' : 'daily activities'}. Individual needs vary, so monitor progress and adjust if needed).

Weekly Meal Plan (Example - Adjust portion sizes as needed):

Day 1:

• Breakfast (350 calories): [Detailed ${dietText[userData.dietaryPreference]} breakfast with specific foods]
• Lunch (400 calories): [Detailed ${dietText[userData.dietaryPreference]} lunch with specific foods]
• Snack (150 calories): [Healthy snack option]
• Dinner (450 calories): [Detailed ${dietText[userData.dietaryPreference]} dinner with specific foods]
• Snack (100 calories): [Light evening snack]

Day 2:

• Breakfast (300 calories): [Different ${dietText[userData.dietaryPreference]} breakfast option]
• Lunch (450 calories): [Different ${dietText[userData.dietaryPreference]} lunch option]
• Snack (150 calories): [Different healthy snack]
• Dinner (500 calories): [Different ${dietText[userData.dietaryPreference]} dinner option]
• Snack (100 calories): [Different light snack]

Day 3:

• Breakfast (350 calories): [Third ${dietText[userData.dietaryPreference]} breakfast variation]
• Lunch (400 calories): [Third ${dietText[userData.dietaryPreference]} lunch variation]
• Snack (150 calories): [Third snack option]
• Dinner (450 calories): [Third ${dietText[userData.dietaryPreference]} dinner variation]
• Snack (100 calories): [Third light snack option]

Day 4:

• Breakfast (300 calories): [Fourth ${dietText[userData.dietaryPreference]} breakfast option]
• Lunch (500 calories): [Fourth ${dietText[userData.dietaryPreference]} lunch option]
• Snack (100 calories): [Fourth snack option]
• Dinner (450 calories): [Fourth ${dietText[userData.dietaryPreference]} dinner option]
• Snack (150 calories): [Fourth evening snack]

Day 5 - 7: Repeat meals from the previous days, adjusting based on your preferences and availability. Focus on variety and ensure you're getting enough protein.

Recommended Exercise Routine:

• ${userData.sportsInterest ? `${userData.sportsInterest} Training: Continue your regular ${userData.sportsInterest.toLowerCase()} training schedule.` : 'Regular Exercise: Include 30-45 minutes of moderate exercise daily.'}
• Strength Training (2-3 times/week): Focus on compound exercises like squats, lunges, deadlifts, push-ups, and rows. Include core work. This builds muscle, boosts metabolism, and supports performance${userData.sportsInterest ? ` on the field` : ''}.
• Cardio (2-3 times/week): 30-45 minutes of moderate-intensity cardio like running, cycling, or swimming. This burns calories and improves cardiovascular health.

Hydration and Recovery Tips:

• Water: Aim for at least ${(userData.waterIntake * 0.25).toFixed(1)}L of water per day, especially on training days. Carry a water bottle with you and sip throughout the day.
• Electrolytes: Replenish electrolytes lost during training with electrolyte drinks or by consuming foods rich in potassium and sodium (bananas, coconut water).
• Sleep: Aim for 7-9 hours of quality sleep per night. This is crucial for muscle recovery and overall health.
• Protein: Ensure adequate protein intake (around 1.4-1.8g/kg of body weight) for muscle repair and growth. Good sources include lentils, beans, tofu, tempeh, quinoa, nuts, seeds, and Greek yogurt.
• Post-Workout Nutrition: Consume a post-workout snack or meal containing carbohydrates and protein within 30-60 minutes of training to replenish glycogen stores and promote muscle recovery. Examples: Smoothie with protein powder and fruit, Greek yogurt with berries and granola, or a whole-wheat sandwich with hummus and vegetables.

Important Considerations:

• Consult a Doctor: This plan is a general guideline. It's important to consult with your doctor or a registered dietitian before making any significant dietary changes, especially if you have any underlying health conditions.
• Listen to Your Body: Pay attention to your body's hunger and fullness cues. Adjust portion sizes as needed and don't restrict calories too severely.
• Gradual Changes: Make gradual changes to your diet rather than drastic ones. This will help you stick to the plan long-term.
• Stay Consistent: Consistency is key to achieving your goals. Stick to the plan as much as possible, but don't be too hard on yourself if you have occasional slip-ups.
• Monitor Progress: Track your weight, measurements, and how you feel. Adjust the plan as needed based on your progress and feedback from your body.

Provide specific, detailed meal descriptions that strictly follow the ${dietText[userData.dietaryPreference]} dietary preference. Include exact foods, preparation methods, and make it practical for daily implementation.`;
};

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
      ai: genAI ? 'Available' : 'Not configured'
    }
  });
});

app.post('/api/generate-plan', async (req, res) => {
  try {
    console.log('📝 Received plan generation request');
    const userData = req.body;
    
    // Validate required fields
    const requiredFields = ['age', 'height', 'currentWeight', 'targetWeight', 'fitnessGoal', 'dietaryPreference', 'sugarIntake', 'waterIntake'];
    for (const field of requiredFields) {
      if (userData[field] === undefined || userData[field] === null) {
        console.error(`❌ Missing required field: ${field}`);
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Calculate BMI and related data
    const bmi = calculateBMI(userData.currentWeight, userData.height);
    const bmiCategory = getBMICategory(bmi);
    const estimatedGoalDate = getEstimatedGoalDate(userData.currentWeight, userData.targetWeight);
    
    const bmiData = {
      bmi,
      category: bmiCategory,
      estimatedGoalDate
    };

    console.log('🧮 BMI calculated:', bmi.toFixed(1), bmiCategory);

    let aiResponse = '';
    
    if (genAI) {
      try {
        console.log('🤖 Generating AI response...');
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
        const prompt = buildGeminiPrompt(userData, bmiData);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        aiResponse = response.text();
        console.log('✅ AI response generated successfully');
      } catch (aiError) {
        console.error('❌ AI generation error:', aiError.message);
        // Provide fallback response
        aiResponse = `**Personalized Diet Plan**

**Weekly Meal Plan Overview**
Based on your profile (Age: ${userData.age}, Goal: ${userData.fitnessGoal}, Diet: ${userData.dietaryPreference}), here's your customized plan:

**Day 1-7 Structure:**
- **Breakfast (7-8 AM):** High-protein options like oats with nuts, eggs, or smoothies
- **Mid-Morning Snack (10 AM):** Fresh fruits or nuts
- **Lunch (12-1 PM):** Balanced meals with lean proteins, complex carbs, and vegetables
- **Evening Snack (4 PM):** Healthy options like yogurt or herbal tea
- **Dinner (7-8 PM):** Light, nutritious meals with emphasis on vegetables

**Daily Nutritional Guidelines**
- Target Calories: ${userData.fitnessGoal === 'lose_weight' ? '1500-1800' : userData.fitnessGoal === 'gain_weight' ? '2200-2500' : '1800-2000'} calories
- Protein: 25-30% of total calories
- Carbohydrates: 45-50% of total calories
- Fats: 20-25% of total calories

**Hydration Strategy**
- Drink ${userData.waterIntake} glasses of water daily
- Start your day with warm water
- Have water 30 minutes before meals
- Avoid sugary drinks

**Exercise Recommendations**
- ${userData.sportsInterest ? `Continue with ${userData.sportsInterest}` : 'Include 30 minutes of moderate exercise daily'}
- Mix cardio and strength training
- Take rest days for recovery

**Lifestyle Tips**
- Meal prep on weekends
- Eat slowly and mindfully
- Get 7-8 hours of sleep
- Manage stress through meditation or yoga

**Progress Tracking**
- Weigh yourself weekly at the same time
- Take body measurements monthly
- Monitor energy levels and mood
- Track your food intake

**Important Considerations**
- Focus on whole, unprocessed foods
- ${userData.sugarIntake === 'high' ? 'Gradually reduce sugar intake' : 'Maintain current sugar levels'}
- ${userData.pastFitnessIssues ? `Consider your past issues: ${userData.pastFitnessIssues}` : 'Listen to your body'}
- Consult a healthcare provider before making major dietary changes

This plan is designed to help you reach your target weight of ${userData.targetWeight}kg by ${estimatedGoalDate}. Stay consistent and be patient with the process!`;
      }
    } else {
      console.warn('⚠️  AI service not available, using fallback response');
      aiResponse = 'AI service is temporarily unavailable. Please check your API key configuration.';
    }

    // Save to database if available
    if (mongoose.connection.readyState === 1) {
      try {
        const newUserData = new UserData({
          ...userData,
          bmi,
          bmiCategory,
          estimatedGoalDate,
          aiResponse
        });
        await newUserData.save();
        console.log('💾 User data saved to database');
      } catch (dbError) {
        console.error('❌ Database save error:', dbError.message);
      }
    }

    const response = {
      userData,
      bmiData,
      aiResponse,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Plan generated successfully');
    res.json(response);
  } catch (error) {
    console.error('❌ Error generating plan:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate diet plan',
      details: error.message 
    });
  }
});

app.post('/api/save-user-data', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not available' });
    }

    const userData = new UserData(req.body);
    await userData.save();
    res.json({ message: 'User data saved successfully', id: userData._id });
  } catch (error) {
    console.error('Error saving user data:', error);
    res.status(500).json({ error: 'Failed to save user data' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🤖 AI Status: ${genAI ? '✅ Ready' : '❌ Not configured'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();