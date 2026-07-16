// One of this site's two on-demand routes — see the `// pages:` marker in
// astro.config.mjs. `/contact` itself is also `prerender = false`, so it can
// render the success/error pane from the query params this endpoint redirects to
// without JavaScript.
export const prerender = false;

import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { CONTACT_PATH } from "../../lib/site";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const wantsJson = (req: Request) =>
  (req.headers.get("accept") ?? "").includes("application/json");

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

const redirect = (to: string) =>
  new Response(null, { status: 303, headers: { Location: to } });

function ok(req: Request, intent: string) {
  return wantsJson(req)
    ? json({ ok: true })
    : redirect(`${CONTACT_PATH}?sent=1&intent=${intent}`);
}
function fail(req: Request, error: string, intent: string, status = 400) {
  return wantsJson(req)
    ? json({ ok: false, error }, status)
    : redirect(`${CONTACT_PATH}?error=1&intent=${intent}`);
}

interface Lead {
  intent: string;
  name: string;
  email: string;
  company: string;
  role: string;
  volume: string;
  message: string;
}

async function notifySlack(webhook: string, lead: Lead): Promise<void> {
  const label = lead.intent === "sales" ? "Talk to sales" : "Book a demo";
  const payload = {
    text: `New ${label} request — FindThisBIN`,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: `📥 New ${label} request` },
      },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: `*Name:*\n${lead.name || "—"}` },
          { type: "mrkdwn", text: `*Work email:*\n${lead.email || "—"}` },
          { type: "mrkdwn", text: `*Company:*\n${lead.company || "—"}` },
          { type: "mrkdwn", text: `*Role:*\n${lead.role || "—"}` },
          {
            type: "mrkdwn",
            text: `*Deployment preference:*\n${lead.volume || "—"}`,
          },
          { type: "mrkdwn", text: `*Intent:*\n${lead.intent}` },
        ],
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*Message:*\n${lead.message || "—"}` },
      },
    ],
  };

  const res = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`Slack webhook responded ${res.status}`);
  }
}

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(request, "Invalid form submission.", "demo");
  }

  const get = (k: string) => (form.get(k) ?? "").toString().trim();
  const intent = get("intent") === "sales" ? "sales" : "demo";

  // Honeypot: real users never fill `website`. Pretend success, deliver nothing.
  if (get("website") !== "") return ok(request, intent);

  const lead: Lead = {
    intent,
    name: get("name"),
    email: get("email"),
    company: get("company"),
    role: get("role"),
    volume: get("volume"),
    message: get("message"),
  };

  // Server-side validation (backstop to native required/type=email).
  if (!lead.name || !lead.company || !EMAIL_RE.test(lead.email)) {
    return fail(
      request,
      "Please provide your name, a valid work email, and your company.",
      intent,
    );
  }

  const webhook = (env as { SLACK_WEBHOOK_URL?: string }).SLACK_WEBHOOK_URL;
  if (!webhook) {
    // Don't lose the lead silently — surface in Worker logs for triage.
    console.error(
      "SLACK_WEBHOOK_URL is not set; contact request not delivered:",
      lead.email,
      lead.company,
    );
    return fail(
      request,
      "We couldn't submit your request right now. Please email us instead.",
      intent,
      500,
    );
  }

  try {
    await notifySlack(webhook, lead);
  } catch (err) {
    console.error("Failed to deliver contact request to Slack:", err);
    return fail(
      request,
      "We couldn't submit your request right now. Please try again shortly.",
      intent,
      502,
    );
  }

  return ok(request, intent);
};
