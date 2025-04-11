const mongoose = require("mongoose");

const diseaseSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  diseaseName: { type: String, required: true },
  imagePath: { type: String, required: true }, // e.g. /public/dataset/Tomato_Leaf_Mold/img001.jpg
  isHealthy: { type: Boolean, default: false },
  uploadDate: { type: Date, default: Date.now }
});

const CropDisease = mongoose.model("CropDisease", diseaseSchema);
module.exports = CropDisease;
