// backend/predictCrop.js

const express = require("express")
const router = express.Router()

// --- Prediction Logic (Simplified AI Model Simulation) ---

router.post("/predict", async (req, res) => {
  const { crop, area, soilType, season } = req.body

  const predictions = {
    Wheat: { base: 4500, price: 0.49 },
    Rice: { base: 6000, price: 0.47 },
    Corn: { base: 3200, price: 0.56 },
    Soybeans: { base: 2800, price: 1.25 },
    Cotton: { base: 1500, price: 3.47 },
    Sugarcane: { base: 8000, price: 0.18 },
  }

  const healthOptions = ["Healthy", "Warning", "Danger"]
  const health = healthOptions[Math.floor(Math.random() * healthOptions.length)]

  const base = predictions[crop] || { base: 3000, price: 0.5 }
  const predictedYield = Math.round(base.base * parseFloat(area))
  const predictedPrice = Math.round(predictedYield * base.price)

  res.json({
    predictedYield,
    predictedPrice,
    healthStatus: health,
  })
})

// --- Historical Data Simulation (Optional Endpoint for Yield Trends) ---

router.get("/historical-yield", async (req, res) => {
  const { crop } = req.query

  // Simulate 6 months of historical data
  const data = [
    { month: "Jan", yield: 3200 + Math.random() * 1500 },
    { month: "Feb", yield: 3500 + Math.random() * 1500 },
    { month: "Mar", yield: 3700 + Math.random() * 1500 },
    { month: "Apr", yield: 3900 + Math.random() * 1500 },
    { month: "May", yield: 4100 + Math.random() * 1500 },
    { month: "Jun", yield: 4300 + Math.random() * 1500 },
  ]

  res.json({ crop, data })
})

module.exports = router
