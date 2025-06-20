# AI-Powered Diet Plan Generator

A comprehensive full-stack web application that generates personalized diet plans using Google's Gemini AI. Built with React, Node.js, Express, and MongoDB.

## 🌟 Features

### Frontend (React + TypeScript + Tailwind CSS)
- **Modern, Responsive UI**: Clean design with dark/light mode toggle
- **Comprehensive Form**: Collects detailed user health and preference data
- **BMI Calculator**: Real-time BMI calculation with health categories
- **Interactive Results**: Expandable sections for easy reading
- **PDF Export**: Download diet plans as PDF documents
- **Loading States**: Beautiful animations during plan generation

### Backend (Node.js + Express)
- **RESTful API**: Clean endpoints for plan generation and data storage
- **AI Integration**: Google Gemini AI for intelligent diet plan creation
- **Database Support**: MongoDB integration for user data persistence
- **Security**: Rate limiting, CORS, and security headers
- **Error Handling**: Comprehensive error management

### AI-Powered Features
- **Personalized Plans**: Tailored recommendations based on user profile
- **Comprehensive Analysis**: BMI calculation and goal timeline estimation
- **Professional Guidance**: AI acts as certified nutritionist
- **Structured Output**: Well-formatted meal plans and guidelines

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (optional, for data persistence)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd diet-plan-generator
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cp server/.env.example server/.env
   ```
   
   Edit `server/.env` and add your configuration:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   MONGODB_URI=mongodb://localhost:27017/diet-plan-generator
   ```

4. **Get your Gemini API key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

5. **Start the development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📁 Project Structure

```
diet-plan-generator/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── types/         # TypeScript type definitions
│   │   └── ...
│   ├── package.json
│   └── ...
├── server/                # Express backend
│   ├── index.js          # Main server file
│   ├── package.json
│   └── .env.example
├── package.json          # Root package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

#### Server (.env)
- `GEMINI_API_KEY`: Your Google Gemini AI API key (required)
- `MONGODB_URI`: MongoDB connection string (optional)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

### API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/generate-plan` - Generate personalized diet plan
- `POST /api/save-user-data` - Save user data to database

## 🎯 User Input Fields

The application collects comprehensive user data:

### Required Fields
- Age (16-100 years)
- Height (100-250 cm)
- Current Weight (30-300 kg)
- Target Weight (30-300 kg)
- Fitness Goal (lose/gain/build muscle/maintain)
- Dietary Preference (vegetarian/non-vegetarian/vegan/keto/paleo)
- Sugar Intake Frequency (low/moderate/high)
- Daily Water Intake (1-20 glasses)

### Optional Fields
- Upcoming Event
- Sports Interest
- Past Fitness Issues

## 🤖 AI Integration

The application uses Google's Gemini AI to generate comprehensive diet plans including:

- **Weekly Meal Plans**: 7-day structured meal schedules
- **Nutritional Guidelines**: Calorie targets and macronutrient breakdowns
- **Hydration Strategy**: Water intake recommendations
- **Exercise Recommendations**: Complementary workout suggestions
- **Lifestyle Tips**: Practical advice for sustainable habits
- **Progress Tracking**: Metrics and monitoring guidelines

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Dark/Light Mode**: Toggle between themes
- **Smooth Animations**: Fade-in and slide-up effects
- **Loading States**: Engaging loading animations
- **Interactive Elements**: Hover effects and micro-interactions
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 📱 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/dist`

### Backend (Railway/Render)
1. Connect your GitHub repository
2. Set start command: `cd server && npm start`
3. Add environment variables in the platform dashboard

## 🔒 Security Features

- Rate limiting (10 requests per 15 minutes)
- CORS configuration
- Security headers with Helmet
- Input validation
- Error handling without sensitive data exposure

## 🧪 Testing

The application includes comprehensive error handling and validation:
- Form validation with real-time feedback
- API error handling
- Graceful degradation when services are unavailable

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the health endpoint: `/api/health`

## 🔮 Future Enhancements

- User authentication and profiles
- Progress tracking over time
- Meal planning calendar
- Shopping list generation
- Integration with fitness trackers
- Multi-language support
- Recipe suggestions
- Nutritionist consultation booking

---

Built with ❤️ for better health and nutrition