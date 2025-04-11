import { NextRequest, NextResponse } from "next/server"
import { registerUser } from "@/backend/userAuth"

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json()
    const newUser = await registerUser(userData)
    return NextResponse.json({ success: true, user: newUser })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 400 }
    )
  }
}
