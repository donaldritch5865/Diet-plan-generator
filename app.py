import streamlit as st
import google.generativeai as genai
from datetime import datetime, timedelta
import os

# Load API Key securely
API_KEY = st.secrets.get("GOOGLE_API_KEY") or os.getenv("GOOGLE_API_KEY")

if not API_KEY:
    st.error("🚨 API key is missing! Please configure it in Streamlit secrets or environment variables.")
    st.stop()
else:
    genai.configure(api_key=API_KEY)

# Streamlit UI
st.title("🍽️ AI-Powered Diet Plan Generator (Gemini)")
st.subheader("The last plan you'll ever need to finally get in shape!")

# Collect User Inputs
with st.form("user_inputs"):
    age = st.number_input("Enter your age", min_value=10, max_value=100, step=1)
    height = st.number_input("Enter your height (cm)", min_value=100, max_value=250, step=1)
    current_weight = st.number_input("Current weight (kg)", min_value=30.0, max_value=200.0, step=0.5)
    target_weight = st.number_input("Target weight (kg)", min_value=30.0, max_value=200.0, step=0.5)
    goal = st.selectbox("Select your goal", ["Lose Weight", "Gain Weight", "Build Muscle"])
    diet_preference = st.selectbox("Dietary Preference", ["Vegetarian", "Non-Vegetarian", "Vegan", "Keto", "Paleo"])
    sugar_intake = st.selectbox("How often do you consume sugary foods?", ["Rarely", "Sometimes", "Often", "Daily"])
    water_intake = st.number_input("How much water do you drink daily? (liters)", min_value=0.5, max_value=5.0, step=0.1)
    event = st.text_input("Do you have an important event coming up? (Optional)")
    sports_interest = st.text_area("What sports are you interested in?")
    past_issues = st.text_area("Have you experienced any issues in past fitness attempts?")
    
    submitted = st.form_submit_button("Generate Diet Plan")

# Estimate Goal Achievement Date
if st.button("Calculate Goal Date"):
    weight_diff = abs(target_weight - current_weight)
    days_needed = int(weight_diff * 15)  # Rough estimate: 15 days per kg
    goal_date = datetime.today() + timedelta(days=days_needed)
    st.success(f"🎉 You'll reach {target_weight} kg by {goal_date.strftime('%b %d, %Y')}!")

# Generate Diet Plan
if submitted:
    prompt = f"""
    Act as a certified nutritionist. Create a detailed {diet_preference} diet plan for:
    - Age: {age} | Height: {height} cm
    - Current Weight: {current_weight} kg | Target Weight: {target_weight} kg
    - Goal: {goal}
    - Sugar Intake: {sugar_intake}
    - Water Intake: {water_intake}L per day
    - Special Event: {event if event else 'None'}
    - Interested Sports: {sports_interest if sports_interest else 'None'}
    - Past Fitness Issues: {past_issues if past_issues else 'None'}
    
    The plan should include:
    - A **weekly meal plan** with breakfast, lunch, dinner, and snacks.
    - Approximate **calorie intake** per day.
    - Recommended **exercise routines**.
    - Additional **hydration and recovery tips**.
    """

    try:
        # Initialize the correct model
        model = genai.GenerativeModel("gemini-1.5-pro-latest")  # Updated model name
        response = model.generate_content(prompt)

        if response and hasattr(response, "text"):
            st.success("✅ Here is your AI-generated diet plan:")
            st.markdown(response.text)
        else:
            st.error("❌ Failed to generate a diet plan.")

    except Exception as e:

        st.error(f"❌ Error generating diet plan: {str(e)}")
