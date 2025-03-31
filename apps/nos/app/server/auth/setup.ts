import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { Context } from "hono";
import type { Bindings, AuthVariables } from "../context";
import { openAPI } from "better-auth/plugins";
import { oAuthProxy } from "better-auth/plugins";
import * as schema from "@/db/schema";

export function setupAuth(
  ctx: Context<{ Bindings: Bindings; Variables: AuthVariables }>
): ReturnType<typeof betterAuth> {
  return betterAuth({
    emailAndPassword: {
      enabled: true,
    },
    advanced: {
      cookiePrefix: "nos",
      // useSecureCookies TODO - yes use this
    },
    basePath: "/api/auth", // this is default, but for clarity I'm setting it

    database: drizzleAdapter(ctx.env.db, {
      provider: "sqlite",
      schema: schema,
    }),
    appName: "nos",
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },

    plugins: [
      openAPI({
        path: "/docs", // /api/auth/docs
      }),
      oAuthProxy(),
    ],
  });
}
