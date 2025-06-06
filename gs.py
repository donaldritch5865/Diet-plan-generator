import google.generativeai as genai

genai.configure(api_key="AIzaSyC3iaqcANLPMBhMN-FTuLzkf6pq8G8ndto")  # Ensure you have set up your API key properly

models = genai.list_models()  # This should return a list of available models

for model in models:
    print(model.name)  # Print the names of available models
