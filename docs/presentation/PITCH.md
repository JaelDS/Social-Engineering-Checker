---
title: CheckFirst — pitch and presenter notes
aliases: [CheckFirst pitch, CheckFirst presentation]
tags: [checkfirst, pitch, university, social-engineering]
updated: 2026-09-26
status: prototype-and-pilot-proposal
---

# CheckFirst: pitch and presenter notes

<div style="padding: 1.2rem; border-left: 5px solid #6f923f; background: #eef5e5; color: #102e35;">
<strong>Purpose:</strong> introduce CheckFirst to a prospective company or community partner and invite feedback through a supervised pilot.<br>
<strong>Audience:</strong> people who do not work in cybersecurity, educators, support teams and potential workplace supervisors.<br>
<strong>Suggested duration:</strong> 7–10 minutes, followed by questions. This is a suggested presentation format, not a completed event.
</div>

**Present with [the PDF deck](checkfirst-pitch.pdf)**, or use the [HTML presentation](checkfirst-pitch.html) for navigation and embedded speaker notes. Use the [setup guide](../SETUP.md) for the authoritative service and verification status.

## Ready for tomorrow

1. Open the HTML deck once while offline to confirm your browser can display it.
2. Rehearse slides 1–11 in 7–10 minutes. Keep the optional live demo under two minutes.
3. If time is cut to three minutes, present slides **1, 3, 4, 5 and 11**. This preserves the purpose, experience, example, limitations and invitation.
4. Use the same screen or projector when possible. Check full-screen mode and text size from the back of the room.
5. Keep the HTML and PDF on your own device. If the application or projector connection fails, the fictional example on slide 4 supports the talk without a live demonstration.

<details>
<summary><strong>Thirty-second opening</strong></summary>
“CheckFirst helps everyday users pause when a message, link or phone call feels suspicious. They can bring a concern, understand warning signs and see a sensible next step. The initial analysis runs locally, and its limits stay visible. This is a university project seeking a small supervised pilot to find out whether the explanations are clear and useful.”
</details>

> [!important] Positioning
> CheckFirst explains warning signs and offers next steps. It cannot certify safety, prove identity or replace an organisation's reporting and response process. Live phishing intelligence is disabled. The partner pilot and its benefits are proposals.

## 1. CheckFirst

**Say:** “CheckFirst is a university work-experience project for people who want help understanding a suspicious message, link or call. It gives them a place to pause, understand warning signs and decide how to verify a request.”

Introduce yourself and your actual university or placement only if you are authorised to represent it. The deck intentionally contains no invented names, affiliations or logos.

## 2. Pressure arrives in familiar places

**Say:** “Imagine a delivery text arriving while you are busy, or a caller who already knows your name. Familiar details and urgency can make a request feel convincing. The question for the user is simple: what should I check before I act?”

The situations are illustrative. The deck does not make claims about attack rates, market size or losses.

## 3. Understand the warning. Choose the next step.

**Say:** “A user brings the concern, reads an explanation, and verifies through an independent channel. The tool exposes its limits alongside the warning signs.”

The five modes cover links, messages, `.eml` email files, phone numbers and QR images. A QR image can be decoded locally without opening its destination. A country choice clarifies phone-number interpretation. Use the implemented examples to show these modes and acknowledge incomplete checks.

Emphasise that a visible warning is a reason to pause. It is not proof of malicious intent. Equally, the absence of a detected warning is not evidence that the communication is safe.

## 4. Fictional demonstration

<details>
<summary><strong>Suggested live demonstration</strong></summary>

1. Run the application using the setup guide and open the actual address printed by the development server.
2. Load the supplied fictional message or link sample.
3. Analyse it and read one actual explanation aloud.
4. Show the notice identifying what could not be checked.
5. Select the supplied fictional `.eml` fixture and show that its contents are treated as text.
6. Demonstrate report export and explain the need to review redaction.
7. Return to slide 5.

</details>

**Say:** “In this fictional delivery message, we can examine urgency, a request for details and an unfamiliar domain. The sensible next step is to contact the delivery company through a channel we already trust.”

The slide's address uses the reserved `.example` domain and is plain text. It is not a real destination or a detection test. Use the application sample for the live demo rather than promising that every phrase on the slide triggers a particular rule. Keep a static copy of the deck available if the live demo cannot run.

## 5. A useful explanation includes its limits

