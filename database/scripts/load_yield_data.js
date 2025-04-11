const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const csv = require("csv-parser");
require("dotenv").config(); // Load .env before using process.env
const YieldData = require("../models/yieldData");

// MongoDB Connection using .env variable
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const results = [];
const csvPath = path.join(__dirname, "D:\Smart-Agriculture\crop-yield-data.csv");

fs.createReadStream(csvPath)
  .pipe(csv())
  .on("data", (data) => {
    // Format conversion if needed
    results.push({
      crop: data.crop,
      temperature: parseFloat(data.temperature),
      rainfall: parseFloat(data.rainfall),
      soilType: data.soilType,
      season: data.season,
      expectedYield: parseFloat(data.expectedYield),
      region: data.region,
    });
  })
  .on("end", async () => {
    try {
      await YieldData.insertMany(results);
      console.log("✅ Crop yield data loaded into MongoDB");
    } catch (err) {
      console.error("❌ Error inserting data:", err);
    } finally {
      mongoose.connection.close();
    }
  });
