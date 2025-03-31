import { unstable_createContext } from "react-router";

import type { Route } from "../../+types/root";
import { getAuthClient } from "@/api/getAuthClient";
import type { AuthClient } from "@/server/auth/setupClient";

// @ts-ignore // TODO: fix this
export const authClientContext = unstable_createContext<null | AuthClient>();

export const clientAuthMiddleware: Route.unstable_ClientMiddlewareFunction =
  async ({ context, request }, next) => {
    const authClient = getAuthClient(new URL(request.url).origin);

    try {
      context.get(authClientContext);

      return undefined;
    } catch {
      context.set(authClientContext, authClient);
    }

    await next();
  };
