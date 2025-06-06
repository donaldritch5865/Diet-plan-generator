# Diet Plan Generator

A personalized diet plan generator built with **Streamlit** that leverages the **Google Gemini API** to create tailored diet recommendations based on user inputs such as age, height, weight, dietary preferences, fitness goals, and lifestyle habits.

---

## Features

- Customized diet plans for weight loss, weight gain, and muscle gain.
- Supports multiple dietary preferences (vegetarian, vegan, keto, etc.).
- Considers sugar consumption, daily water intake, and lifestyle habits.
- Provides an estimated goal achievement date based on user inputs.
- User-friendly, interactive interface built with Streamlit.
- Integrates Google Gemini API for AI-driven diet suggestions and enhanced personalization.

---

## Demo

*(Include a link to live demo or screenshots here if available)*

---

## Installation

### Prerequisites

- Python 3.8 or higher
- [pip](https://pip.pypa.io/en/stable/installation/)
- Google Cloud account with Google Gemini API enabled

### Steps

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/diet-plan-generator.git
   cd diet-plan-generator
Setup
Google Gemini API Key
Go to the Google Cloud Console.

Create or select an existing project.

Enable the Google Gemini API.

Navigate to APIs & Services > Credentials.

Create an API Key and restrict it appropriately.

Copy your API key.

Environment Variables
Create a .env file in the root directory and add:

env
Copy
Edit
GOOGLE_GEMINI_API_KEY=your_api_key_here
The app will load this key using python-dotenv for secure access.

Usage
Run the Streamlit app:

bash
Copy
Edit
streamlit run app.py
Open http://localhost:8501 in your browser.

Enter your information:

Personal details: age, height, weight (current and target)

Dietary preferences: vegetarian, vegan, keto, etc.

Goals: weight loss, weight gain, muscle gain

Lifestyle: sugar intake, water consumption, upcoming events or challenges

The app will generate a detailed diet plan and estimated timeline for your goals.

How It Works
The user inputs their details in the Streamlit UI.

The app sends a request to the Google Gemini API with the user data.

The Google Gemini API processes the request and generates personalized diet suggestions.

The app displays the plan and goal achievement estimate.

Project Structure
bash
Copy
Edit
diet-plan-generator/
├── app.py               # Main Streamlit app
├── utils.py             # Helper functions & API integration code
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables (API key)
├── LICENSE              # License file
└── README.md            # Project documentation
Dependencies
Python 3.8+

Streamlit

python-dotenv — for environment variables

requests or official Google Gemini SDK if available

Other dependencies listed in requirements.txt

Troubleshooting
API Key Errors:
Ensure your .env file contains the correct GOOGLE_GEMINI_API_KEY. Check for typos and restrictions on the API key in Google Cloud Console.

Streamlit Not Launching:
Make sure Streamlit is installed (pip install streamlit) and that you're running the command from your project directory.

Dependency Issues:
Verify your Python version and install dependencies using the provided requirements.txt.

Network Issues:
Check your internet connection and firewall settings that may block API requests.

Roadmap
 Add user authentication and profile saving.

 Include meal plans and recipes.

 Mobile-friendly responsive design.

 Add progress tracking and notifications.

 Support more detailed dietary restrictions and allergies.

 Integrate with fitness trackers and wearables.

Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the issues page.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
Developed by Donald Ritch Babu
Email: donaldmanapuzha@gmail.com
GitHub: donaldritch5865

