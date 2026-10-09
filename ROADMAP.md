# FindThisBIN — content and conversion roadmap

- **Research date:** 28 September 2026
- **Target:** FindThisBIN marketing site
- **Status:** Proposed website work; no stages implemented by adding this document.

## Goal and direction

Make FindThisBIN easier to understand, evaluate, and buy while preserving its
enterprise, bring-your-own-data-license model and current visual identity.
**Book a demo** remains the primary conversion. Public technical content should
help engineers qualify the product before speaking to sales.

BINLookupAPI's strongest content advantage is its connected evaluation journey:
visitors can inspect an example, understand the response, read integration
instructions, see commercial terms, and take a clear next step. FindThisBIN
already has substantial marketing content. The opportunity is to make it more
accurate, useful, and connected, rather than simply making the homepage longer.

FindThisBIN's distinctive story is customer-controlled deployment and licensed
data, multi-source reconciliation, and per-field provenance. Explain and
demonstrate those capabilities instead of copying a hosted API's signup funnel.

This document is the forward-looking backlog. It does not make proposed routes
or capabilities current. Update DESIGN.md and contributor documentation when a
stage ships; historical Pricing and Docs prototypes are not implementation specs.

## Research scope and evidence

The competitor review followed public links through the homepage, documentation,
quickstart, API reference, batch and CSV documentation, pricing, tool pages,
blog index and a PHP guide, changelog, status, contact, privacy, and llms.txt.
It sampled representative journeys; it was not an exhaustive crawl of every
bank, country, BIN, or article page. The sitemap and some additional documentation
URLs could not be retrieved. No account was created and no paid API, throughput,
uptime, data accuracy, or conversion performance was tested. Competitor features
below describe its published offering, not independently verified performance.

The live FindThisBIN site could not be retrieved during the review. Our baseline
is the local marketing source (HEAD `64e4276` at review time), checked against
the local engine contract and selected handlers. This establishes source-level
content gaps, not the exact state of a deployed site. No browser-behavior or
visual-comparison results are claimed.

### Public sources

