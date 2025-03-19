import { messaging, getToken } from "../firebase-client-config";

export async function requestNotificationPermission() {
  if (typeof window === "undefined" || !messaging) {
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      if (token) {
        console.log("FCM Token:", token);
        // Save token to your database
        await saveTokenToDatabase(token);
        return token;
      }
    }
    throw new Error("Failed to get notification permission");
  } catch (error) {
    console.error("Error initializing Firebase Messaging:", error);
    throw error;
  }
}

async function saveTokenToDatabase(token: string) {
  // Implement your token saving logic here, e.g., send it to your API
  await fetch("/api/save-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });
}
