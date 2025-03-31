import type { Env } from "../../worker-configuration.d";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { createHonoServer } from "react-router-hono-server/cloudflare";
import * as schema from "~/db/schema";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "~/api/server";
import { getLoadContext, type Bindings, type AuthVariables } from "./context";
import { setupAuth } from "./auth/setup";
import { setupAuthClient } from "./auth/setupClient";

const app = new Hono<{ Bindings: Bindings; Variables: AuthVariables }>();

export default createHonoServer({
  beforeAll(app) {
    app.use((c, next) => {
      c.set("auth", setupAuth(c));

      c.set("authClient", setupAuthClient(c));

      return next();
    });
  },

  configure: (c) => {
    c.use(
      poweredBy({
        serverName: "colin.krist.io",
      })
    );

    app.use("*", async (c, next) => {
      const session = await c.var.auth.api.getSession({
        headers: c.req.raw.headers,
      });

      if (!session) {
        c.set("user", null);
        c.set("session", null);
        return next();
      }

      c.set("user", session.user);
      c.set("session", session.session);
      return next();
    });

    c.use(
      "/api/trpc/*",
      trpcServer({
        createContext: (_opts, c) => ({
          ...c.env,
          db: drizzle(c.env.D1, { schema }),
        }),
        router: appRouter,
        allowBatching: true,
        endpoint: "/api/trpc",
        onError: (opts) => {
          // output a nice error message containing all the properties
          console.error(opts);

          return new Response(
            JSON.stringify({
              message: opts.error.message,
              cause: opts.error.cause,
              stack: opts.error.stack,
              name: opts.error.name,
              code: opts.error.code,
            }),
            {
              status: 500,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        },
      })
    );
  },
  app,
  getLoadContext,
});
