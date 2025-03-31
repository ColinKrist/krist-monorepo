import type { Route } from "../../+types/root";

export const clientPerfMiddleware: Route.unstable_ClientMiddlewareFunction =
  async ({ request }, next) => {
    const start = performance.now();

    // Run the remaining middlewares and all route loaders
    await next();

    const duration = performance.now() - start;
    console.debug(`Navigated to ${request.url} (${duration}ms)`);
  };
