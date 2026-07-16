import type { MiddlewareHandler } from "astro";
import { SECURITY_HEADERS } from "./lib/securityHeaders";

/**
 * Apply the §10 header set to on-demand responses.
 *
 * Static assets get these from public/_headers, which the Workers asset layer
 * applies before the Worker is ever consulted. This middleware only ever runs
 * for `prerender = false` routes (/contact/ and /api/contact/) — the ones the
 * asset layer never sees, and the only ones that take user input.
 *
 * Set rather than append: if a route deliberately sets its own value, it wins.
 */
export const onRequest: MiddlewareHandler = async (_ctx, next) => {
  const response = await next();
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    if (!response.headers.has(name)) response.headers.set(name, value);
  }
  return response;
};
