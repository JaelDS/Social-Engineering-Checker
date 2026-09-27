---
title: CheckFirst — User guide
aliases: [Using CheckFirst, Demo walkthrough]
tags: [checkfirst, help, demonstration]
reviewed: 2026-09-27
status: Prototype guide
---

# Use CheckFirst before you act

<div style="padding:1rem;border-left:5px solid #26776d;background:#edf7f4;color:#173c36"><strong>Pause. Look at the evidence. Verify independently.</strong><br>CheckFirst notices patterns that deserve attention. It cannot tell you with certainty who sent a message or whether a destination is safe.</div>

Start the app using [SETUP.md](SETUP.md). No account or database is needed to use local analysis. Use the fictional examples below when learning or demonstrating the app. Do not open a suspicious destination just to test it.

## Understand the result

| Result element | What it means |
|---|---|
| **Pause and verify before acting** | At least one implemented attention pattern was found; it is a reason to investigate, not proof of fraud |
| **No obvious patterns found — still unverified** | These limited checks found no attention pattern; this is not a safety verdict |
| Observation | A specific feature of the submitted content, an explanation and a suggested next step |
| Destination domain | A locally parsed domain, shown so you can distinguish the controlling address from familiar-looking text |
| What was not checked | Checks the app cannot perform or did not perform for this input |
| Live-source status | Whether the optional source-status endpoint responded; there is no live phishing feed connected in this version |

There is no calibrated probability, identity certificate or complete threat scan. Legitimate messages can contain urgency or payment requests. A carefully written harmful message can avoid every implemented pattern. Read the reasons and limitations together.

## Analyse a message

Select **Message**, paste text, then choose **Check for warning signs**. You can describe a conversation or text message without including real names or account details. The local rules look for urgency, credentials or sign-in codes, payment language, remote-device access and secrecy requests. They also inspect recognisable web addresses in the text. The buttons **A delivery text**, **An account alert** and **A support call** fill fictional examples; you still choose when to run the check.

Try this fictional message:

```text
Fictional training example:
Urgent: your parcel is suspended. Pay a delivery fee within 2 hours at
https://delivery.example/verify?reference=fictional
Send your verification code to complete the delivery.
```

Expected observations include time pressure, payment and sensitive-information language. The `.example` address is a fictional test destination. Its presence in a fixture is not evidence from a real threat-intelligence source.

Now try an ordinary fictional message:

```text
Our study group meets in the library on Thursday. Please bring your notes.
```

The result should remain unverified even if no attention pattern is found. The language rules are simple English patterns; language coverage is limited.

## Inspect a link without opening it

Select **Link**, paste the full address and choose **Check for warning signs**. CheckFirst parses its structure locally. It does not load the destination, follow redirects, expand shortened links or download files.

```text
https://familiar.example@unrelated.example/verify?reference=fictional
```

The destination here is `unrelated.example`; the text before `@` is not the destination. Expect an explanation of that structure. Other implemented checks include HTTP, encoded international-domain characters, numeric IP destinations, known shortening services, unusually complicated hostnames, selected executable-looking extensions and extra URL data.

These are contextual signals. HTTPS does not prove legitimacy; international domain names and query parameters can be entirely legitimate. Submitted destinations are presented as text, not invitation links. Use a known app, saved contact or independently established official website if you need to contact an organization.

## Read an email file locally

An `.eml` file is an email saved with its message headers and body. Use your mail application's export/save-original feature for a file you are entitled to inspect. Start with the supplied fixture:

**[public/fixtures/fictional-delivery.eml](../public/fixtures/fictional-delivery.eml)**

Select **Email file**, choose **Download a fictional test email** if you need a copy, then use **Choose an email file** to select it and **Check for warning signs**. The browser reads it locally. The parser extracts readable content and compares the visible From and first Reply-To addresses. For this fixture, expect an address mismatch plus the urgency, payment and code-request observations.

> [!important] What the email analysis cannot establish
> Sender and authentication headers are claims in a file. CheckFirst does not independently verify SPF, DKIM or DMARC. Attachments are counted but never opened or scanned. HTML is reduced to text without rendering; some content or obfuscated destinations may be missed. Encrypted or unsupported content is rejected or labelled incomplete.

The file limit is **2 MiB (2,097,152 bytes)**; the interface may describe this as 2 MB. Empty files are rejected. MIME nesting is limited to 20 levels. `.msg`, mailbox archives, attachments and call recordings are not supported email inputs. The downstream text analysis checks at most 50,000 characters and 100 distinct extracted links; truncation is a limitation, not a completed full-file scan.

Remote email images are not rendered, and the original email is not inserted into the page as HTML. A local parser can still fail on unusual or damaged MIME structures. If parsing fails, keep the result marked incomplete; do not interpret the failure as no threat found.

## Check a phone interaction

Select **Phone**. Enter the number in **The phone number shown** and describe the caller's request in the separate optional text box. Select **Country of the number** when using a national format, or enter an international number beginning with `+`.

