import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DiseasePrediction from "@/models/DiseasePrediction";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const backendFormData = new FormData();
    backendFormData.append("file", new Blob([buffer]), image.name);

    const backendResponse = await fetch("http://localhost:8000/predict-disease/", {
      method: "POST",
      body: backendFormData,
    });

    if (!backendResponse.ok) {
      const errText = await backendResponse.text();
      return NextResponse.json({ error: "Prediction failed", details: errText }, { status: 500 });
    }

    const result = await backendResponse.json();
    console.log("FastAPI Prediction Response:", result);

    // Destructure from FastAPI response
    const predictedClass = result?.prediction?.predicted_class || "Unknown";
    const confidence = result?.prediction?.confidence || 0;
    const imagePath = result?.image_path || "";

    // Parse plant and disease from predicted class
    const [plant, disease] = predictedClass.split("___");

    // Save to MongoDB
    await dbConnect();
    await DiseasePrediction.create({
      plant,
      disease,
      confidence,
      imagePath,
      timestamp: new Date(),
    });

    return NextResponse.json({ plant, disease, confidence, imagePath });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error", details: String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const history = await DiseasePrediction.find().sort({ timestamp: -1 }).lean();
    return NextResponse.json(history);
  } catch (err) {
    console.error("Failed to fetch disease history:", err);
    return NextResponse.json({ error: "Failed to fetch disease history", details: String(err) }, { status: 500 });
  }
}
