import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  server: {
    host: true,
    https: {
      key: "~/.vite-plugin-mkcert/dev.pem",
      cert: "~/.vite-plugin-mkcert/cert.pem",
    },
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
    mkcert({
      autoUpgrade: true,
      force: true,
      hosts: ["localhost", "*.localhost", "*.krist.io"],
    }),
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
