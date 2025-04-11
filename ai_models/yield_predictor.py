# Crop Yield Prediction Model
# This file contains the machine learning model for predicting crop yields
# based on various environmental and agricultural factors.

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import pickle
import os

# Define the path to save the trained model
MODEL_PATH = 'model/yield_model.pkl'

def load_data():
    """
    Load and preprocess the crop data from CSV
    Replace this with your actual data loading logic
    """
    # TODO: Replace with actual data loading from your CSV file
    # Example:
    # data = pd.read_csv('crop_data.csv')
    
    # For demonstration, we'll create some dummy data
    np.random.seed(42)
    n_samples = 1000
    
    data = pd.DataFrame({
        'crop': np.random.choice(['wheat', 'rice', 'corn', 'soybeans', 'cotton'], n_samples),
        'soil_quality': np.random.uniform(1, 10, n_samples),
        'rainfall': np.random.uniform(500, 2000, n_samples),
        'temperature': np.random.uniform(15, 40, n_samples),
        'area': np.random.uniform(1, 10, n_samples),
        'fertilizer': np.random.uniform(50, 200, n_samples),
        'yield': np.random.uniform(1000, 8000, n_samples)
    })
    
    return data

def preprocess_data(data):
    """
    Preprocess the data for model training
    """
    # One-hot encode categorical variables
    data_encoded = pd.get_dummies(data, columns=['crop'])
    
    # Split features and target
    X = data_encoded.drop('yield', axis=1)
    y = data_encoded['yield']
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    return X_scaled, y, scaler, X.columns

def train_model():
    """
    Train the yield prediction model
    """
    # Load and preprocess data
    data = load_data()
    X, y, scaler, feature_names = preprocess_data(data)
    
    # Split into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train a Random Forest model
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate the model
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"Model training score: {train_score:.4f}")
    print(f"Model testing score: {test_score:.4f}")
    
    # Save the model and scaler
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, 'wb') as f:
        pickle.dump({'model': model, 'scaler': scaler, 'feature_names': feature_names}, f)
    
    return model, scaler, feature_names

def predict_yield(crop, soil_quality, rainfall, temperature, area, fertilizer):
    """
    Make a yield prediction for a given set of input parameters
    """
    # Load the model if it exists, otherwise train a new one
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            model_data = pickle.load(f)
            model = model_data['model']
            scaler = model_data['scaler']
            feature_names = model_data['feature_names']
    else:
        model, scaler, feature_names = train_model()
    
    # Prepare input data
    input_data = pd.DataFrame({
        'soil_quality': [soil_quality],
        'rainfall': [rainfall],
        'temperature': [temperature],
        'area': [area],
        'fertilizer': [fertilizer]
    })
    
    # Add one-hot encoded crop columns
    for crop_name in ['wheat', 'rice', 'corn', 'soybeans', 'cotton']:
        input_data[f'crop_{crop_name}'] = 1 if crop == crop_name else 0
    
    # Ensure input data has all the required columns in the right order
    input_data = input_data.reindex(columns=feature_names, fill_value=0)
    
    # Scale the input data
    input_scaled = scaler.transform(input_data)
    
    # Make prediction
    predicted_yield = model.predict(input_scaled)[0]
    
    return predicted_yield

if __name__ == "__main__":
    # Train the model if running this file directly
    train_model()

