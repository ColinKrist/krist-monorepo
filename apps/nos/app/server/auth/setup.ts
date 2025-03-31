import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { Context } from "hono";
import type { Bindings, AuthVariables } from "../context";
import { openAPI } from "better-auth/plugins";
import { oAuthProxy } from "better-auth/plugins";
import { genericOAuth } from "better-auth/plugins";
import * as schema from "~/db/schema";

export function setupAuth(
  ctx: Context<{ Bindings: Bindings; Variables: AuthVariables }>
): ReturnType<typeof betterAuth> {
  return betterAuth({
    database: drizzleAdapter(ctx.env.db, {
      provider: "sqlite",
      schema: schema,
    }),
    appName: "nos",
    plugins: [
      openAPI(),
      oAuthProxy(),
      genericOAuth({
        config: [],
      }),
    ],
  });
}
