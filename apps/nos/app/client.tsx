// app/client.tsx
/// <reference types="vinxi/types/client" />
import { hydrateRoot } from "react-dom/client";
import { StartClient } from "@tanstack/start";
import { createRouter } from "./router";

async function startApp() {
  try {
    const router = createRouter();
    hydrateRoot(document, <StartClient router={router} />);
  } catch (error) {
    console.error("Failed to start app:", error);
  }
}

startApp();
