const mongoose = require("mongoose");

const yieldDataSchema = new mongoose.Schema({
  crop: { type: String, required: true },
  temperature: Number,
  rainfall: Number,
  soilType: String,
  season: String,
  expectedYield: Number,
  region: String,
  date: { type: Date, default: Date.now }
});

const YieldData = mongoose.model("YieldData", yieldDataSchema);
module.exports = YieldData;
