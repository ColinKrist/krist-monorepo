import { createAuthClient } from "better-auth/react";

export type AuthClient = ReturnType<typeof createAuthClient>;

export function setupAuthClient(baseUrl: string): AuthClient {
  const client = createAuthClient({
    baseURL: baseUrl, // the base url of your auth server
  });

  return client;
}
