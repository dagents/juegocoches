"use client";

import { Toaster } from "sonner";

export default function ToasterProvider() {
  return (
    <Toaster
      theme="dark"
      position="top-center"
      toastOptions={{
        style: {
          background: "#111118",
          border: "1px solid #2a2a3d",
          color: "#e2e2f0",
        },
      }}
    />
  );
}
