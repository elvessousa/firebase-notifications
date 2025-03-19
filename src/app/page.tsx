"use client";
import { useEffect } from "react";

import { requestNotificationPermission } from "../../utils/requestNotificationPermission";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      requestNotificationPermission().catch(console.error);
    }
  }, []);

  return (
    <div>
      <h1>Next.js Firebase Notifications</h1>
      <button onClick={requestNotificationPermission}>
        Enable Notifications
      </button>
    </div>
  );
}
