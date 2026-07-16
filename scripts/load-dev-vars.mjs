import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Parse `.dev.vars` (Wrangler's local-secrets format) into a plain object.
 *
 * Format: KEY=value or KEY="value", one per line. Lines starting with # are
 * comments. Returns an empty object if the file does not exist — callers handle
 * the "not set" case for each key they care about.
 *
 * @param {string} [dotDevVarsPath]
 * @returns {Record<string, string>}
 */
export function loadDevVars(dotDevVarsPath = resolve(process.cwd(), ".dev.vars")) {
  const vars = /** @type {Record<string, string>} */ ({});
  try {
    const content = readFileSync(dotDevVarsPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      vars[key] = value;
    }
  } catch {
    // .dev.vars may not exist (CI, prod builds) — that's fine.
  }
  return vars;
}

/**
 * Read a single key from .dev.vars, falling back to process.env.
 * Returns "" when neither source has the key.
 */
export function getVar(name) {
  return loadDevVars()[name] || process.env[name] || "";
}
