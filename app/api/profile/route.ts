import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// GET: Fetch profile by email
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const response = await axios.get(`${BACKEND_URL}/profile/${email}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("GET /profile error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PATCH: Update profile (with optional image)
export async function PATCH(req: NextRequest) {
  try {
    const formData = await req.formData();

    const data = new FormData();
    data.append("name", formData.get("name") as string);
    data.append("email", formData.get("email") as string);
    data.append("phone", formData.get("phone") as string);
    data.append("role", formData.get("role") as string);

    const image = formData.get("profile_image") as File | null;
    if (image && image.name) {
      const blob = new Blob([await image.arrayBuffer()], { type: image.type });
      data.append("profile_image", blob, image.name);
    }

    const headers: any = data instanceof FormData && typeof data.getHeaders === "function"
      ? data.getHeaders()
      : {};

    const response = await axios.patch(`${BACKEND_URL}/profile`, data, {
      headers,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("PATCH /profile error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Failed to update profile" },
      { status: 500 }
    );
  }
}

// PUT: Change password
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const data = new FormData();
    data.append("email", body.email);
    data.append("current_password", body.current_password);
    data.append("new_password", body.new_password);

    const headers: any = data instanceof FormData && typeof data.getHeaders === "function"
      ? data.getHeaders()
      : {};

    const response = await axios.put(`${BACKEND_URL}/profile/password`, data, {
      headers,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("PUT /profile/password error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Failed to change password" },
      { status: 500 }
    );
  }
}
