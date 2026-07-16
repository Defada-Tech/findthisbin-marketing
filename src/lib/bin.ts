/**
 * BIN playground data + logic — shared by the server-rendered default card and
 * the client island so the lookup logic lives in exactly one place.
 * Ported from the README "BIN playground" spec.
 */

export interface BinRecord {
  bin: string;
  scheme: string;
  type: string;
  category: string;
  product: string;
  issuer: string;
  country: string;
  currency: string;
  prepaid: boolean;
  commercial: boolean;
  regulated_debit: boolean;
  dcc: boolean;
  confidence: number;
  bestGuess: boolean;
}

export const DATASET_VERSION = "2026-06-12";

export const QUICK_PICKS = [
  "53847012",
  "45717360",
  "37828224",
  "40128210",
] as const;

/** Exact 8-digit range matches. */
const SAMPLES: Record<string, Omit<BinRecord, "bin" | "bestGuess">> = {
  "53847012": {
    scheme: "Mastercard",
    type: "Credit",
    category: "Consumer",
    product: "World Elite Mastercard",
    issuer: "Revolut Ltd",
    country: "GB",
    currency: "GBP",
    prepaid: false,
    commercial: false,
    regulated_debit: false,
    dcc: true,
    confidence: 0.98,
  },
  "45717360": {
    scheme: "Visa",
    type: "Debit",
    category: "Consumer",
    product: "Visa Classic Debit",
    issuer: "BNP Paribas",
    country: "FR",
    currency: "EUR",
    prepaid: false,
    commercial: false,
    regulated_debit: true,
    dcc: true,
    confidence: 0.97,
  },
  "37828224": {
    scheme: "Amex",
    type: "Charge",
    category: "Commercial",
    product: "Business Platinum Card",
    issuer: "American Express",
    country: "US",
    currency: "USD",
    prepaid: false,
    commercial: true,
    regulated_debit: false,
    dcc: false,
    confidence: 0.95,
  },
  "40128210": {
    scheme: "Visa",
    type: "Prepaid",
    category: "Consumer",
    product: "Visa Prepaid Reloadable",
    issuer: "Wise Payments",
    country: "BE",
    currency: "EUR",
    prepaid: true,
    commercial: false,
    regulated_debit: false,
    dcc: true,
    confidence: 0.93,
  },
};

const COUNTRIES = ["DE", "FR", "ES", "NL", "IT", "US", "GB", "PL", "IE", "SE"];
const ISSUERS = [
  "Deutsche Bank",
  "Santander",
  "ING Group",
  "UniCredit",
  "Barclays",
  "Citi",
  "Nordea",
  "Raiffeisen",
];
const CURRENCY: Record<string, string> = {
  DE: "EUR",
  FR: "EUR",
  ES: "EUR",
  NL: "EUR",
  IT: "EUR",
  IE: "EUR",
  BE: "EUR",
  US: "USD",
  GB: "GBP",
  PL: "PLN",
  SE: "SEK",
};

function schemeFor(firstDigit: string): string {
  if (firstDigit === "4") return "Visa";
  if (firstDigit === "2" || firstDigit === "5") return "Mastercard";
  if (firstDigit === "3") return "Amex";
  if (firstDigit === "6") return "Discover";
  return "Unknown";
}

/** Strip non-digits, take first 8, return the matching sample or a synthesized best-guess. */
export function lookupBin(input: string): BinRecord | null {
  const bin = (input || "").replace(/\D/g, "").slice(0, 8);
  if (!bin) return null;

  const sample = SAMPLES[bin];
  if (sample) return { bin, bestGuess: false, ...sample };

  const sum = bin.split("").reduce((a, d) => a + Number(d), 0);
  const scheme = schemeFor(bin[0]);
  const type = ["Credit", "Debit", "Prepaid", "Charge"][sum % 4];
  const country = COUNTRIES[sum % 10];
  const currency = CURRENCY[country] ?? "EUR";
  const issuer = ISSUERS[sum % 8];

  const commercial = sum % 5 === 0;
  return {
    bin,
    scheme,
    type,
    category: commercial ? "Commercial" : "Consumer",
    product: `${scheme} ${type}${commercial ? " Business" : " Standard"}`,
    issuer,
    country,
    currency,
    prepaid: type === "Prepaid",
    commercial,
    regulated_debit: type === "Debit" && sum % 2 === 0,
    dcc: scheme !== "Amex",
    confidence: 0.84 + (sum % 9) / 100,
    bestGuess: true,
  };
}

function flagChip(label: string, on: boolean): string {
  return `<span class="flag ${on ? "on" : "off"}"><span class="ic" aria-hidden="true">${on ? "✓" : "✕"}</span>${label}</span>`;
}

/** Render the result card as an HTML string — used for the SSR default and the
 *  client island (innerHTML). Styles are global, namespaced under .bin-playground. */
export function renderCardHTML(rec: BinRecord | null): string {
  if (!rec) {
    return `<div class="bp-empty">Enter a BIN to see its card intelligence.</div>`;
  }
  const pct = Math.round(rec.confidence * 100);
  const hint = rec.bestGuess
    ? "Best-guess match · lower confidence"
    : "Exact 8-digit range match";
  return `
    <div class="bp-grid">
      <div class="bp-field"><span class="bp-label">Scheme</span><span class="bp-value">${rec.scheme}</span></div>
      <div class="bp-field"><span class="bp-label">Type</span><span class="bp-value">${rec.type}</span></div>
      <div class="bp-field bp-wide"><span class="bp-label">Issuer</span><span class="bp-value">${rec.issuer}</span><span class="bp-sub">${rec.product}</span></div>
      <div class="bp-field"><span class="bp-label">Country</span><span class="bp-value">${rec.country}</span></div>
      <div class="bp-field"><span class="bp-label">Currency</span><span class="bp-value">${rec.currency}</span></div>
      <div class="bp-field"><span class="bp-label">DCC</span><span class="bp-value ${rec.dcc ? "dcc-on" : "dcc-off"}">${rec.dcc ? "Eligible" : "Not eligible"}</span></div>
    </div>
    <div class="bp-flags">
      ${flagChip("Prepaid", rec.prepaid)}
      ${flagChip("Commercial", rec.commercial)}
      ${flagChip("Regulated debit", rec.regulated_debit)}
    </div>
    <div class="bp-conf">
      <div class="bp-conf-top">
        <span class="bp-label">Confidence</span>
        <span class="bp-conf-pct">${pct}%</span>
      </div>
      <div class="bp-bar"><span class="bp-bar-fill" style="width:${pct}%"></span></div>
      <div class="bp-hint">${hint} · Dataset version ${DATASET_VERSION}</div>
    </div>
  `;
}
