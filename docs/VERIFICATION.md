---
title: CheckFirst verification record
tags: [checkfirst, verification, deployment]
reviewed: 2026-09-27
---

# Verification record

> [!important] Scope of evidence
> Local tests do not prove a public deployment works. No repository account or Cloudflare project has been connected during this build. Use fictional samples only; never open a reported phishing destination to test this tool.

This record is updated during implementation. **Completed** means a named check was run and passed. **Failed** means a check ran and did not meet its expectation. **Not yet verified** means no sufficient evidence is available. An automated check is not a substitute for testing with people who use assistive technology.

## Local evidence

The Vite development server reported **`http://127.0.0.1:5173/`** on 27 September 2026. This address is for this computer only. An Edge browser test run started a separate Vite server on port 4175 and passed **4/4** tests via `pnpm test:e2e`.

| Local check | Evidence | Status |
| --- | --- | --- |
| Install, unit checks and production build | `pnpm install --frozen-lockfile`, `pnpm test` (14/14), and `pnpm build` completed on the pinned local toolchain | Completed |
| Source quality after the final browser test edit | `pnpm lint` and `pnpm typecheck` both exited successfully | Completed |
| Fictional link, cautious result and private export | Browser test found disabled feed state, no clickable result links, no external network requests and no submitted URL/token in the default downloaded report | Completed |
| HTML `.eml` privacy | Browser test analysed controlled email text without requesting its remote image URL | Completed |
| National phone number and mobile layout | Browser test requested country clarification at 390-pixel width and found no horizontal overflow | Completed |
| PDF presentation | Rendered 11 slides from the editable HTML using the installed Edge and inspected every page for clipped or overlapping content | Completed |
| Keyboard and zoom-equivalent layout | Browser test used Tab and Arrow Right to operate tabs, then checked the form at a 640 CSS-pixel viewport, approximating a 1280-pixel screen at 200% zoom | Completed |
| Actual browser 200% zoom and full QR decode | Awaiting dedicated local checks | Not yet verified |
| Ordinary frontend preview | `pnpm preview --port 4173 --strictPort` printed `http://127.0.0.1:4173/`; `/` returned HTTP 200 HTML; `/api/status` returned HTML from the Vite fallback, not Function JSON | Completed |
| Cloudflare-compatible preview and Function response | `pnpm preview:cloudflare` printed `http://127.0.0.1:8788`; Wrangler 4.141.0 compiled the Worker; `/` returned HTTP 200 HTML and `/api/status` returned HTTP 200 `application/json` with `onlineChecks: "disabled"`, `lastUpdated: null` and `acceptsSubmissions: false` | Completed |

The local browser tests exercise controlled fixtures and do not measure real-world phishing detection. See [Setup](SETUP.md) for the service configuration and the final ordered owner-action checklist.

## Public deployment acceptance

All rows below are **not yet verified** until the owner runs them on the real `pages.dev` address. Record the date, browser/device, result and deployment identifier alongside each check.

| Check | Expected result | Status |
| --- | --- | --- |
| Desktop and mobile | Form, result and export controls remain readable and usable | Not yet verified |
| Keyboard | Focus is visible; input, analysis, examples, help and export work without a mouse | Not yet verified |
| Readable zoom | At 200% zoom, controls and result text remain available without clipped content | Not yet verified |
| Pasted link | Fictional suspicious link produces reasons and cautious next steps without navigating to it | Not yet verified |
| Pasted message | Fictional urgency/payment request produces an explanation, not a certainty score | Not yet verified |
| Email file | Fictional `.eml` produces plain-text analysis; unsupported structures are disclosed | Not yet verified |
| Phone country | A national-format number needs country clarification; formatting cannot establish ownership | Not yet verified |
| QR image | Controlled fixture decodes locally, is analysed and does not open its target | Not yet verified |
| Disabled sources | Results explicitly say that live phishing intelligence was not checked | Not yet verified |
| Missing/unavailable endpoint | Local analysis still works and an unavailable state is visible | Not yet verified |
| Stale external data | Stale-state fixtures never imply a current or safe verdict; no live feed is enabled | Not yet verified |
| Email privacy | Browser network inspection shows no submission of the file, body, sender or extracted links | Not yet verified |
| Remote email images | A controlled HTML email containing a remote image causes no image request | Not yet verified |
| Suspicious links | Analysed targets appear as non-clickable text, including exported reports | Not yet verified |
| Export and redaction | Downloaded report excludes original content and personal details by default | Not yet verified |
| Incomplete checks | Result clearly states limitations and encourages independent verification | Not yet verified |
| Functions deployment | `GET /api/status` returns the documented JSON through Pages Functions | Not yet verified |

<details>
<summary>Suggested evidence log</summary>

Use a fresh fictional sample for each test. Record only the test name, deployment ID, browser/device, date and observed outcome. Do not attach real emails, personal details, authentication tokens or live feed entries to an issue or report.

</details>
