import { setupAuthClient, type AuthClient } from "@/server/auth/setupClient";

export function getAuthClient(baseUrl: string): AuthClient {
  const client = setupAuthClient(baseUrl);

  return client;
}
