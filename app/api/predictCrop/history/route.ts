import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Prediction from "@/models/Prediction";

export async function GET() {
  try {
    await dbConnect();

    const predictions = await Prediction.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, predictions });
  } catch (error) {
    console.error("Fetch History Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch prediction history" }, { status: 500 });
  }
}
