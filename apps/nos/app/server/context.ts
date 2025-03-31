import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import type { Context } from "hono";
import { unstable_createContext } from "react-router";
import { getTrpcClient, type AppTrpcClient } from "~/api/client";
import * as schema from "~/db/schema";
import type { setupAuth } from "./auth/setup";
import type { Env } from "worker-configuration";
import type { setupAuthClient } from "./auth/setupClient";

export type Bindings = {
  db: DrizzleD1Database<typeof schema>;
  client: AppTrpcClient;
} & Env;

export type AuthVariables = {
  auth: ReturnType<typeof setupAuth>;
  authClient: ReturnType<typeof setupAuthClient>;
  user: ReturnType<typeof setupAuth>["$Infer"]["Session"]["user"] | null;
  session: ReturnType<typeof setupAuth>["$Infer"]["Session"]["session"] | null;
};

declare module "react-router" {
  interface unstable_createContext extends Bindings {}
}

const globalAppContext = unstable_createContext<GlobalAppContext>();

const generateContext = async (
  c: Context<{ Bindings: Bindings; Variables: AuthVariables }>
): Promise<Bindings> => {
  const db = drizzle(c.env.D1, { schema });
  const client = getTrpcClient(c.req);

  return {
    ...c.env,
    db,
    client,
  };
};

export const getLoadContext = async (
  c: Context<{ Bindings: Bindings; Variables: AuthVariables }>
) => {
  const ctx = await generateContext(c);
  return new Map([[globalAppContext, ctx]]);
};

interface GlobalAppContext
  extends Awaited<ReturnType<typeof generateContext>> {}

export { globalAppContext };
