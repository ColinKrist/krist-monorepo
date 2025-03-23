import type { Env } from "./../worker-configuration.d";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { createHonoServer } from "react-router-hono-server/cloudflare";
import * as schema from "~/db/schema";
import { trpcServer } from "@hono/trpc-server";
import { appRouter } from "./api/server";
import { getTrpcClient, type AppTrpcClient } from "./api/client";

export type Bindings = {
  db: DrizzleD1Database<typeof schema>;
} & Env;

declare module "react-router" {
  interface AppLoadContext extends Bindings {
    client: AppTrpcClient;
  }
}

const app = new Hono<{ Bindings: Bindings }>();

export default await createHonoServer({
  configure: (c) => {
    // app.use(async (c, next) => {
    //   // @ts-ignore
    //   c.set("db", drizzle(c.env.D1, { schema }));

    //   await next();
    // });

    c.use(
      poweredBy({
        serverName: "colin.krist.io",
      })
    );

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
  getLoadContext(c) {
    const db = drizzle(c.env.D1, { schema });
    //@ts-expect-error - this is a bit of a hack to get the db in the context
    return { db, ...c.env, client: getTrpcClient(c.req) };
  },
});
