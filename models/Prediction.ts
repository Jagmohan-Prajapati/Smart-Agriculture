import mongoose from "mongoose";

const PredictionSchema = new mongoose.Schema(
  {
    crop: String,
    area: Number,
    soil: String,
    season: String,
    predictedYield: Number,
    predictedPrice: Number,
    healthStatus: String,
  },
  { timestamps: true }
);

export default mongoose.models.Prediction || mongoose.model("Prediction", PredictionSchema);
