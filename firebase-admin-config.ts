import admin from "firebase-admin";
import { getMessaging } from "firebase-admin/messaging";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_SERVICE_ACCOUNT_KEY?.replace(
          /\\n/g,
          "\n",
        ),
      }),
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
  }
}

const messaging = getMessaging();
const db = admin.firestore();

export { messaging, db };
