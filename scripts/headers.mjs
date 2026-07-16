/**
 * Regenerate public/_headers from src/lib/securityHeaders.ts.
 *
 * The two must agree: `_headers` covers static assets, the middleware covers SSR
 * routes, and both are supposed to apply the same §10 policy. Hand-maintaining
 * the file next to the module is how they drift — and the drift is invisible,
 * because whichever one you tested still looks right.
 *
 * Run after changing the policy or setting CF_ANALYTICS_TOKEN:
 *   npm run headers
 *
 * `npm run conform` fails the build if the file is stale.
 *
 * Zero dependencies (§12). Reads the module by stripping the types rather than
 * importing it — .ts is not loadable from plain node, and adding a bundler to
 * generate six header lines is not a trade worth making.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

export function renderHeaders() {
  const src = readFileSync(join(root, "src/lib/securityHeaders.ts"), "utf8");
  const site = readFileSync(join(root, "src/lib/site.ts"), "utf8");

  const token = site.match(/CF_ANALYTICS_TOKEN\s*=\s*"([^"]*)"/)?.[1] ?? "";
  const on = token.length > 0;

  // Pull the CSP directive list out of the module's array literal.
  const cspBlock = src.match(
    /"Content-Security-Policy":\s*\[([\s\S]*?)\]\.join\("; "\)/,
  )?.[1];
  if (!cspBlock)
    throw new Error("Could not parse the CSP array from securityHeaders.ts");

  const csp = cspBlock
    .split("\n")
    .map((l) => l.trim().replace(/,$/, ""))
    .filter((l) => l.startsWith('"') || l.startsWith("`"))
    .map((l) => l.slice(1, -1))
    .map((l) =>
      l
        .replace(
          "${CF_SCRIPT_SRC}",
          on ? " https://static.cloudflareinsights.com" : "",
        )
        .replace(
          "${CF_CONNECT_SRC}",
          on ? " https://cloudflareinsights.com" : "",
        ),
    )
    .join("; ");

  const rest = [...src.matchAll(/^\s{2}"([A-Z][A-Za-z-]+)":\s*"([^"]*)",$/gm)]
    .filter(([, k]) => k !== "Content-Security-Policy")
    .map(([, k, v]) => `  ${k}: ${v}`);

  return `/*\n  Content-Security-Policy: ${csp}\n${rest.join("\n")}\n`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = renderHeaders();
  writeFileSync(join(root, "public/_headers"), out);
  console.log("public/_headers regenerated from src/lib/securityHeaders.ts:");
  console.log(
    out
      .split("\n")
      .map((l) => "  " + l)
      .join("\n"),
  );
}
