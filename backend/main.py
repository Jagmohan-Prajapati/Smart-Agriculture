#PREDICTIONS
#PREDICTIONS
#PREDICTIONS



from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from db.mongo import save_prediction_to_db
from model.disease_model import predict_disease

import shutil
import uuid
import os
from datetime import datetime

# Create FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (adjust in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set upload directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Serve the uploads folder statically
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


# Route for disease prediction
@app.post("/predict-disease/")
async def predict_disease_api(file: UploadFile = File(...)):
    try:
        # Save uploaded file with unique name
        file_ext = os.path.splitext(file.filename)[1]
        file_name = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, file_name)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Run prediction
        result = predict_disease(file_path)

        # Relative path for serving from frontend
        # Normalize slashes (for Windows)
        relative_path = f"uploads/{file_name}".replace("\\", "/")

        # Save prediction to MongoDB
        await save_prediction_to_db({
            "image_path": relative_path,
            "prediction": result,
            "timestamp": datetime.utcnow()
        })

        return {
            "success": True,
            "prediction": result,
            "image_path": relative_path
        }


    except Exception as e:
        return {"success": False, "error": str(e)}



#CONTRACTS
#CONTRACTS
#CONTRACTS



from contracts.routes import router as contracts_router
app.include_router(contracts_router, prefix="/contracts", tags=["Contracts"])


#PROFILE
#PROFILE
#PROFILE


from routes import profile
app.include_router(profile.router)

from fastapi.staticfiles import StaticFiles
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

