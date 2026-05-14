"use client";

import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        console.log("[PWA] Service worker registered:", registration.scope);
      } catch (error) {
        console.error("[PWA] Service worker registration failed:", error);
      }
    };

    register();

    // Capture install prompt so browser doesn't discard it
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Store it globally so it can be triggered later if needed
      (window as Window & { __pwaInstallPrompt?: Event }).__pwaInstallPrompt = e;
      console.log("[PWA] Install prompt captured");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return null;
}