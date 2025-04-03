import { createAuthClient } from "better-auth/react";

// @ts-ignore
export function useClientAuth() {
  const authClient = createAuthClient();

  return authClient;
}
