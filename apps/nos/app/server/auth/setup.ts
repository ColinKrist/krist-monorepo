import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import type { Context } from "hono";
import type { Bindings, AuthVariables } from "../context";
import { openAPI } from "better-auth/plugins";
import * as schema from "@/db/schema";

export function setupAuth(
  ctx: Context<{ Bindings: Bindings; Variables: AuthVariables }>
): ReturnType<typeof betterAuth> {
  return betterAuth({
    emailAndPassword: {
      enabled: true,
    },
    advanced: {
      cookiePrefix: "snap-tag",
      // useSecureCookies TODO - yes use this
      defaultCookieAttributes: {
        secure: true,
        httpOnly: true,
        sameSite: "none", // Allows CORS-based cookie sharing across subdomains
        partitioned: true, // New browser standards will mandate this for foreign cookies
      },
    },
    basePath: "/api/auth", // this is default, but for clarity I'm setting it

    database: drizzleAdapter(ctx.env.db, {
      provider: "sqlite",
      schema: schema,
    }),
    appName: "nos",
    socialProviders: {
      google: {
        clientId: ctx.env.GOOGLE_CLIENT_ID as string,
        clientSecret: ctx.env.GOOGLE_CLIENT_SECRET as string,
      },
      github: {
        clientId: ctx.env.GITHUB_CLIENT_ID as string,
        clientSecret: ctx.env.GITHUB_CLIENT_SECRET as string,
      },
      facebook: {
        clientId: ctx.env.FACEBOOK_CLIENT_ID as string,
        clientSecret: ctx.env.FACEBOOK_CLIENT_SECRET as string,
      },
    },

    plugins: [
      openAPI({
        path: "/docs", // /api/auth/docs
      }),
      // oAuthProxy(),
    ],
  });
}
