import type { Context } from "hono";
import { createAuthClient } from "better-auth/client";
import {
  inferAdditionalFields,
  genericOAuthClient,
} from "better-auth/client/plugins";

import type { AuthVariables, Bindings } from "../context";

export function setupAuthClient(
  c: Context<{ Bindings: Bindings; Variables: AuthVariables }>
): ReturnType<typeof createAuthClient> {
  return createAuthClient({
    baseURL: "http://localhost:3000",
    plugins: [inferAdditionalFields<typeof c.env.auth>(), genericOAuthClient()],
  });
}
