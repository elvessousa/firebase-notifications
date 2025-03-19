import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}"),
    ),
  });
}

const db = getFirestore();

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 },
      );
    }

    // Save token to Firestore
    await db.collection("subscriptions").doc(token).set({
      token,
      createdAt: new Date().toISOString(),
      platform: "web",
    });

    return NextResponse.json({
      success: true,
      message: "Token saved successfully",
    });
  } catch (error) {
    console.error("Error saving token:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save notification token" },
      { status: 500 },
    );
  }
}
