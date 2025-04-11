import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Prediction from "@/models/Prediction";

// POST: Predict and save to DB
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { crop, area, soil, season } = body;

    await dbConnect();

    const yieldPerAcre: Record<string, number> = {
      wheat: 4500,
      rice: 6000,
      corn: 3200,
      soybeans: 2800,
      cotton: 1500,
    };

    const pricePerKg: Record<string, number> = {
      wheat: 2200,
      rice: 2800,
      corn: 1800,
      soybeans: 3500,
      cotton: 5200,
    };

    const healthStatus: Record<string, string> = {
      wheat: "healthy",
      rice: "healthy",
      corn: "warning",
      soybeans: "healthy",
      cotton: "danger",
    };

    const predictedYield = yieldPerAcre[crop] || 3000;
    const predictedPrice = pricePerKg[crop] || 2500;
    const health = healthStatus[crop] || "healthy";

    const newPrediction = new Prediction({
      crop,
      area,
      soil,
      season,
      predictedYield,
      predictedPrice,
      healthStatus: health,
    });

    await newPrediction.save();

    return NextResponse.json({
      success: true,
      prediction: {
        crop,
        area,
        soil,
        season,
        predictedYield,
        predictedPrice,
        healthStatus: health,
      },
    });
  } catch (error) {
    console.error("Prediction Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

// 🔥 NEW: GET all predictions
export async function GET() {
  try {
    await dbConnect();
    const predictions = await Prediction.find().sort({ createdAt: -1 });
    return NextResponse.json(predictions);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch predictions" }, { status: 500 });
  }
}
