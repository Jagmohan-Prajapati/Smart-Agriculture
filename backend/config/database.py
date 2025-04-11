from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = "mongodb://localhost:27017"
client = AsyncIOMotorClient(MONGO_URI)
db = client["smart_agriculture"]

# Expose contract collection
contract_collection = db["contracts"]
