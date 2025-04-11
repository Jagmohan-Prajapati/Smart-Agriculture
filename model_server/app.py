from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import random
import os
import sys
import uvicorn

# Import prediction functions
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
try:
    from yield_predictor import predict_yield
    from disease_detection import predict_disease
except ImportError:
    predict_yield = None
    predict_disease = None

app = FastAPI(title="Smart Agriculture Model API")

# Enable CORS (optional, helps during frontend dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# ------------------- Request/Response Models -------------------

class PredictRequest(BaseModel):
    crop: str
    soil_quality: Optional[float] = 5.0
    rainfall: Optional[float] = 1000.0
    temperature: Optional[float] = 25.0
    area: Optional[float] = 1.0
    fertilizer: Optional[float] = 100.0

class PredictResponse(BaseModel):
    crop: str
    yield_: int
    price: float
    status: str

class HealthCheckResponse(BaseModel):
    status: str
    confidence: float
    recommendations: List[str]

class HistoricalDataPoint(BaseModel):
    month: str
    yield_: int

# ------------------- Helper Functions -------------------

def get_mock_yield(crop: str) -> float:
    base_yields = {
        'wheat': 4500, 'rice': 6000, 'corn': 3200,
        'soybeans': 2800, 'cotton': 1500, 'sugarcane': 8000
    }
    base = base_yields.get(crop, 4000)
    return base * (0.9 + 0.2 * random.random())

def get_mock_price(crop: str, predicted_yield: float) -> float:
    price_map = {
        'wheat': 22, 'rice': 28, 'corn': 18,
        'soybeans': 35, 'cotton': 52, 'sugarcane': 15
    }
    base_price = price_map.get(crop, 25)
    return base_price * (1.0 - 0.1 * (predicted_yield / (base_price * 200) - 1))

def get_recommendations(status: str) -> List[str]:
    if status == "healthy":
        return [
            "Continue with current farming practices",
            "Regular monitoring for any changes",
            "Maintain irrigation schedule"
        ]
    elif status == "warning":
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

# ------------------- API Endpoints -------------------

@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    try:
        if predict_yield:
            predicted_yield = predict_yield(
                crop=request.crop,
                soil_quality=request.soil_quality,
                rainfall=request.rainfall,
                temperature=request.temperature,
                area=request.area,
                fertilizer=request.fertilizer
            )
        else:
            predicted_yield = get_mock_yield(request.crop)

        predicted_price = get_mock_price(request.crop, predicted_yield)

        health_probability = random.random()
        if health_probability > 0.7:
            health_status = "healthy"
        elif health_probability > 0.3:
            health_status = "warning"
        else:
            health_status = "danger"

        return PredictResponse(
            crop=request.crop,
            yield_=round(predicted_yield),
            price=round(predicted_price, 2),
            status=health_status
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/health-check", response_model=HealthCheckResponse)
def health_check():
    try:
        health_probability = random.random()
        if health_probability > 0.7:
            status = "healthy"
            confidence = round(0.8 + 0.2 * random.random(), 2)
        elif health_probability > 0.3:
            status = "warning"
            confidence = round(0.6 + 0.2 * random.random(), 2)
        else:
            status = "danger"
            confidence = round(0.5 + 0.3 * random.random(), 2)

        return HealthCheckResponse(
            status=status,
            confidence=confidence,
            recommendations=get_recommendations(status)
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/historical-data", response_model=List[HistoricalDataPoint])
def historical_data(crop: str = "wheat"):
    try:
        months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
        base_yields = {
            'wheat': [3800, 3900, 4100, 4300, 4400, 4500],
            'rice': [5200, 5300, 5500, 5700, 5900, 6000],
            'corn': [2800, 2900, 3000, 3100, 3150, 3200],
            'soybeans': [2400, 2500, 2600, 2700, 2750, 2800]
        }

        if crop in base_yields:
            crop_data = base_yields[crop]
        else:
            start = 2000 + random.randint(0, 2000)
            crop_data = [start]
            for _ in range(5):
                crop_data.append(crop_data[-1] + random.randint(50, 200))

        return [
            HistoricalDataPoint(month=month, yield_=val)
            for month, val in zip(months, crop_data)
        ]

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------- Run server (for local dev) -------------------

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)


from fastapi import File, UploadFile
from fastapi.responses import JSONResponse

@app.post("/predict-disease")
async def predict_disease_api(file: UploadFile = File(...)):
    try:
        if not predict_disease:
            raise HTTPException(status_code=500, detail="Model not available")

        image_bytes = await file.read()
        prediction = predict_disease(image_bytes)

        return JSONResponse(content={
            "plant": prediction["plant"],
            "condition": prediction["condition"],
            "confidence": prediction["confidence"],
        })
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


from fastapi import UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image
import io

@app.post("/predict-disease")
async def predict_disease_api(file: UploadFile = File(...)):
    try:
        # Read image bytes
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))

        # Use actual model if available
        if predict_disease:
            result = predict_disease(image)
        else:
            # Dummy result for now
            result = {
                "plant": "Tomato",
                "condition": "Tomato___Early_blight",
                "confidence": 0.85
            }

        return JSONResponse(content={"success": True, "result": result})

    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})
