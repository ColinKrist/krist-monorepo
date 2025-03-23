import type { Env } from "./../worker-configuration.d";
import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { createHonoServer } from "react-router-hono-server/cloudflare";
import * as schema from "~/db/schema";

type Bindings = {
  db: DrizzleD1Database<typeof schema>;
} & Env;

declare module "react-router" {
  interface AppLoadContext extends Bindings {}
}

const app = new Hono<{ Bindings: Bindings }>();

export default await createHonoServer({
  configure: (c) => {
    c.use(
      poweredBy({
        serverName: "colin.krist.io",
      })
    );
  },
  app,
  getLoadContext(c) {
    const db = drizzle(c.env.D1, { schema });
    // @ts-ignore
    return { db, ...c.env };
  },
});
