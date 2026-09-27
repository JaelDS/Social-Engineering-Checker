---
title: CheckFirst — University project brief
tags: [checkfirst, university, product, evaluation]
reviewed: 2026-09-26
status: Working prototype; field evaluation pending
---

# A practical pause before a risky action

<div style="padding:1rem;border-left:5px solid #26776d;background:#edf7f4;color:#173c36"><strong>Project purpose</strong><br>Give nontechnical people a clear explanation of warning signs in a message, email, link, phone interaction or QR destination, together with a sensible next action and an honest account of what was not checked.</div>

This university work-experience project combines a functioning web prototype, reproducible deployment instructions and presentation materials. It is designed for a demonstration and a supervised evaluation. It does not establish real-world detection accuracy, commercial readiness or an institutional endorsement.

## Who it is for

The intended user is someone who receives an unexpected request and is unsure what to do. They may recognise that something feels wrong without knowing what a domain, MIME attachment or authentication header means. The interface should answer three questions: **What was noticed? Why does it matter? What can I do next?**

An organization reviewing the prototype can evaluate whether its explanations help people pause and independently verify a request. A successful pitch invites a bounded usability pilot; it does not promise to replace security staff, existing email protections or incident response.

## Design commitments

| Commitment | How to evaluate it |
|---|---|
| Start without accounts | A fresh checkout can install, build and analyse fictional samples without credentials |
| Explain observations | Findings show concrete reasons rather than an unexplained probability or safety badge |
| Preserve uncertainty | Incomplete parsing, missing sources and absent identity verification remain visible |
| Minimise disclosure | Analysis stays in the browser; the included server endpoint reports source status without receiving submissions |
| Do not activate suspicious material | Submitted links are shown as text; email HTML and remote images are not rendered |
| Make the project maintainable | Source, lockfile, automated checks, service setup, limitations and verification evidence ship together |

Implementation details and boundaries live in [USER_GUIDE.md](USER_GUIDE.md) and [PRIVACY_AND_LIMITATIONS.md](PRIVACY_AND_LIMITATIONS.md). Actual evidence belongs in [VERIFICATION.md](VERIFICATION.md).

## The three parallel workstreams

| Workstream | Deliverable | Review question |
|---|---|---|
| Application | Local analysis interface, parsers, controlled tests and Pages configuration | Does each displayed claim follow from an implemented check? |
| Documentation | Beginner setup guide, user instructions, privacy limits and verification record | Could a first-time owner reproduce the result and recognise missing steps? |
| Presentation | Rendered pitch material and demonstration narrative | Does the story explain user value while distinguishing implemented work from future work? |

Parallel work shares an implementation contract: one product name, real scripts and versions, no invented account connections, and no unsupported live-intelligence claims. Documentation and pitch wording must be revised when those contracts change.

## Demonstration method

Use fictional examples in a clean browser session. Show one concerning message, the explanation, a next action, an email-file example and an incomplete check. Demonstrate that the page still gives useful local observations with external sources unavailable. Finish by showing what a downloaded report contains and what it intentionally omits.

Do not ask an audience member to paste a real private message during a public presentation. Do not visit a live malicious site to make the demonstration more convincing. Do not count a preselected example as evidence of accuracy across all attacks.

<details>
<summary><strong>Suggested supervised pilot design — future work, not completed research</strong></summary>

Recruit participants through the university's applicable process and obtain any required approval before collecting observations. Use a small, explicitly labelled fictional scenario set. Include ordinary messages as well as concerning ones, because false alarms also matter.

Ask participants to interpret the result and describe their next step. Record task completion, misunderstandings, whether they recognise unavailable checks, and accessibility difficulties. Prefer de-identified observations; do not collect real email files or private contact information. Define consent, retention and withdrawal arrangements before collecting data.

Report the sample size, scenario selection, limitations and negative findings. Do not convert a convenience-sample usability exercise into an unsupported detection-accuracy claim.

</details>

## Acceptance and remaining work

The first milestone is a reproducible local prototype with a truthful demonstration and a prepared deployment path. Public deployment, real-device checks and a user study are separate milestones. Optional licensed threat intelligence is a later feature, dependent on permission and an implemented, tested server-side adapter.

See the **Ordered owner handoff** in [SETUP.md](SETUP.md#ordered-owner-handoff) for the one account-action checklist. Keep account identifiers, participant information and private deployment notes outside the public repository.
