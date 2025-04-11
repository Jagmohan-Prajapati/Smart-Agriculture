require('dotenv').config();
const fs = require("fs");
const path = require("path");
const CropDisease = require("./models/diseaseData");
const mongoose = require("mongoose");

mongoose.connect("process.env.MONGO_URL");

const baseDir = path.join(__dirname, "../public/dataset");

fs.readdirSync(baseDir).forEach((folder) => {
  const crop = folder.split("_")[0];
  const diseaseName = folder.replace(/_/g, " ");
  const isHealthy = diseaseName.toLowerCase().includes("healthy");

  const folderPath = path.join(baseDir, folder);
  fs.readdirSync(folderPath).forEach((file) => {
    const imagePath = `/public/dataset/${folder}/${file}`;
    const record = new CropDisease({ crop, diseaseName, imagePath, isHealthy });
    record.save();
  });
});
