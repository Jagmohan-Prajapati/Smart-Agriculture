from motor.motor_asyncio import AsyncIOMotorClient

# MongoDB connection
MONGO_URL = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URL)
db = client["smart-agriculture"]  # ✅ Corrected access using brackets
collection = db.disease_predictions

# Async save function
async def save_prediction_to_db(data: dict):
    await collection.insert_one(data)
