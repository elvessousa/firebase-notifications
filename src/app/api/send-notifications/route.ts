import { NextRequest, NextResponse } from "next/server";

import { db, messaging } from "../../../../firebase-admin-config";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";

interface NotificationData {
  title?: string;
  body?: string;
  icon?: string;
  url?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (req.method === "POST") {
    try {
      const tokensSnapshot = await db.collection("subscriptions").get();
      const tokens = tokensSnapshot.docs.map(
        (doc: QueryDocumentSnapshot) => doc.data().token,
      );

      if (tokens.length === 0) {
        return new NextResponse(JSON.stringify({ error: "No tokens found" }), {
          status: 404,
        });
      }

      const body: NotificationData = await req.json();

      const message = {
        data: {
          title: body.title || "Default Title",
          body: body.body || "Default Message",
          icon: body.icon || "/firebase-logo.png",
          url: body.url || "/",
          tag: Date.now().toString(),
          clickAction: body.url || "/",
          timestamp: new Date().toISOString(),
        },
        webpush: {
          headers: {
            Urgency: "high",
            priority: "high",
            TTL: "86400",
          },
          fcmOptions: {
            link: body.url || "/",
          },
        },
        tokens: tokens,
      };

      const response = await messaging.sendEachForMulticast(message);

      return new NextResponse(
        JSON.stringify({
          message: "Notifications sent",
          results: {
            success: response.successCount,
            failure: response.failureCount,
            responses: response.responses,
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error("Error sending notifications:", error);
      return new NextResponse(
        JSON.stringify({
          error: "Error sending notifications",
          details: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  } else {
    return new NextResponse("Method Not Allowed", { status: 405 });
  }
}
