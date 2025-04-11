import mongoose, { Schema, models } from "mongoose";

const DiseasePredictionSchema = new Schema({
  plant: { type: String, required: true },
  disease: { type: String, required: true },
  confidence: { type: Number, required: true },
  imagePath: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const DiseasePrediction = models.DiseasePrediction || mongoose.model("DiseasePrediction", DiseasePredictionSchema);
export default DiseasePrediction;
