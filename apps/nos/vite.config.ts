import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    host: true,
  },
  dev: {
    sourcemap: true,
  },
  build: {
    sourcemap: true,
  },
  css: {
    postcss: {
      plugins: [autoprefixer],
    },
  },

  plugins: [
    tailwindcss(),
    cloudflareDevProxy(),
    reactRouterHonoServer({
      runtime: "cloudflare",
      flag: {
        force_react_19: true,
      },
      serverEntryPoint: "./app/server/index.ts",
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
});
