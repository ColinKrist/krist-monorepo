import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server";
import type { HonoRequest } from "hono";

export type AppTrpcClient = ReturnType<typeof createTRPCClient<AppRouter>>;

export function getTrpcClient(request: HonoRequest): AppTrpcClient {
  return createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: new URL(request.url).origin + "/api/trpc",
      }),
    ],
  });
}
