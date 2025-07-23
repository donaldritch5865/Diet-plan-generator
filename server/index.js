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
    console.log('✅ Gemini AI initialized successfully');
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

  return `You are a certified nutritionist and fitness expert. Create a comprehensive, personalized diet plan in the EXACT format shown below for the following individual:

**PERSONAL PROFILE:**
- Age: ${userData.age} years
- Height: ${userData.height} cm
- Current Weight: ${userData.currentWeight} kg
- Target Weight: ${userData.targetWeight} kg
- BMI: ${bmiData.bmi.toFixed(1)} (${bmiData.category})
- Primary Goal: ${goalText[userData.fitnessGoal]}
- Dietary Preference: ${dietText[userData.dietaryPreference]}
- Sugar Intake: ${userData.sugarIntake}
- Daily Water Intake: ${userData.waterIntake} glasses
${userData.upcomingEvent ? `- Upcoming Event: ${userData.upcomingEvent}` : ''}
${userData.sportsInterest ? `- Sports/Activities: ${userData.sportsInterest}` : ''}
${userData.pastFitnessIssues ? `- Health Considerations: ${userData.pastFitnessIssues}` : ''}

IMPORTANT: Format your response EXACTLY like this structure:

**[Diet Type] [Goal] Plan for a [Age]-Year-Old [Activity/Description]**

**Client Profile:** [Age]-year-old [gender if mentioned], [height] cm, [current weight] kg, aiming for [target weight] kg, [dietary preference], [sugar intake frequency] consumes sugar, drinks [water intake]L water daily, [sports/activities if mentioned], [health considerations if any].

**Goal:** [Specific goal with target weight loss/gain] through a healthy, balanced [dietary preference] diet and exercise regime.

**Calorie Target:** Approximately [calculated calories] calories per day (This creates a [deficit/surplus] for [goal], but is enough to support [activities]. Individual needs vary, so monitor progress and adjust if needed).

**Weekly Meal Plan:**

**Day 1:**

• **Breakfast ([calories] calories):** [Detailed meal description]
• **Lunch ([calories] calories):** [Detailed meal description]
• **Snack ([calories] calories):** [Detailed snack description]
• **Dinner ([calories] calories):** [Detailed meal description]
• **Snack ([calories] calories):** [Detailed snack description]

**Day 2:**

• **Breakfast ([calories] calories):** [Detailed meal description]
• **Lunch ([calories] calories):** [Detailed meal description]
• **Snack ([calories] calories):** [Detailed snack description]
• **Dinner ([calories] calories):** [Detailed meal description]
• **Snack ([calories] calories):** [Detailed snack description]

**Day 3:**

• **Breakfast ([calories] calories):** [Detailed meal description]
• **Lunch ([calories] calories):** [Detailed meal description]
• **Snack ([calories] calories):** [Detailed snack description]
• **Dinner ([calories] calories):** [Detailed meal description]
• **Snack ([calories] calories):** [Detailed snack description]

**Day 4:**

• **Breakfast ([calories] calories):** [Detailed meal description]
• **Lunch ([calories] calories):** [Detailed meal description]
• **Snack ([calories] calories):** [Detailed snack description]
• **Dinner ([calories] calories):** [Detailed meal description]
• **Snack ([calories] calories):** [Detailed snack description]

**Day 5:**

• **Breakfast ([calories] calories):** [Detailed meal description]
• **Lunch ([calories] calories):** [Detailed meal description]
• **Snack ([calories] calories):** [Detailed snack description]
• **Dinner ([calories] calories):** [Detailed meal description]
• **Snack ([calories] calories):** [Detailed snack description]

**Day 6:**

• **Breakfast ([calories] calories):** [Detailed meal description]
• **Lunch ([calories] calories):** [Detailed meal description]
• **Snack ([calories] calories):** [Detailed snack description]
• **Dinner ([calories] calories):** [Detailed meal description]
• **Snack ([calories] calories):** [Detailed snack description]

**Day 7:**

• **Breakfast ([calories] calories):** [Detailed meal description]
• **Lunch ([calories] calories):** [Detailed meal description]
• **Snack ([calories] calories):** [Detailed snack description]
• **Dinner ([calories] calories):** [Detailed meal description]
• **Snack ([calories] calories):** [Detailed snack description]

**Hydration Guidelines:**
- [Specific water intake recommendations]
- [Timing suggestions]
- [Additional hydration tips]

**Exercise Recommendations:**
- [Specific workout suggestions based on sports interest]
- [Frequency and duration]
- [Recovery recommendations]

**Additional Tips:**
- [Meal prep suggestions]
- [Healthy alternatives]
- [Progress monitoring advice]
- [Lifestyle recommendations]

**Important Notes:**
- [Foods to emphasize]
- [Foods to limit]
- [Supplement recommendations if any]
- [When to consult healthcare providers]

Make sure to:
1. Calculate appropriate calorie targets based on their goal
2. Include specific calorie counts for each meal
3. Provide detailed, practical meal descriptions
4. Consider their dietary preferences strictly
5. Make it relevant to their sports/activities
7. Keep the format EXACTLY as shown above with proper spacing and bullet points`;
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