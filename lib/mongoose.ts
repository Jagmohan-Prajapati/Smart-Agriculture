import mongoose from "mongoose"

let isConnected = false // track connection status

export async function connectToDB() {
  if (isConnected) return

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "smart_agriculture", // change if your DB name is different
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    isConnected = true
    console.log("✅ MongoDB connected")
  } catch (err) {
    console.error("❌ MongoDB connection error:", err)
    throw err
  }
}
