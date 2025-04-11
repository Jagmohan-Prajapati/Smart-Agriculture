# Model Server
# This file runs a Flask API server that serves the trained ML models
# for crop yield prediction and disease detection.

from flask import Flask, request, jsonify
import os
import sys
import json
import random

# Add the current directory to the path so we can import our modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import our prediction modules
try:
    from yield_predictor import predict_yield
    from disease_detection import predict_disease
except ImportError:
    print("Warning: Could not import prediction modules. Using mock data instead.")
    predict_yield = None
    predict_disease = None

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint for crop yield and price prediction
    """
    try:
        # Get input data from request
        data = request.json
        
        # Extract parameters
        crop = data.get('crop')
        soil_quality = float(data.get('soil_quality', 5))
        rainfall = float(data.get('rainfall', 1000))
        temperature = float(data.get('temperature', 25))
        area = float(data.get('area', 1))
        fertilizer = float(data.get('fertilizer', 100))
        
        # If we have the prediction function, use it
        if predict_yield:
            predicted_yield = predict_yield(crop, soil_quality, rainfall, temperature, area, fertilizer)
        else:
            # Otherwise, generate mock data
            base_yields = {
                'wheat': 4500,
                'rice': 6000,
                'corn': 3200,
                'soybeans': 2800,
                'cotton': 1500,
                'sugarcane': 8000
            }
            base_yield = base_yields.get(crop, 4000)
            # Add some randomness
            predicted_yield = base_yield * (0.9 + 0.2 * random.random())
        
        # Calculate a mock price based on the yield
        price_per_kg = {
            'wheat': 22,
            'rice': 28,
            'corn': 18,
            'soybeans': 35,
            'cotton': 52,
            'sugarcane': 15
        }
        base_price = price_per_kg.get(crop, 25)
        # Inverse relationship with yield (higher yield, slightly lower price)
        predicted_price = base_price * (1.0 - 0.1 * (predicted_yield / base_yields.get(crop, 4000) - 1))
        
        # Determine health status
        health_probability = random.random()
        if health_probability > 0.7:
            health_status = "healthy"
        elif health_probability > 0.3:
            health_status = "warning"
        else:
            health_status = "danger"
        
        # Return prediction results
        return jsonify({
            'crop': crop,
            'yield': round(predicted_yield),
            'price': round(predicted_price * 100) / 100,
            'status': health_status
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/health-check', methods=['POST'])
def health_check():
    """
    Endpoint for crop health check
    """
    try:
        # Get input data from request
        data = request.json
        
        # Mock health check response
        health_probability = random.random()
        if health_probability > 0.7:
            health_status = "healthy"
            confidence = 0.8 + 0.2 * random.random()
        elif health_probability > 0.3:
            health_status = "warning"
            confidence = 0.6 + 0.2 * random.random()
        else:
            health_status = "danger"
            confidence = 0.5 + 0.3 * random.random()
        
        # Return health status
        return jsonify({
            'status': health_status,
            'confidence': round(confidence * 100) / 100,
            'recommendations': get_recommendations(health_status)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/historical-data', methods=['GET'])
def historical_data():
    """
    Endpoint for historical yield data
    """
    try:
        # Get crop from query parameters
        crop = request.args.get('crop', 'wheat')
        
        # Generate mock historical data
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        
        base_yields = {
            'wheat': [3800, 3900, 4100, 4300, 4400, 4500],
            'rice': [5200, 5300, 5500, 5700, 5900, 6000],
            'corn': [2800, 2900, 3000, 3100, 3150, 3200],
            'soybeans': [2400, 2500, 2600, 2700, 2750, 2800]
        }
        
        # Use the base yields for the requested crop, or generate random data
        if crop in base_yields:
            crop_data = base_yields[crop]
        else:
            # Generate random increasing data
            start_value = 2000 + random.randint(0, 2000)
            crop_data = [start_value]
            for i in range(5):
                crop_data.append(crop_data[-1] + random.randint(50, 200))
        
        # Create the response data
        data = [{'month': month, 'yield': yield_value} for month, yield_value in zip(months, crop_data)]
        
        return jsonify(data)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_recommendations(health_status):
    """
    Get recommendations based on health status
    """
    if health_status == "healthy":
        return [
            "Continue with current farming practices",
            "Regular monitoring for any changes",
            "Maintain irrigation schedule"
        ]
    elif health_status == "warning":
        return [
            "Increase monitoring frequency",
            "Check for pest infestations",
            "Consider adjusting irrigation",
            "Apply organic pesticides if needed"
        ]
    else:  # danger
        return [
            "Immediate intervention required",
            "Apply appropriate treatments",
            "Consult with agricultural expert",
            "Consider crop rotation for next season"
        ]

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

