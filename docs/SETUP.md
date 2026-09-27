---
title: CheckFirst — Service setup and deployment
aliases: [CheckFirst setup, Deployment walkthrough]
tags: [checkfirst, deployment, university, operations]
reviewed: 2026-09-26
status: Local implementation; account setup pending
---

# CheckFirst: from your computer to a website

<div style="padding:1rem;border-left:5px solid #26776d;background:#edf7f4;color:#173c36"><strong>Start locally. Publish when ready.</strong><br>CheckFirst explains warning signs in suspicious communications. It cannot certify that a person, message, phone number or website is safe.</div>

> [!info] What this guide covers
> Follow the eight steps in order. The application runs without accounts, credentials or a database. GitHub and Cloudflare are only needed to publish and maintain it. Read [the user guide](USER_GUIDE.md), [privacy and limitations](PRIVACY_AND_LIMITATIONS.md) and [the verification record](VERIFICATION.md) alongside this guide.

**Review date: 26 September 2026.** Provider dashboard labels below were checked against current official documentation, not against a signed-in owner dashboard. No repository, account connection or deployment is claimed. Provider interfaces and limits can change; linked official pages are the source of truth. All account-specific names below are clearly marked placeholders.

## Service map

| Service | Why / requirement | Plan and billing details | Information it receives | Current state |
|---|---|---|---|---|
| GitHub | Required for the chosen source-control and automated-check workflow; unnecessary for local use | GitHub Free; no payment method needed for this workflow | Source, commit author metadata, fictional fixtures, documentation, CI logs; no submissions | Configuration supplied; owner repository and remote CI pending |
| Cloudflare Pages | Required hosting target | Pages Free; use the supplied `pages.dev` address; no card or purchased domain needed | Repository/build access, generated website, ordinary visitor request metadata such as IP address and user agent | Local configuration supplied; account connection and deployment pending |
| Cloudflare Pages Functions | Included source-status endpoint; necessary if server-side online checks are later implemented | Workers Free allowance applies to Functions; no paid upgrade required | Source-status HTTP requests and normal network metadata; the implemented status request contains no analysed content | Source supplied; deployed endpoint pending |
| OpenPhish Community | Optional phishing intelligence, **disabled** because permission for this use is not established | No subscription selected and no billing required while disabled | Nothing from CheckFirst while disabled | Evaluated, not connected; no live feed downloaded |
| Supabase | Not needed: no persisted application records, accounts or submission history | No account, plan or billing setup | Nothing | Not used |