```text
Number: 020 7946 0000
Description: Fictional caller asks for a verification code and wants me to install remote access software.
```

First leave the country unset: the app should ask for clarification instead of guessing. Then choose the United Kingdom to examine the format and the request description. Do not call this demonstration number.

A plausible format does not establish the caller's owner, physical location or reputation. Caller ID can be spoofed. CheckFirst does not listen to call audio. The useful observation may be what the caller is asking you to do, even when the number looks ordinary.

## Inspect a QR destination

Select **QR code**, use **Choose a QR image** to select a clear image, then choose **Check for warning signs**. PNG, JPEG and WebP files up to **5 MiB** and **16 megapixels** are accepted. Decoding is local and must not open the destination. Expand **View decoded QR text (never opened)** and read the resulting observations. If you already have decoded text instead of an image, paste it in **Link** or **Message**, as appropriate.

A QR code may contain a web address, arbitrary text or an unsupported action such as a special payment or app scheme. Decoding alone establishes no legitimacy. An image may contain more than one code, and a small or blurred code may not decode. When no readable code is found, the check remains incomplete; use a clearer fictional test image rather than opening a live destination.

QR image format, size and browser limits are listed in [PRIVACY_AND_LIMITATIONS.md](PRIVACY_AND_LIMITATIONS.md). A screenshot should not include unrelated private information. The prototype does not require camera access.

## Export a report

After an analysis, select **Export redacted report**. The report is generated in the browser and downloaded to your device as `checkfirst-redacted-report.md`. Open it in a text editor or Obsidian before sharing it.

The default redacted report omits the raw submission, email metadata, phone number and destination domains. It retains the input type, check timestamp, generic findings, next steps and limitations. Selecting **Include destination domains and phone number in export** changes the button to **Export report with details** and the filename to `checkfirst-with-details-report.md`. Those details may identify people or organizations. Domains are defanged using `[.]` in that export so they do not become ordinary clickable URLs.

Redaction is intentionally conservative, but you should still read a report before sharing it. Choose **Clear this check** to clear the input and result. CheckFirst does not erase your original file or downloaded reports. Clearing a result does not delete a report from your Downloads folder.

## Check service availability

Under **Your privacy**, select **Check service availability**. This sends only a same-origin `GET /api/status` request, with no submission. Wrangler/Pages should report that the endpoint is available while live phishing reports remain disabled. Ordinary Vite preview does not serve Functions and should report the endpoint unavailable. A five-second timeout is handled as unavailable. Neither result changes the local observations or verifies a destination.

## Find independently reviewed help

Near **Already clicked or shared something?**, expand **Reviewed support directory · Australia** for Scamwatch, ReportCyber and IDCARE. These official website links were reviewed on **27 September 2026**; they do not verify a sender or submitted address. Clicking one deliberately opens an external service in another tab. CheckFirst does not send your analysed content or file a report for you. The provider's own privacy rules apply to any information you enter there. Sources and maintenance details appear in [the directory record](PRIVACY_AND_LIMITATIONS.md#maintaining-the-organization-directory).

## A short university demonstration

| Order | Demonstrate | Explain to the audience |
|---|---|---|
| 1 | Analyse the fictional parcel message | Observations lead to practical next actions |
| 2 | Inspect the `@` address example | The familiar-looking text is not the destination |
| 3 | Select the fictional `.eml` fixture | Email content stays in the browser; headers are not proof |
| 4 | Use a national phone number without a country | The tool asks for context instead of inventing it |
| 5 | Show external-source status and missing checks | No live feed is connected; no finding means neither verified nor safe |
| 6 | Export the default report | Sharing is deliberate and excludes raw content by default |

Use the supplied presentation as the narrative around this demonstration. Do not claim completed deployment, a user study, live intelligence, detection accuracy or prevented losses without evidence. The delivery's actual checks are recorded in [VERIFICATION.md](VERIFICATION.md).

## When something goes wrong

| What you see | What to do |
|---|---|
| A field is empty | Add fictional text or select the correct file before analysing |
| File too large / unreadable | Use the supported fixture first; do not rename an unsupported format to bypass validation |
| Country requested | Select the correct country or use `+` international notation |
| Source unavailable | Continue local checks; use Wrangler preview to test the included endpoint, as described in the setup guide |
| No concerning patterns | Read the remaining limitations; independently verify before acting |
| Different results after editing | Analyse the revised input again; an old result cannot verify new content |

For keyboard use, press <kbd>Tab</kbd> to move through controls, <kbd>Shift</kbd> + <kbd>Tab</kbd> to move back, and <kbd>Enter</kbd> or <kbd>Space</kbd> to activate the focused control as appropriate. Within the content-type tabs, use Left/Right arrows to change mode, or Home/End for the first/last tab. Changing mode clears the previous input and result. Browser zoom should preserve readable content; supported-device and accessibility evidence belongs in the verification record.
