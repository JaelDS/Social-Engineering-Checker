## Package manager
- Use pnpm for every JavaScript/TypeScript dependency operation. Do not use or suggest npm or npx.
- Install with `pnpm install --frozen-lockfile`; add with `pnpm add`; execute temporary tools with `pnpm dlx`; update with `pnpm update`.

## Graphify
- For codebase questions, first run `graphify query "<question>"` if `graphify-out/graph.json` exists. Use `graphify path` for relationships and `graphify explain` for concepts.
- Expected dirty graph output is not a reason to skip graphify.
- Use `graphify-out/wiki/index.md` for broad navigation when available. Read the full report only if scoped queries are insufficient.
- After code changes run `graphify update .`.

## Privacy and honest results
- Never fetch a submitted destination, render untrusted email HTML, load remote email images, or make suspicious links clickable.
- Keep submissions in browser memory. No analytics, accounts, database, or submission logging.
- An absent signal or feed match is never evidence that an item is safe.
- Keep disabled, unavailable, stale, and incomplete checks explicit. No live feed until terms, caching, matching and failure handling are implemented and reviewed.
- Use fictional fixtures only. Keep docs/SETUP.md aligned with package scripts and deployment configuration.