**Say:** “The tool cannot tell who is actually calling from a number. A country choice helps interpret the format. It cannot prove identity. No warning found is not the same as safe, and unavailable checks remain visible.”

OpenPhish is disabled. The [official terms](https://openphish.com/terms.html), reviewed on 26 September 2026, require permission for specified commercial uses, product development and third-party disclosure. Public access to a feed does not establish permission for this product's proposed use. See the setup guide for the maintained decision.

## 6. Analysis starts on the user's device

**Say:** “The initial checks run in the browser, without a database or an account. Email content is treated as text, and remote email images are not automatically loaded. A user can produce a redacted report and review it before sharing.”

Explain the boundary: the hosting provider receives normal web requests and connection metadata. Local analysis does not guarantee anonymity. Report redaction reduces disclosure but does not guarantee removal of all identifying information. Never demonstrate with a real email from a participant.

## 7. A small service footprint

**Say:** “The intended workflow uses GitHub for source and checks, and Cloudflare Pages for deployment. The local application works before either account is connected. A server route describes source availability. It does not provide a live phishing verdict.”

Repository connection and deployment are pending owner account actions unless the setup guide has since recorded success. Supabase is not required for this version. No account or database setup is necessary.

The free tier is an assumption subject to provider terms and limits, not a universal spending cap. Refer budget questions to the itemised costs and operations section in the setup guide.

## 8. A conversation starter for safer habits

**Say:** “For an employee, it could clarify a suspicious request. For an educator, it could explain a fictional scenario. For a support team, it could help someone describe why they are concerned. These are the uses we want to evaluate.”

Avoid claiming reduced fraud, saved time or improved behaviour without evidence. An organisation's existing reporting process should remain clear to participants.

## 9. Test comprehension before expansion

**Say:** “We propose a small supervised workshop using fictional material. We want to learn whether people can explain a warning sign, understand an incomplete result and choose an independent verification step.”

| Proposed measure | Example evidence | What it does not prove |
|---|---|---|
| Warning-sign comprehension | Participant explains one finding in their own words | Real-world fraud prevention |
| Understanding of uncertainty | Participant recognises that an incomplete result is not a safe verdict | Detection accuracy |
| Choice of next step | Participant chooses a known contact channel in a fictional scenario | Long-term behaviour change |
| Ease of use | Task completion and observed points of confusion | Accessibility for every user |

Agree participant information, consent, relevant university requirements and feedback retention before recruiting. Use voluntary participation and collect only what the evaluation needs. No raw email submissions are required. Define success criteria with the partner before the pilot rather than selecting favourable criteria afterward.

## 10. A project with reviewable deliverables

**Say:** “The project combines product development, user communication and service operation. A reviewer can inspect the application, the source, automated checks, setup instructions and verification checklist. The next stage is learning from users.”

Distinguish local test evidence from public deployment evidence. A successful build does not establish that a live website or an account integration works. A proposed pilot is not a completed study.

## 11. Help make the next step clearer

**Say:** “We are looking for a partner who can review the language, try fictional scenarios and provide structured feedback. The next meeting would agree an audience, a facilitator and what success should mean.”

For an end-user audience, invite feedback through a real channel selected by the owner. Do not invent a contact address, sign-up form or existing partnership.

## Questions you may receive

<details>
<summary><strong>Does this tell me a message is safe?</strong></summary>
No. It explains detectable warning signs and what remains unknown. A legitimate message can include warning signs, and a harmful message can avoid them. Verify important requests independently.
</details>

<details>
<summary><strong>Does it visit the suspicious website?</strong></summary>
The local checks inspect submitted text. They do not need to visit the destination. Do not open suspicious links during the demonstration.
</details>

<details>
<summary><strong>Is it an AI model or a live threat-intelligence service?</strong></summary>
This version uses local rules and explanations. It does not claim a remote AI verdict or an enabled live phishing feed. The setup guide records which services are implemented and what happens when a source is unavailable.
</details>

<details>
<summary><strong>Can our company roll this out now?</strong></summary>
The proposed next step is a supervised pilot and review. The owner must complete deployment and verification, and the organisation should evaluate fit with its privacy, accessibility and reporting requirements. No rollout commitment is implied by this deck.
</details>

<details>
<summary><strong>What happens to an uploaded email?</strong></summary>
The application analyses it locally and does not use an application database for submissions. Email content is handled as text. Discuss the actual privacy documentation, ordinary hosting metadata and report-redaction limitations rather than promising complete anonymity.
</details>