- [Homepage](https://binlookupapi.com/): proposition, demo, examples, use cases,
  pricing, and calls to action.
- [Documentation](https://binlookupapi.com/docs/),
  [quickstart](https://binlookupapi.com/docs/quickstart/), and
  [API reference](https://binlookupapi.com/docs/api-reference/): technical evaluation.
- [Batch lookup](https://binlookupapi.com/docs/batch-lookups/) and
  [batch CSV](https://binlookupapi.com/docs/batch-csv/): workflow documentation.
- [Pricing](https://binlookupapi.com/pricing/): commercial information and FAQs.
- [Tools hub](https://binlookupapi.com/bin-lookup/),
  [BIN checker](https://binlookupapi.com/bin-checker/),
  [8-digit checker](https://binlookupapi.com/8-digit-bin-checker/), and
  [Visa lookup](https://binlookupapi.com/bin-lookup/visa/): task-specific entry points.
- [Blog](https://binlookupapi.com/blog/) and
  [PHP integration guide](https://binlookupapi.com/blog/php-bin-lookup-api-guide/): education.
- [Changelog](https://binlookupapi.com/changelog/) and
  [status](https://status.binlookupapi.com/): public operational information.
- [Contact](https://binlookupapi.com/contact/),
  [privacy](https://binlookupapi.com/privacy/), and
  [llms.txt](https://binlookupapi.com/llms.txt): supporting content.

Do not treat the competitor as a consistency standard: retrieved pricing and
llms.txt snapshots showed different entry-plan prices. Prefer a shared source
for repeated commercial facts and record review dates for external comparisons.

### Local sources of truth

- Current pages: [Home](src/pages/index.astro), [Product](src/pages/product.astro),
  [Features](src/pages/features.astro), and [Contact](src/pages/contact.astro).
- Demonstration: [playground component](src/components/BinPlayground.astro) and
  [sample/synthesis logic](src/lib/bin.ts).
- Engine: [public OpenAPI contract](../../findthisbin/api/openapi.yaml),
  [HTTP handlers](../../findthisbin/internal/httpapi/handlers.go), and
  [response serialization](../../findthisbin/internal/httpapi/serialize.go).
- Reusable material: [documentation index](../../findthisbin/docs/README.md),
  [quickstart](../../findthisbin/docs/quickstart.md),
  [single lookup](../../findthisbin/docs/api/get-bin.md),
  [batch lookup](../../findthisbin/docs/api/batch-lookup.md), and
  [engine changelog](../../findthisbin/CHANGELOG.md).
- Constraints: [DESIGN.md](DESIGN.md), [CLAUDE.md](CLAUDE.md), and
  [shared marketing standard](../MARKETING_TECH_STACK.md).

Engine links assume the sibling checkout layout used for this review. Verify
current contracts and implementation before publishing content; older engine
prose also contains hosted URLs and commercial language that need reconciliation.

## Content comparison

| Area | BINLookupAPI's published content | FindThisBIN source today | What to adopt or improve |
| --- | --- | --- | --- |
| Positioning | A hosted API with data included and a self-service entry point. | An enterprise engine with customer data licenses and deployment choices. | Preserve our model; explain who needs it and the responsibilities it entails. |
| Evaluation | Homepage connects lookup, examples, docs, and signup. | Deployment sections, code tabs, playground, and repeated demo CTAs. | Add an ungated technical evaluation path leading to a demo or POC. |
| Demonstration | Checker is described as using production data and explains what a BIN cannot establish. | Four sample records plus locally synthesized issuer, country, flags, and confidence for other inputs. | Clearly labeled sample scenarios with contract-accurate output and limitations. |
| Integration | Public quickstart, field definitions, errors, and OpenAPI. | Short marketing snippets; fuller material exists in the engine checkout. | Publish curated docs and ordinary HTTP examples. |
| Commercial clarity | Pricing, limits, included features, and purchasing FAQs. | Pricing factors appear in one Features FAQ; sales explains the rest. | Dedicated enterprise pricing explanation without invented amounts or self-serve plans. |
| Use cases | Dedicated tools and educational guides provide several discovery paths. | Broad use cases appear mostly as short lists or lifecycle steps. | Worked examples connecting a buyer problem to fields, decisions, and limitations. |
| Operational evidence | Public changelog and service-status page. | Latency, availability, and deployment claims without equivalent public evidence. | Publish verified release notes, scoped operating responsibilities, and reproducible measurements. |
| Trust | Public legal and contact information. | Privacy, terms, DPA, and GDPR pages already exist. | Improve factual consistency and deployment-specific explanations; do not describe legal pages as missing. |
| Discoverability | Tools, guides, machine-readable documentation, and cross-links. | Core pages already have canonical metadata, sitemap, JSON-LD, and PNG social previews. | Expand useful content and internal links; do not redo SEO work already present. |

## Delivery roadmap

Priorities indicate order, not promised dates. P0 corrects the foundation; P1
improves evaluation; P2 addresses procurement; P3 adds focused education. Owners
below are responsibilities to assign when scheduling, not assertions about
current staffing. All stages start as **Not Started**.

### Stage 1: Correct the content foundation — P0

- **Goal:** Make public claims and demonstrations agree with the product.
- **Owner:** Product/engine maintainer and marketing implementer.
- **Dependencies:** Current contract, implementation, and evidence review.
- **Status:** Not Started

**What and how**

- Replace the 10,000-BIN batch claim with the implemented 1,000-BIN maximum.
- Remove claims of shipped SDKs and package imports from the homepage examples.
  The engine intentionally publishes an HTTP contract, not client SDKs. Use
  standard HTTP clients in the existing language tabs.
- Remove `/v1/dcc/{bin}` and unsupported DCC response fields from current-product
  examples. The reviewed public contract and router contain no DCC endpoint.
  Do not implement new engine features to rescue outdated marketing copy.
- Use the actual response envelope: `data`, `provenance`, `match_level`,
  `build_number`, and other documented fields. Explain missing values honestly;
  an absent flag is not automatically false.
- Replace arbitrary-input synthesis with selectable, fixed sample scenarios:
  a resolved record and an unknown-result record. Label both **Sample response —
  no live lookup** before interaction and beside the output. Use clearly fictional
  sample institutions. Explain that these illustrate the schema, not coverage.
- Align unknown-result examples with the real engine: no invented issuer or
  country, no fabricated high confidence, and no provenance when none exists.
  Preserve a readable default sample without JavaScript.
- Correct blanket residency language: customer-hosted and managed-in-customer-cloud
  deployments differ from hosting operated by us. Separate data ownership,
  deployment isolation, and physical hosting location.
- Review feature-table restrictions against the engine's all-features-enabled
  model. Distinguish software capabilities from contracted operating services;
  do not imply nonexistent software entitlement enforcement.
- Build a claim inventory covering latency, uptime, rollout times, connector
  availability, compliance wording, and the “most popular” badge. Record the
  evidence and owner. Remove or qualify unsupported claims before publication.

**Success Criteria:** No generated lookup results presented as real, nonexistent
SDK instructions, unsupported API routes, conflicting limits, or unqualified
cross-deployment residency claims remain.

**Tests:** Compare all examples with the public contract and handlers. Exercise
both sample states, JavaScript-disabled rendering, keyboard selection, and mobile
layout. Search for retired SDK imports, DCC routes, 10,000-item claims, and “live”
playground labels. Run the standard code gates for the eventual implementation.

### Stage 2: Make the homepage easier to evaluate — P1

- **Goal:** Explain the product, show useful output, and offer clear next steps.
- **Owner:** Marketing implementer with product review.
- **Dependencies:** Stage 1; the docs CTA ships with Stage 3.
- **Status:** Not Started

**What and how**

Reorder and consolidate existing sections into this journey:

1. Product, audience, and deployment proposition.
2. Annotated sample response showing fields, provenance, and missing-data behavior.
3. Three worked workflows: routing inputs, card classification, and historical enrichment.
4. Deployment responsibilities and customer data-license requirements.
5. An integration example with a documentation link.
6. Evaluation process, buyer questions, and the closing demo CTA.

For each workflow use **problem → relevant fields → example decision → limitations**.
Explain where FindThisBIN supplies information and where the customer's own
routing, risk, or business rules make the decision. Avoid implying that BIN
lookup alone prevents fraud or establishes regulatory compliance.

Keep **Book a demo** primary. Use **Read the docs** as the technical secondary
CTA once its destination exists; retain deployment details as an in-page link.
Preserve established anchors where possible and update all links if one changes.
Reduce repeated capability claims rather than adding another long feature grid.

**Success Criteria:** A visitor can identify who it serves, what they supply,
what they receive, and how to evaluate it without sending a form.

**Tests:** Trace buyer and developer journeys from the hero to their destinations.
Check all links, heading order, sample explanations, mobile readability, keyboard
access, reduced motion, and no-JavaScript content visibility.

### Stage 3: Publish technical evaluation content — P1

- **Goal:** Let engineers assess integration independently.
- **Owner:** Engine maintainer for accuracy; marketing implementer for publishing.
- **Dependencies:** Stage 1 and a verified evaluation-deployment workflow.
- **Status:** Not Started

**What and how**

Add a static `/docs/` hub and these initial pages:

| Route | Required content |
| --- | --- |
| `/docs/quickstart/` | Prerequisites for an already-provisioned evaluation instance, credentials, first request, response, and next step. |
| `/docs/api-reference/` | Authentication, single and batch lookups, input limits, error responses, and documented caching behavior. |
| `/docs/data-dictionary/` | Fields, nullable/unknown values, flags, match levels, per-field confidence, provenance, and source timestamps. |
| `/docs/deployment/` | Deployment prerequisites, operating responsibilities, connector setup requirements, and customer data-license obligations. |

Adapt the existing engine quickstart, API reference, and relevant operating
material. Verify against current handlers; do not bulk-publish the internal docs
folder. Replace stale hosted/sandbox URLs with an explicit customer deployment
base URL. Use ordinary HTTP examples, with cURL first.

Publish the reviewed public data-plane contract at `/openapi.yaml`. Keep schema
and behavior aligned with the engine; adapt explanatory server metadata to the
actual deployment model and record the engine revision used. Keep internal
infrastructure instructions and control-plane material outside this initial set.

Use an explicit review/update step when the engine contract changes. Do not add a
new docs platform, generated SDKs, or a build dependency on a sibling checkout.
Examples on marketing pages and docs should share their source within this repo.

**Success Criteria:** An engineer with an evaluation instance can authenticate,
make a lookup, interpret confidence and unknown fields, handle errors, and run a
valid batch without relying on fictional packages or hosted endpoints.

**Tests:** Validate the published contract and fixtures; exercise documented
requests against a controlled evaluation instance. Cover unknown results,
nullable fields, invalid BIN lengths, authentication failures, batch limits, and
per-item errors. Check downloads, canonical URLs, sitemap entries, and cross-links.

### Stage 4: Answer procurement and trust questions — P2

- **Goal:** Reduce commercial and operational uncertainty before contact.
- **Owner:** Commercial and operational owners, supported by marketing.
- **Dependencies:** Stage 1; verified commercial terms and evidence.
- **Status:** Not Started

**What and how**

- Add `/pricing/` explaining how deployment, operating responsibility, volume,
  connectors, and support/SLA requirements affect a quote. Distinguish
  software/service costs from customer data-license costs. Explain what
  information sales needs. Keep contact-driven pricing; invent neither amounts
  nor free tiers, packages, discounts, or contract commitments.
- Expand Contact with the walkthrough agenda, preparation, POC steps, and outputs:
  deployment fit, source setup, sample coverage review, integration assessment,
  and next steps. Retain existing demo/sales intents and fields. Confirm response
  promises with the person responsible for fulfilling them.
- Add `/security/` explaining deployment boundaries, operating responsibility,
  data handling, and how buyers obtain supporting information. Link the existing
  legal pages. Review factual assertions with the responsible owner before release.
- Add `/changelog/` only when shipped releases and dates can be confirmed. The
  current engine changelog is entirely marked Unreleased; it cannot establish a
  public release history on its own. Omit the route/link until evidence exists.
- Publish a performance evidence section on Product only after measurements have
  workload, hardware, dataset, measurement boundary, and date. Distinguish engine
  lookup time from end-to-end latency. Do not compare unlike competitor numbers.
- Do not create a global green status indicator for customer-operated instances.
  A public managed-service status page is a separate operational deliverable,
  conditional on an actual monitored service and incident owner.

**Success Criteria:** Buyers understand cost factors, license responsibilities,
POC expectations, hosting boundaries, and what evidence supports published claims.
Unresolved evidence blocks the affected claim, not unrelated improvements.

**Tests:** Verify pricing and responsibility statements against approved terms.
Review every release entry against a shipped version. Check legal links and
contact intents. If form behavior changes, validate success and failure paths
with and without JavaScript in an authorized development delivery setup.

### Stage 5: Add focused educational content — P3

- **Goal:** Attract relevant buyers and improve architecture evaluation.
- **Owner:** Technical writer/marketing implementer with engine review.
- **Dependencies:** Stages 1–3; an assigned content-maintenance owner.
- **Status:** Not Started

**What and how**

Add a static `/guides/` index with these first articles:

| Route suffix under `/guides/` | Buyer question and content |
| --- | --- |
| `hosted-api-vs-deployable-engine/` | When is a hosted data API sufficient, and when do deployment control and licensed sources matter? Compare responsibilities and tradeoffs fairly. |
| `six-vs-eight-digit-bins/` | How does input precision affect range matching? Adapt the existing engine explainer and show clearly labeled examples. |
| `provenance-and-confidence/` | How should an integration interpret conflicting sources, winning values, confidence, and unknown fields? |
| `evaluating-your-bin-data/` | How should a POC assess coverage, field completeness, source freshness, latency, and integration fit using a permitted sample dataset? |

Every article needs a worked example, limitations, a reviewed date, related docs,
and a relevant demo CTA. Use plain Astro pages and the current publishing pattern.

Defer large bank/country/BIN directories, arbitrary public live lookups, and broad
language-tutorial expansion. A real public lookup requires confirmed publication
rights, an authorized dataset, service ownership, abuse controls, and a separate
implementation plan. Do not quietly connect the sample walkthrough to production.

**Success Criteria:** Each guide answers a distinct buyer question and leads to
useful documentation or evaluation. No thin directory pages or unmaintained
article-volume targets are introduced.

**Tests:** Technical review of examples, terminology, and limitations; link and
metadata checks; desktop/mobile reading checks; verification that every guide
has a clear related-content path and owner.

## Implementation conventions and acceptance

- Preserve Astro, existing design tokens and components, static-first rendering,
  and current script/security conventions. No new CMS, UI framework, blog
  platform, or analytics vendor is needed.
- Centralize shared routes and CTA labels in `src/lib/site.ts`. Add navigation
  entries only when their pages are ready. Existing contact intent values remain
  `demo` and `sales`; no API or form-schema change is required by this roadmap.
- Keep source facts shared across examples; record the engine revision and review
  date used for technical content. Extend `scripts/conform.mjs` for useful,
  greppable invariants rather than creating a parallel checklist framework.
- When implementing a stage, create the temporary `IMPLEMENTATION_PLAN.md` with
  Goal, Success Criteria, Tests, and Status, update it during work, and remove it
  when complete. Maintain this long-lived roadmap's stage statuses separately.
- Update README, DESIGN.md, and contributor notes as actual routes and conventions
  change. Proposed pages must never appear in the current-page inventory early.
- For website implementation, run `npm run format:check` and
  `npm run check && npm run conform && npm run build`. Markdown is intentionally
  excluded from Prettier; review prose formatting and links directly.
- Browser verification uses the built artifact: desktop and emulated mobile,
  keyboard focus, reduced motion, no-JavaScript fallbacks, and relevant error
  states. Type/conformance/build checks do not prove browser behavior or content
  quality. Do not introduce a test framework solely for this documentation task.
- No engine feature changes, signup system, billing system, certification claims,
  or public lookup backend are authorized by this document.

## Measurement and publication gates

Before website rollout, establish a four-week baseline where data is available:
aggregate page visits, successfully delivered enquiries, qualified demos, and POC
starts. If tracking is unavailable, start the baseline when instrumentation is
verified; do not invent historical values.

Use the existing analytics arrangement for aggregate traffic and the existing
lead-handling process for delivered requests and qualification counts. Do not
assume the web analytics beacon tracks custom conversion events. Report counts
and denominators, keep demo/sales categories consistent, and review after a
comparable post-rollout period. These are directional measures, not proof that a
particular content edit caused uplift. No conversion percentage is promised.

| Needed evidence | Responsible role | Publication rule |
| --- | --- | --- |
| Product fields, limits, examples, connectors | Engine maintainer | Match current contract and behavior; remove unsupported claims. |
| Prices, contract terms, support commitments | Commercial owner | Publish only approved facts; use a custom-quote explanation otherwise. |
| Residency, security practices, legal statements | Operational/legal owner | Scope to the actual deployment model and verified practice. |
| Latency and availability | Operational/engineering owner | State measurement conditions or contractual scope; omit unsupported numbers. |
| Release dates and shipped behavior | Release owner | Publish confirmed releases only; Unreleased is not a release date. |
| Public demo data | Data-license and service owners | Keep the sample walkthrough until a separate real-data service is authorized. |

The first meaningful improvement is Stage 1. More content will be persuasive
only when a visitor can trust the examples and follow them to reliable evidence.
