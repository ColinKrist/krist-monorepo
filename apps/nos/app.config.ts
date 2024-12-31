// app.config.ts
import { defineConfig } from "@tanstack/start/config";

export default defineConfig({
  server: {
    compatibilityDate: "2024-09-19",
    preset: "cloudflare-module",
    devStorage: {
      kvStore: {
        driver: "cloudflare-kv-binding",
        binding: "KV",
      },
      r2Store: {
        driver: "cloudflare-r2-binding",
        binding: "R2",
      },
    },
    storage: {
      kvStore: {
        driver: "cloudflare-kv-binding",
        binding: "KV",
      },
      r2Store: {
        driver: "cloudflare-r2-binding",
        binding: "R2",
      },
    },
  },
});
