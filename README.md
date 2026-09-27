# CheckFirst

A private, local-first tool that helps nontechnical people understand warning signs in messages, links, email files, phone calls and QR codes. Built as a university work-experience project. Findings explain uncertainty and practical next steps; they never certify content as safe.

**Start here: [complete service setup and deployment guide](docs/SETUP.md)** — includes Windows installation, GitHub checks, Cloudflare Pages, costs, account actions and troubleshooting.

- [User guide](docs/USER_GUIDE.md)
- [Verification record](docs/VERIFICATION.md)
- [Project brief](docs/PROJECT_BRIEF.md)
- [Privacy and limitations](docs/PRIVACY_AND_LIMITATIONS.md)
- [Rendered pitch presentation (PDF)](docs/presentation/checkfirst-pitch.pdf)
- [Interactive pitch presentation (HTML)](docs/presentation/checkfirst-pitch.html)
- [Presentation notes and rendering instructions](docs/presentation/README.md)

## Run locally

Install Node.js **24.18.0** and pnpm **11.11.0**, then run from this directory:

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Open the exact local address printed in the terminal (normally `http://127.0.0.1:5173/`; Vite may select another port if occupied). No account, database or credentials are needed. Try a fictional example or download [the fictional .eml fixture](public/fixtures/fictional-delivery.eml).

| Command | Purpose |
|---|---|
| `pnpm test` | Run deterministic local analysis, MIME parsing and status-route tests |
| `pnpm lint` | Check code quality |
| `pnpm typecheck` | Check TypeScript contracts |
| `pnpm build` | Type-check and build the website into `dist` |
| `pnpm preview` | Preview built frontend; does not run Functions |
| `pnpm preview:cloudflare` | Build and run pinned Wrangler Pages preview at `http://127.0.0.1:8788` including `/api/status` |
| `pnpm test:e2e` | Run browser checks; requires a compatible browser (see setup guide) |

## What works

- Plain-language local warning patterns for pressure, credentials, payments, secrecy and remote access.
- Link parsing, destination domains, shortened/encoded/numeric address hints; no destination is contacted.
- `.eml` MIME decoding up to 2 MiB. HTML becomes inert text; attachments and authentication claims are not verified.
- Country clarification and phone-format checks; caller identity and location cannot be established.
- Local PNG/JPEG/WebP QR decoding up to 5 MiB and 16 megapixels; decoded destinations are never opened.
- Redacted Markdown export by default; optional destination domain and phone inclusion.
- Reviewed Australian support directory, responsive layout and keyboard-operable forms.

The only server route is `GET /api/status`, which reports that online checks are **disabled**. It accepts no submissions. No live feed adapter, database, user accounts, analytics or submission storage is implemented. Supabase is not required for this version. No account or database setup is necessary.

## Deploy

Use GitHub integration with **Cloudflare Pages Free** and the supplied `pages.dev` address. Root is this repository directory, output is `dist`; set `SKIP_DEPENDENCY_INSTALL=1`, `NODE_VERSION=24.18.0`, `PNPM_VERSION=11.11.0` and build with `pnpm install --frozen-lockfile && pnpm build`. The explicit install makes the lockfile requirement enforceable. The `functions/` directory deploys alongside the website. Follow [SETUP.md](docs/SETUP.md) for verified dashboard steps and checkpoints. No remote repository or deployment is claimed by the local project.

## Privacy and limitations

Submissions stay in browser memory and clear on refresh or “Clear this check.” The host receives ordinary page and optional status requests. No suspicious destinations become links; only fixed reviewed support resources are clickable. Local pattern matching can miss sophisticated attacks and flag legitimate messages. No external source freshness or reputation verdict is available.

Keep real emails, personal data, credentials and live feeds out of source control. Only explicitly fictional fixtures belong in `public/fixtures/`. See `AGENTS.md` for contributor rules; after code changes run `graphify update .`.
