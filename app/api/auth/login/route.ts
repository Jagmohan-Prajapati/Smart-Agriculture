import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/backend/userAuth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const { user, token } = await loginUser(email, password);
    return NextResponse.json({ success: true, user, token });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 401 }
    );
  }
}
