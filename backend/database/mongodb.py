from pymongo import MongoClient
from datetime import datetime

client = MongoClient("mongodb://localhost:27017")
db = client["smart-agriculture"]
collection = db["predictions"]

def save_prediction_to_db(filename, prediction_label, confidence):
    prediction_data = {
        "filename": filename,
        "prediction": prediction_label,
        "confidence": confidence,
        "timestamp": datetime.utcnow()
    }
    collection.insert_one(prediction_data)
