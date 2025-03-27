import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import type { Context, Env } from "hono";
import { unstable_createContext } from "react-router";
import { getTrpcClient, type AppTrpcClient } from "~/api/client";
import * as schema from "~/db/schema";

export type Bindings = {
  db: DrizzleD1Database<typeof schema>;
  client: AppTrpcClient;
} & Env;

declare module "react-router" {
  interface unstable_createContext extends Bindings {}
}

const globalAppContext = unstable_createContext<GlobalAppContext>();

const generateContext = async (c: Context): Promise<Bindings> => {
  const db = drizzle(c.env.D1, { schema });
  const client = getTrpcClient(c.req);

  return {
    ...c.env,
    db,
    client,
  };
};

export const getLoadContext = async (c: Context) => {
  const ctx = await generateContext(c);
  return new Map([[globalAppContext, ctx]]);
};

interface GlobalAppContext
  extends Awaited<ReturnType<typeof generateContext>> {}

export { globalAppContext };
