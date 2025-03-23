import { reactRouter } from "@react-router/dev/vite";
import { cloudflareDevProxy } from "@react-router/dev/vite/cloudflare";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import { defineConfig } from "vite";
import autoprefixer from "autoprefixer";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
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

  // ssr: {
  //   target: "webworker",
  //   noExternal: true,
  //   external: ["node:async_hooks"],
  //   resolve: {
  //     conditions: ["workerd", "browser"],
  //   },
  //   optimizeDeps: {
  //     include: [
  //       "react",
  //       "react/jsx-runtime",
  //       "react/jsx-dev-runtime",
  //       "react-dom",
  //       "react-dom/server",
  //       "react-router",
  //     ],
  //   },
  // },
  plugins: [
    tailwindcss(),
    cloudflareDevProxy(),
    reactRouterHonoServer({
      runtime: "cloudflare",
      flag: {
        force_react_19: true,
      },
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
});