The account and free-service claims are supported by [GitHub account setup](https://docs.github.com/en/account-and-profile/how-tos/account-management/creating-an-account-on-github), [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [Cloudflare plans](https://www.cloudflare.com/plans/) and [Pages Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/) (reviewed 2026-09-26). See step 8 for limits and costs.

## 1. Prepare and run the project locally

### Windows installation

1. Open the official [Node.js download page](https://nodejs.org/en/download). Select the project's pinned **Node.js 24.18.0** release and the Windows installer matching your computer, usually x64. If the landing page offers a newer release, use its previous-release/download archive selector to find the pin. Run the installer with its default PATH option, then reopen PowerShell. Node 24 is the supported LTS family for this project; see [Node release support](https://nodejs.org/en/about/previous-releases) (reviewed 2026-09-26).
2. Install **pnpm 11.11.0**, the package-manager version pinned in `package.json`. The commands below download the official installer to your temporary folder, show it for review, and then run it. If your university manages software installations, follow its installation policy. Do not disable antivirus to make an installer run.

```powershell
$env:PNPM_VERSION = '11.11.0'
$pnpmInstaller = Join-Path $env:TEMP 'checkfirst-pnpm-install.ps1'
Invoke-WebRequest -Uri 'https://get.pnpm.io/install.ps1' -OutFile $pnpmInstaller
Get-Content -LiteralPath $pnpmInstaller
& $pnpmInstaller
```

Close and reopen PowerShell after installation. Check:

```powershell
node --version
pnpm --version
```

Expected versions: `v24.18.0` and `11.11.0`. Use the pinned release rather than an unqualified latest-version install. The official [pnpm installation guide](https://pnpm.io/installation) and [installer repository](https://github.com/pnpm/get.pnpm.io/blob/main/README.md) document the standalone installer and version override (reviewed 2026-09-26).

3. Open PowerShell in the project folder. For this supplied workspace:

```powershell
Set-Location 'C:\Users\user\Documents\socialEngineeringChecker'
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm install --frozen-lockfile` is an installation command, not a `package.json` script. It installs the exact committed dependency graph and rejects a mismatched lockfile. Installation downloads packages; the running application's local analysis does not require external accounts.

**Open the Local address actually printed by the server.** In the local run on 27 September 2026, `pnpm dev` reported **`http://127.0.0.1:5173/`**. The ordinary `pnpm preview` reported **`http://127.0.0.1:4173/`**, and the Wrangler preview reported **`http://127.0.0.1:8788`**. Your address can differ if a port is occupied; use your terminal's output. The executed checks and endpoint results are in [VERIFICATION.md](VERIFICATION.md). Keep the terminal open; press <kbd>Ctrl</kbd> + <kbd>C</kbd> to stop it.

<details>
<summary><strong>macOS and Linux alternatives</strong></summary>

Install the same Node.js release using the official macOS installer or the Linux binary/installation instructions on the Node download page. Select your architecture. Install the pinned pnpm using the official POSIX installer:

```sh
curl -fsSL https://get.pnpm.io/install.sh -o /tmp/checkfirst-pnpm-install.sh
less /tmp/checkfirst-pnpm-install.sh
PNPM_VERSION=11.11.0 sh /tmp/checkfirst-pnpm-install.sh
```

Reopen your terminal, verify both versions, `cd` to the project folder, and run the same pnpm commands. Use your own folder path rather than the Windows path above.

</details>

### Commands you will use

Run these from the directory containing `package.json`:

| Command | Purpose | Expected result |
|---|---|---|
| `pnpm install --frozen-lockfile` | Reproduce committed dependencies | Completes successfully without changing `pnpm-lock.yaml` |
| `pnpm dev` | Start Vite with fast refresh while editing | Prints a Local address; the application opens there |
| `pnpm test` | Run controlled automated tests | Passing test summary; no live malicious-site visits |
| `pnpm lint` | Check source-quality rules | Exits successfully without lint errors |
| `pnpm typecheck` | Check TypeScript contracts | Exits successfully without type errors |
| `pnpm build` | Compile the production frontend | Creates `dist`; a successful build is not a deployment |
| `pnpm preview` | Serve the already built frontend | Prints a local preview address; Pages Functions do not run |
| `pnpm preview:cloudflare` | Runs `pnpm build && wrangler pages dev dist --ip 127.0.0.1 --port 8788` through project-pinned Wrangler 4.141.0 | Prints the Wrangler address and exercises Pages Functions locally |
| `pnpm test:e2e` | Additional browser-level checks through the pinned Playwright dependency | Uses installed Microsoft Edge on Windows; starts an isolated test server on port 4175; actual outcomes are recorded in VERIFICATION.md |

Run `pnpm build` before ordinary `pnpm preview`. Stop one preview before starting another if ports conflict. Ordinary Vite development/preview supports local analysis; a missing source-status route is an honest unavailable state. Cloudflare-compatible preview runs the Functions directory with the project's pinned Wrangler dependency, not a globally installed tool. See [Cloudflare local development](https://developers.cloudflare.com/pages/functions/local-development/) (reviewed 2026-09-26).

The additional `pnpm test:e2e` script uses installed Edge on Windows. On macOS/Linux, install its pinned Chromium browser with `pnpm exec playwright install chromium` before running it; Linux systems may also need the operating-system dependencies described in the [official Playwright browser guide](https://playwright.dev/docs/browsers) (reviewed 2026-09-27). Browser downloads are development tools, not application services. Port 4175 is the automated test server, not the ordinary frontend preview address.

### Local checkpoint

Open the app, choose a fictional example, analyse it, and read both the reasons and missing checks. Select the supplied fictional `.eml` fixture through the email-file control. A locally chosen file is read in your browser; choosing a file does not upload it to a server. Try a phone number without a country and observe the clarification. Export a report and inspect its redaction. [USER_GUIDE.md](USER_GUIDE.md) gives a demonstration sequence; [VERIFICATION.md](VERIFICATION.md) distinguishes executed checks from pending checks.

### Common local errors

| Problem | Solution |
|---|---|
| `node` or `pnpm` is not recognised | Reopen the terminal after installation; check PATH and `where.exe node` / `where.exe pnpm`; verify the documented versions |
| PowerShell blocks the installer script | Use an approved installer method from the official pnpm guide or ask your device administrator; do not weaken a managed policy |
| Wrong runtime / unsupported engine | Install the pinned Node release and reopen the terminal |
| Frozen lockfile mismatch | Confirm you have matching `package.json` and `pnpm-lock.yaml` from the same source revision. A maintainer intentionally changing dependencies runs `pnpm install`, reviews and commits the updated lockfile; an owner deploying an unchanged project should not bypass the check |
| Address already in use | Stop the earlier process with Ctrl+C; read the new startup output rather than assuming the port |
| Frontend preview reports source unavailable | Expected outside Wrangler; use `pnpm preview:cloudflare` to test Functions |
| `.eml` rejected or incomplete | Use the fictional fixture first; see supported size/format limits in the user guide; unsupported content must remain incomplete |
| Wrangler fails on this computer | Record the error; verify the pinned Node version and supported operating system. Frontend-only checks can still run, but Functions remain unverified until Wrangler succeeds |

No provider disconnect is needed for local use. Stop the terminal server and close the page; remove downloaded reports yourself if desired.

## 2. Create the source repository

**Owner login required here.** No existing Git remote was supplied. The examples choose GitHub only; no GitLab pipeline is needed.

1. Sign in to GitHub, or create a GitHub Free account and verify your email.
2. Select **+ → New repository**. Choose the correct **Owner**, enter `checkfirst` (or another available name), and deliberately select visibility. **Private** is suitable while reviewing university work; make it public only after reviewing contents, rights and commit metadata.
3. Create an empty repository: do not prefill README, `.gitignore` or licence because this project already has files. Select **Create repository**. Copy its HTTPS URL from **Code** / the new-repository instructions. [Official repository steps](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository) (reviewed 2026-09-26).
4. Install Git from [the official Git installation page](https://git-scm.com/downloads) if `git --version` is unavailable. Then inspect whether this folder is already a repository:

```powershell
git status
git remote -v
git branch --show-current
```

If it is not a Git repository, initialise it once:

```powershell
git init -b main
```

For an existing repository, keep its history and actual production branch. Do not reinitialise or overwrite its remote. `main` is the proposed branch for a new repository, not evidence of a remote branch.

### Review before the first push

Review `.gitignore` and the full staged list. Exclude credentials, `.env` and `.dev.vars` variants, real emails and contacts, submissions, live/unlicensed datasets, `node_modules`, `dist`, local Wrangler state, temporary logs and disposable render output. Keep source, tests with fictional data, documentation, the pnpm lockfile, and `.github/workflows/checks.yml`. Presentation deliverables are deliberate handoff assets; choose which belong in source control after checking their size.

```powershell
git status --short --ignored
git add .
git diff --cached --name-only
git diff --cached
```

Read the output before committing. `.gitignore` cannot remove an already tracked secret. If you find one, unstage it, move it out of the repository, and rotate an exposed credential before sharing; ask a maintainer to clean any committed history. A pattern scan is useful evidence, not a guarantee that no personal data exists. Use only the provided fictional email fixtures.

Set your intended commit identity if Git requests it. Replace the following placeholders with your chosen author name and your verified or GitHub-provided private commit email; these values become commit metadata. The configuration below applies only to this repository. See [GitHub commit email settings](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address) (reviewed 2026-09-26).

```powershell
git config user.name "YOUR CHOSEN AUTHOR NAME"
git config user.email "YOUR COMMIT EMAIL"
```

Then:

```powershell
git commit -m "Build CheckFirst application and deployment guide"
```

The next commands contain **placeholders**. Replace `OWNER` and `REPOSITORY` with the actual GitHub URL components before executing. For a new repository the chosen branch is `main`; replace it if your actual branch differs.

```powershell
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push -u origin main
```

Use Git's browser sign-in when prompted. Do not put access tokens into the remote URL, source, screenshots or chat. If `origin` already exists, inspect it rather than adding another. If a remote contains commits, do not force-push over them; fetch and review the history first.

### Repository checkpoint and troubleshooting

On GitHub, verify the source, `docs`, lockfile and workflow are present. Open **Actions**, select the new run and inspect each check. A green local run does not prove remote CI passed. **Checkpoint: application present and relevant automated checks green**; remote status is not yet verified in this delivery.

If no run appears, confirm the workflow is on the pushed branch, Actions is enabled for the repository, and its configured triggers include your action. For failures, open the failed step's log, reproduce that command locally, fix and push. Authentication failures usually require checking the signed-in account's repository access; never share credentials to diagnose them.

To stop local pushes, `git remote remove origin` disconnects this checkout without deleting GitHub data. To stop checks, select the workflow under **Actions**, open its three-dot menu and choose **Disable workflow**. [Official workflow controls](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/disable-and-enable-workflows) (reviewed 2026-09-26). To stop Cloudflare reading this repository, remove its repository permission as described in step 8. Retaining a private archive is usually preferable to deleting the remote history.

## 3. Connect Cloudflare Pages

**Owner login and repository authorisation required.** The project files and build instructions are prepared; no account ID or production URL is known.

1. Create/sign in to a Cloudflare account and use the Free offering.
2. Open **Workers & Pages → Create application → Pages → Connect to Git**.
3. Choose GitHub. Review the app's requested permissions; select only the application repository where possible. Authorise access for its actual owner.
4. Select the repository, then **Install & Authorize** / **Begin setup** as presented.
5. In **Set up builds and deployments**, choose an available project name and the **actual Production branch**. A branch must already have been pushed.
6. Enter the build settings below and select **Save and Deploy**.
7. Read the installation/build log, then open the generated `pages.dev` address shown by Cloudflare. Record it in your private project notes; this guide does not invent one.

These labels come from the [official Pages Git integration guide](https://developers.cloudflare.com/pages/get-started/git-integration/) (reviewed 2026-09-26). Cloudflare also promotes Workers in current documentation; this project intentionally uses **Pages**, as required.

### Exact build settings

| Field | Value |
|---|---|
| Framework preset | `None`; enter the explicit Vite build settings below |
| Production branch | `main` for a newly created repository following step 2; otherwise the actual existing branch |
| Root directory (advanced) → Path | Leave blank: `package.json`, `functions` and the lockfile are at repository root |
| Build command | `pnpm install --frozen-lockfile && pnpm build` |
| Build output directory | `dist` |
| `NODE_VERSION` | `24.18.0` |
| `PNPM_VERSION` | `11.11.0` |
| `SKIP_DEPENDENCY_INSTALL` | `1` |

**Why the build command is longer than `pnpm build`:** we deliberately disable automatic installation and install with the frozen lockfile ourselves. This makes the package-manager and lockfile policy explicit in the build log. `&&` means the build runs only after installation succeeds. The v3 build image does not infer the pnpm version from the lockfile or the `engines` field. [Build-image overrides and skip-install setting](https://developers.cloudflare.com/pages/configuration/build-image/), [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/) (reviewed 2026-09-26).

Set the three build variables for both production and preview environments. The project pins must agree with this table; when intentionally updating a pin, update this guide, CI and dashboard together. Do not remove the frozen-lockfile argument to hide an inconsistency.

### Verify the complete deployment

The log must show pnpm at the pinned version, the explicit frozen install, Vite producing `dist`, and Functions being built from the repository's `functions` directory. A successful static upload alone is insufficient evidence for server routes. Follow the source-status endpoint test in [VERIFICATION.md](VERIFICATION.md), checking HTTP status, JSON content type and body; an HTML fallback page is not a working API response.

Then run the fictional examples and email-file walkthrough on the generated site. Missing live intelligence is expected. Save the deployment identifier/commit in your private operations notes.

Git integration automatically deploys pushes to the production branch as production; permitted non-production branches produce previews. A private source repository does **not** by itself make the resulting website private. Treat deployment URLs as public. Use fictional data in demos. [GitHub integration](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/) and [branch deployment controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/) (reviewed 2026-09-26).

| Deployment problem | Check / remedy |
|---|---|
| Repository not listed | Correct GitHub owner, app installation and selected repository access; organisations may need an administrator |
| No production branch to select | Push the first commit/branch and refresh setup |
| Incorrect package-manager version | Check `PNPM_VERSION`, `NODE_VERSION` and root directory in the chosen environment |
| Frozen install fails | Commit a matching lockfile after intentional dependency changes; keep the check enabled |
| Site is blank / assets 404 | Confirm output is `dist`, root is repository root, and build completed |
| API returns HTML or 404 | Confirm Functions source is committed at repository root; deploy through Git integration; test Wrangler locally |
| Endpoint works but says disabled | Correct for the unlicensed optional feed; no credential is missing |
| Website address initially fails | Check deployment completion and exact URL; retry after DNS propagation rather than buying a domain |

**Checkpoint: deployed frontend and endpoint both verified** remains pending until the owner connects the account. You can complete all local checks first.

## 4. Configure variables and secrets

### Application runtime inventory

**The current application uses no runtime environment variables and requires no secrets.** There is no feed key, database URL, public frontend secret or deployment token to obtain. An invented variable cannot turn the disabled provider into a supported integration.

The secret-free `.dev.vars.example` documents this intentionally empty configuration. For future local Functions settings, use an ignored `.dev.vars` beside the Wrangler configuration. You may copy the example, but it is unnecessary for current local operation:

```powershell
Copy-Item -LiteralPath '.dev.vars.example' -Destination '.dev.vars'
```

### Build-tool configuration actually used

These are provider build settings, not user data or app credentials:

| Exact name | Purpose / required? | Classification / source | Local location | Cloudflare location | If absent |
|---|---|---|---|---|---|
| `NODE_VERSION` | Reproducible Node runtime; required for this walkthrough | Public; version in `.node-version` | Install that release; pin file at root | Project Settings → Variables and Secrets; Production and Preview | Provider may use a different default; `.node-version` is also recognised |
| `PNPM_VERSION` | Select pinned package manager; required for this walkthrough | Public; `packageManager` in `package.json` | Installer environment override above; package pin | Same location, both environments | Provider default may not match the lockfile/tooling |
| `SKIP_DEPENDENCY_INSTALL` | Avoid implicit install; required for this explicit build command | Public; fixed value `1` selected by this guide | Not needed for local scripts | Same location, both environments | Provider may attempt another install before the explicit frozen one |

Open **Workers & Pages → your Pages project → Settings → Variables and Secrets → Add**. Select the intended production or preview environment, add the public build values, and save. For an actual future secret, use **Encrypt** before saving. Changes require a new deployment to test. Preview and production are distinct: do not assume one environment inherits the other's secrets. Local `.dev.vars` is not uploaded to configure production. [Official bindings and secrets instructions](https://developers.cloudflare.com/pages/functions/bindings/) (reviewed 2026-09-26).

Never place credentials in `VITE_*`, public files, committed configuration, screenshots or logs. Put any future credential directly into the appropriate local file or provider dashboard; do not paste it into chat. Standard Cloudflare Git integration does **not** require a manually created deployment token. Remove an obsolete variable in each environment and redeploy when disconnecting a future integration.

**Checkpoint:** no secrets are needed, local analysis works without configuration, and optional intelligence remains clearly unavailable. Empty runtime configuration is a supported state.

## 5. Optional phishing feed: evaluated and disabled

> [!warning] Do not enable OpenPhish by copying a feed URL
> This version intentionally has no live feed adapter or refresh job. The university demonstration works with local rules and fictional fixtures. It must not claim live phishing-feed coverage.

The [OpenPhish feed page](https://openphish.com/phishing_feeds.html) advertises a limited Community text feed refreshed every **12 hours**, with a public download link and no key-entry step. That publication interval is not an unrestricted polling licence. Its [current terms](https://openphish.com/terms.html) restrict use supporting business operations and commercial functions, including product development and customer protection, without prior written consent; they also restrict making the information available to third parties. A public demonstration pitched to companies does not establish permission. **Review date: 2026-09-26.**

| Evaluation item | Finding / implemented decision |
|---|---|
| Account or key | None configured; public Community delivery alone does not grant permission for this application |
| Official endpoint | The **Free** link on the official feed page points to the provider's GitHub-hosted Community text feed; no endpoint is wired into CheckFirst |
| Attribution | A sufficient attribution/licensing agreement for this use was not established; displaying a provider name is not permission |
| Caching / redistribution | Allowed retention and redistribution for this public tool were not established; no feed is cached, bundled or committed |
| Refresh | No scheduled or per-submission refresh; no requests to the feed |
| Freshness | No live retrieval timestamp exists; status remains disabled/unavailable rather than presenting fictitious fresh data |
| Retrieval test | **Not yet verified**: intentionally not attempted, because the integration is disabled |
| Matching / provider failure / stale-data fixtures | See the implementation-specific evidence in [VERIFICATION.md](VERIFICATION.md); controlled fixtures do not establish provider availability |
| Disable / disconnect | Already disabled; no account, token, cache or subscription exists to remove |

If a later project has appropriate written permission, first document attribution, allowed caching, refresh frequency and downstream display rights, then implement and review a server-only adapter with shared caching, timeouts and failure handling. Verify one retrieval from the official provider endpoint **without following any listed destination**. Keep controlled matching tests separate from live data; test expired timestamps, empty data and provider errors. Do not request a fresh feed for each user link. None of these future capabilities is claimed as implemented now.

An absent match must always mean **not found in that source**, never **safe**. A failed or stale source must remain visible as incomplete. Current local analysis remains available regardless of this provider decision.

## 6. Supabase

**Supabase is not required for this version. No account or database setup is necessary.**

Analysis is transient in the browser and reports are downloaded to the user's device. There is no requirement to store raw email files, submissions or account history. No Supabase project, region, migrations, policies, keys, backups, quotas or inactivity configuration applies. No billing details or data are sent to Supabase. There is nothing to disconnect. Revisit the architecture only when an actual implemented feature requires persistent data; do not create a database for possible future features.

## 7. Verify the deployed application

Use [VERIFICATION.md](VERIFICATION.md) as the single evidence record. It labels checks **completed**, **failed** or **not yet verified** and separates local from deployed evidence. A local pass never changes a deployed row to completed.

The deployment checklist covers desktop/mobile layouts, keyboard navigation and zoom, pasted links/messages, `.eml` analysis, country clarification, missing/stale/unavailable external sources, email privacy, blocked remote email images, non-clickable suspicious destinations, report export/redaction and incomplete results. Run it with fictional fixtures only. Do not visit live malicious destinations.

To check privacy, open the browser's Network panel, clear its request list, and analyse the fictional email. Investigate any request containing message text, addresses, a file body or its extracted URL. A source-status request contains no submitted data. Confirm that remote-image references in a fictional email do not create requests. Save evidence without capturing private material.

**Checkpoint:** mark the website ready for a demonstration only after the required deployed checks pass; retain explicit limitations for unsupported inputs and external intelligence.

## 8. Ongoing operation, recovery and costs

### Update and review

Make changes on a new branch, run the local checks from step 1, commit and push. Open a GitHub pull request, read its Actions result, and inspect its Cloudflare preview using the fictional walkthrough. Merge into the actual production branch only after review. CI and Pages are separate systems: verify both the check result and the deployment's commit. A direct production push can start deployment before CI finishes; the owner should use reviewed branches and any available repository branch protections.

### Restore a working deployment

Open the Pages project's **Deployments → All deployments**. On a known successful **production** deployment, open its three-dot menu and choose **Rollback to this deployment**, review and confirm. Preview deployments are not rollback targets. Then fix or revert the bad source change in Git before the next push, which could otherwise redeploy it. Verify the homepage and status endpoint again. [Official rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/) (reviewed 2026-09-26).

### Review usage and stop integration activity

In **Workers & Pages → your Pages project → Functions Metrics**, inspect requests, errors and invocation status. Count usage across the account's Workers and Functions, not just this site. [Functions metrics](https://developers.cloudflare.com/pages/functions/metrics/) (reviewed 2026-09-26).

To pause deployments, open **Settings → Builds & deployments → Configure Production deployments**, disable automatic production deployments and save; set preview branch deployments to **None**. Existing deployments remain served. To revoke repository access, use GitHub **profile Settings → Applications → Installed GitHub Apps → Cloudflare → Configure** and remove that repository, suspend or uninstall as appropriate. Uninstalling may affect other connected projects. [Branch controls](https://developers.cloudflare.com/pages/configuration/branch-build-controls/), [GitHub app access management](https://docs.github.com/en/apps/using-github-apps/reviewing-and-modifying-installed-github-apps) (reviewed 2026-09-26).

To remove the website, first keep a local source backup, then open the Pages project's **Settings → Delete project** and read its confirmation. This removes the hosted project; revoking Git access alone does not take a website offline. No custom domain exists in this workflow. [Pages project deletion](https://developers.cloudflare.com/pages/get-started/git-integration/#delete-a-project) (reviewed 2026-09-26).

There are no external lookups to disable in this version. If Function quota is exhausted, local frontend analysis must remain usable and source status must show unavailable. If needed, a maintainer can remove the optional source-status fetch and Function route in a reviewed change, rebuild and deploy; deleting hosting is unnecessary. Any future feed integration must introduce a documented off switch and preserve this local fallback.

### Keep the content and dependencies current

Review the three support-directory entries in `src/directory.ts` against their official sources before university demonstrations and on a regular maintenance schedule. The initial review of Scamwatch, ReportCyber and IDCARE was completed on **27 September 2026**. Update each `reviewed` value only after checking, and keep the displayed date in `src/main.ts` synchronized. See [PRIVACY_AND_LIMITATIONS.md](PRIVACY_AND_LIMITATIONS.md#maintaining-the-organization-directory) for sources and the maintenance procedure. These support links do not verify messages or submitted domains. Do not add personal contacts or crowd-sourced accusations.

For dependencies, use `pnpm outdated`, review release/security notes, then update deliberately with `pnpm update` or `pnpm add PACKAGE@VERSION`. Commit the resulting manifest and lockfile together, rerun tests/lint/typecheck/build and both previews, and update pins in CI, this guide and Cloudflare when runtime/tool versions change. Re-review provider terms before ever enabling a feed. Do not put live provider data in test fixtures.

### Itemized cost and limits

The following **USD 0/month is a free-tier assumption**, not a guarantee of perpetual free service or a universal account spending cap. No paid services, upgrades, domains or billing details were enabled for this delivery.

| Item | Expected cost for this version | Relevant free limit / boundary | Official source; reviewed |
|---|---|---|---|
| Node.js, pnpm and local development | $0 service fees | Uses your own computer/network; package downloads require internet | [Node downloads](https://nodejs.org/en/download), [pnpm install](https://pnpm.io/installation); 2026-09-26 |
| GitHub Free source and standard CI | $0 within allowance | Private repos: 2,000 Actions minutes/month, 500 MB artifact storage; 10 GB cache per repository. Public standard hosted runners are free | [Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions); 2026-09-26 |
| GitHub repository storage | $0 for ordinary source | Git blocks individual files above 100 MiB; keep generated dependencies and disposable renders out of Git | [File limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github); 2026-09-26 |
| Pages Free hosting / `pages.dev` address | $0 | 500 builds/month, 1 concurrent build, 20-minute build timeout, 20,000 files/site, 25 MiB/file | [Pages limits](https://developers.cloudflare.com/pages/platform/limits/); 2026-09-26 |
| Pages static requests | $0 | Static requests not invoking Functions are free and unlimited under documented pricing | [Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/); 2026-09-26 |
| Pages Functions / Workers Free | $0 within allowance | 100,000 requests/day shared with Workers, resetting at midnight UTC; errors/unavailability possible at limits | [Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/); 2026-09-26 |
| Functions runtime resources | Included in the Free allowance | 10 ms CPU/request and 128 MB memory/isolate; the status route only returns small metadata, while content analysis runs in the browser | [Workers runtime limits](https://developers.cloudflare.com/workers/platform/limits/); 2026-09-27 |
| OpenPhish | $0 because disabled | No licensed integration or refresh allowance assumed | [Feed options](https://openphish.com/phishing_feeds.html); 2026-09-26 |
| Supabase | $0 because not used | No project or database quota applies | Implementation decision, 2026-09-26 |
| Domain, paid analytics, paid AI, storage add-ons | $0 because not purchased/enabled | Not required by this implementation | Project configuration, 2026-09-26 |

**Spending controls:** remain on Free and do not enable paid upgrades automatically. GitHub documents that accounts without a valid payment method are blocked when their allowance is exhausted. If a payment method already exists, the owner must inspect the actual account's budgets and enforcement settings; we have not configured them. **Budget alerts are notifications, not necessarily hard limits.** An account may contain unrelated paid services, so this project's estimate cannot cap the entire account bill. [GitHub billing behaviour](https://docs.github.com/en/billing/concepts/product-billing/github-actions), [Cloudflare plans](https://www.cloudflare.com/plans/) (reviewed 2026-09-26).

## Ordered owner handoff

<div style="padding:1rem;border:1px solid #26776d;border-radius:8px"><strong>Prepared is not deployed.</strong> The application, project configuration, fictional examples, documentation and pitch materials are local deliverables. Refer to the verification record for actual executed results. GitHub remote CI and Cloudflare production are pending owner account actions.</div>

1. **Review the local delivery and verification record.** Open the app at the address printed by its server, rehearse the fictional demo, read limitations, and review the generated pitch. Success: you can explain both results and unperformed checks.
2. **Choose the GitHub owner, repository name and visibility; sign in.** Your identity and permissions are necessary to create or select the remote. Source, lockfile, CI and ignore rules are prepared. Success: the reviewed project is pushed to the actual branch and Actions is green.
3. **Sign in to Cloudflare and authorise that repository.** Only you can grant account/repository access. Pages configuration and exact build settings are prepared. Success: deployment completes and Cloudflare supplies a real `pages.dev` URL.
4. **Set the three public build variables in Production and Preview.** There are no application secrets to obtain. Success: logs show pinned versions and a frozen pnpm install, and Functions deploy alongside the frontend.
5. **Run the deployed checklist in [VERIFICATION.md](VERIFICATION.md).** Owner access to the real deployment is necessary because none exists in this delivery. Success: required rows are completed with evidence; unresolved rows remain explicit.
6. **Review account usage controls and repository permissions.** Choose any account-specific budget enforcement yourself; do not enable paid services. Success: Free plans are confirmed, scope is limited, and you know where to pause deployments or revoke access.
7. **Present the verified prototype with its current limits.** Leave OpenPhish disabled unless future written permission and implementation/testing justify changing it. No Supabase action is needed.

<!-- Maintenance: update scripts, pins, runtime inventory, endpoints, feature claims and linked verification evidence together whenever implementation changes. -->
