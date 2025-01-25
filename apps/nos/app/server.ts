import { type DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { poweredBy } from "hono/powered-by";
import { createHonoServer } from "react-router-hono-server/cloudflare";
import * as schema from "~/db/schema";

type Bindings = {
  db: DrizzleD1Database<typeof schema>;
};

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
    console.log(c);

    const db = drizzle(c.env.DB, { schema });
    return { db };
  },
});
