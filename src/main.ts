import './style.css';
import { getCountries, type CountryCode } from 'libphonenumber-js';
import { analyze, createReport, MAX_TEXT, type Analysis, type Finding, type Mode } from './analyze';
import { directory } from './directory';

const icon = (name: string) => ({ message: '▤', link: '↗', email: '✉', phone: '☎', qr: '▦' }[name] ?? '✓');
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
<a class="skip" href="#checker">Skip to the checker</a>
<header class="header"><a class="brand" href="#" aria-label="CheckFirst home"><span class="brand-mark">✓</span>checkfirst<span class="brand-dot">.</span></a><nav aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#privacy">Your privacy</a><a class="nav-cta" href="#checker">Check something <span aria-hidden="true">↗</span></a></nav></header>
<main>
<section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="small-dot"></span> A SECOND LOOK. A SAFER NEXT STEP.</p><h1>A little clarity<br>before you <em>click.</em></h1><p class="hero-description">An unexpected message. A suspicious link. A call that feels off. Understand the warning signs, without the technical jargon.</p><a class="primary hero-button" href="#checker">Let’s check it <span aria-hidden="true">↗</span></a><p class="quiet trust-line"><span aria-hidden="true">◈</span> Private by design. No account needed.</p></div><div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><span class="art-spark spark-one">✦</span><span class="art-spark spark-two">+</span><div class="message-card"><div class="mock-sender"><span class="mock-avatar">?</span><span>Unexpected message<small>Just now</small></span><span class="mock-dots">•••</span></div><div class="mock-line long"></div><div class="mock-line medium"></div><div class="mock-link">“Your account needs attention…”</div></div><div class="lens"><span>✓</span></div><div class="art-label"><span class="small-dot"></span> Pause. Understand. Decide.</div></div></section>
<section class="checker-section" id="checker" aria-labelledby="checker-title"><div class="section-heading"><div><p class="eyebrow">START WITH A SECOND LOOK</p><h2 id="checker-title">What would you like to check?</h2></div><span class="privacy-pill">◈ Stays on your device</span></div>
<div class="checker-grid"><div class="checker-card"><div class="mode-tabs" role="tablist" aria-label="Type of content">${(['message','link','email','phone','qr'] as Mode[]).map((mode,i) => `<button role="tab" id="tab-${mode}" aria-controls="input-panel" aria-selected="${i===0}" tabindex="${i===0?'0':'-1'}" data-mode="${mode}"><span aria-hidden="true">${icon(mode)}</span>${{message:'Message',link:'Link',email:'Email file',phone:'Phone',qr:'QR code'}[mode]}</button>`).join('')}</div><form id="check-form"><div id="input-panel" role="tabpanel" aria-labelledby="tab-message"></div><p id="input-error" class="error" role="alert"></p><div class="form-bottom"><span class="quiet">We never open submitted links.</span><button class="primary" type="submit" id="analyze-button">Check for warning signs <span aria-hidden="true">↗</span></button></div></form></div><aside class="companion-card"><div class="mini-shield" aria-hidden="true">✓</div><h3>You don’t need to<br>be a security expert.</h3><p>We’ll help you spot common tactics, explain what they mean, and suggest what to do next.</p><ul class="check-list"><li>Plain-language explanations</li><li>Practical next steps</li><li>Clear about what we can’t check</li></ul><div class="honesty-note">A check is guidance, not a guarantee. No tool can prove a message is safe.</div></aside></div>
<div class="example-row"><span>Just exploring? Try a fictional example:</span><button type="button" data-example="delivery">A delivery text <span aria-hidden="true">↗</span></button><button type="button" data-example="account">An account alert <span aria-hidden="true">↗</span></button><button type="button" data-example="call">A support call <span aria-hidden="true">↗</span></button></div>
<section id="results" class="results" hidden aria-labelledby="results-heading" tabindex="-1"></section>
</section>
<section class="how-section" id="how-it-works"><p class="eyebrow">A MOMENT OF PAUSE CAN MAKE A DIFFERENCE</p><h2>From “is this real?” to “here’s my next step.”</h2><div class="steps"><article><span class="step-number">01</span><h3>Share what feels off</h3><p>Paste a message or link, describe a call, or select an email or QR image from your device.</p></article><article><span class="step-number">02</span><h3>Understand the signals</h3><p>See common pressure tactics and address patterns, explained in everyday language.</p></article><article><span class="step-number">03</span><h3>Choose a safer next step</h3><p>Pause the conversation and verify through a contact route you already trust.</p></article></div></section>
<section class="privacy-section" id="privacy"><div><p class="eyebrow">YOUR INFORMATION IS YOURS</p><h2>Private checks.<br>Honest answers.</h2></div><div><p>Messages, email files, phone numbers and QR images are processed in this browser’s memory. They are not sent to a server or stored by CheckFirst. Refreshing or clearing the check removes them from the app.</p><p>Email HTML is never rendered, attachments are never opened, and remote email images are never loaded. A website host still receives ordinary page and service-status requests, including your IP address.</p><p><strong>Live phishing reports are disabled.</strong> These local checks cannot verify a sender, inspect a destination, or rule out a scam. Encrypted emails and uncommon formats may not be fully readable.</p><button type="button" class="text-button" id="check-service">Check service availability <span aria-hidden="true">↗</span></button><p id="service-status" class="quiet" role="status">No live feed is connected. Local checks are available.</p></div></section>
<section class="help-section"><h2>Already clicked or shared something?</h2><p>Stop the conversation. If you shared payment details, contact your bank using its official app or the number on your card. If you shared a password, change it through the official service and review your account activity.</p><p class="quiet">For local reporting and support, independently find your national consumer protection or cyber safety service. In immediate danger, contact your local emergency service.</p><details><summary>Reviewed support directory · Australia</summary><p class="quiet">These are independent help services, not identity verification or an endorsement of any submitted address. Reviewed 27 September 2026.</p><ul>${directory.map(entry=>`<li><a href="${entry.url}" rel="noreferrer noopener" target="_blank">${entry.name} ↗</a> — ${entry.purpose}</li>`).join('')}</ul></details></section>
</main><footer><a class="brand" href="#"><span class="brand-mark">✓</span>checkfirst<span class="brand-dot">.</span></a><p>A second look, for everyone.</p><span>University project · Local-first prototype</span></footer>`;

const panel = document.querySelector<HTMLElement>('#input-panel')!;
const results = document.querySelector<HTMLElement>('#results')!;
const error = document.querySelector<HTMLElement>('#input-error')!;
let mode: Mode = 'message';
let result: Analysis | undefined;
let revision = 0;
const countryNames = new Intl.DisplayNames(['en'], { type: 'region' });
const escape = (s: string) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
panel.addEventListener('input', () => { revision++; result = undefined; results.hidden = true; error.textContent = ''; });
panel.addEventListener('change', () => { revision++; result = undefined; results.hidden = true; error.textContent = ''; });

function setMode(next: Mode) {
  revision++;
  mode = next;
  result = undefined;
  results.hidden = true;
  error.textContent = '';
  document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button => { const selected = button.dataset.mode === mode; button.setAttribute('aria-selected', String(selected)); button.tabIndex = selected ? 0 : -1; });
  panel.setAttribute('aria-labelledby', `tab-${mode}`);
  if (mode === 'email') panel.innerHTML = `<label class="field-label" for="email-file">Choose an email file</label><p class="field-hint" id="upload-help">Select an .eml file, up to 2 MB. It stays in this browser. Attachments are not opened.</p><div class="upload-zone"><span class="upload-icon" aria-hidden="true">✉</span><input id="email-file" type="file" accept=".eml" aria-describedby="upload-help"><p>Export or save an email as .eml in your mail app.</p></div><a class="fixture-link" href="/fixtures/fictional-delivery.eml" download>Download a fictional test email ↓</a>`;
  else if (mode === 'qr') panel.innerHTML = `<label class="field-label" for="qr-file">Choose a QR image</label><p class="field-hint" id="upload-help">PNG, JPEG or WebP, up to 5 MB and 16 megapixels. Decoded text is never opened automatically.</p><div class="upload-zone"><span class="upload-icon" aria-hidden="true">▦</span><input id="qr-file" type="file" accept="image/png,image/jpeg,image/webp" aria-describedby="upload-help"><p>Use a clear image containing one QR code.</p></div>`;
  else if (mode === 'phone') panel.innerHTML = `<label class="field-label" for="phone-number">The phone number shown</label><input id="phone-number" type="tel" maxlength="60" placeholder="For example, +61 2 5550 1234" autocomplete="off"><label class="field-label compact" for="phone-country">Country of the number <span class="quiet">(needed without + country code)</span></label><select id="phone-country"><option value="">Select a country — we won’t guess</option>${getCountries().map(code => ({code,name:countryNames.of(code) ?? code})).sort((a,b)=>a.name.localeCompare(b.name)).map(c=>`<option value="${c.code}">${escape(c.name)} (${c.code})</option>`).join('')}</select><label class="field-label compact" for="check-input">What did the caller ask you to do? <span class="quiet">(optional)</span></label><textarea id="check-input" rows="3" maxlength="${MAX_TEXT}" placeholder="Describe the request without sharing passwords or account details."></textarea>`;
  else panel.innerHTML = `<label class="field-label" for="check-input">${mode === 'link' ? 'Paste the address you’re unsure about' : 'Paste the message you’re unsure about'}</label><p class="field-hint" id="text-help">${mode === 'link' ? 'Copy the link without opening it. The address is checked locally.' : 'A text message, email excerpt, social message — anything that feels off.'}</p><textarea id="check-input" rows="6" maxlength="${MAX_TEXT}" aria-describedby="text-help" placeholder="${mode === 'link' ? 'https://example.com/…' : 'Paste your message here…'}"></textarea><p class="input-note">Leave out passwords, codes and personal information. Up to 50,000 characters.</p>`;
}

document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach(button => {
  button.addEventListener('click', () => setMode(button.dataset.mode as Mode));
  button.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...document.querySelectorAll<HTMLButtonElement>('[data-mode]')];
    const index = tabs.indexOf(button);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    setMode(tabs[next].dataset.mode as Mode); tabs[next].focus();
  });
});

async function decodeQR(file: File): Promise<string> {
  if (!['image/png','image/jpeg','image/webp'].includes(file.type)) throw new Error('Choose a PNG, JPEG or WebP image.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Choose an image smaller than 5 MB.');
  const objectURL = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise<void>((resolve,reject) => { img.onload = () => resolve(); img.onerror = () => reject(new Error('This image could not be read.')); img.src = objectURL; });
    if (img.naturalWidth * img.naturalHeight > 16_000_000) throw new Error('Choose an image below 16 megapixels.');
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Image decoding is unavailable in this browser.');
    context.drawImage(img,0,0);
    const pixels = context.getImageData(0,0,canvas.width,canvas.height);
    const { default: jsQR } = await import('jsqr');
    const code = jsQR(pixels.data,pixels.width,pixels.height,{ inversionAttempts:'attemptBoth' });
    if (!code) throw new Error('No readable QR code was found. Try a clearer crop containing one code.');
    return code.data;
  } finally { URL.revokeObjectURL(objectURL); }
}

function renderResults(analysis: Analysis, metadata: string, decoded = '') {
  const attention = analysis.findings.filter(f => f.level === 'attention').length;
  results.innerHTML = `<div class="result-top"><div><p class="eyebrow">YOUR SECOND LOOK</p><h2 id="results-heading">${escape(analysis.summary)}</h2><p>${attention ? `${attention} warning pattern${attention === 1 ? '' : 's'} to consider.` : 'A lack of obvious patterns is not proof of safety.'} Local analysis only.</p></div><span class="result-badge">${attention ? 'Needs a closer look' : 'Still unverified'}</span></div>${metadata ? `<p class="metadata">${escape(metadata)}</p>` : ''}${decoded ? `<details><summary>View decoded QR text (never opened)</summary><pre class="untrusted-text">${escape(decoded)}</pre></details>` : ''}${analysis.phone ? `<p>Number format: <code>${escape(analysis.phone)}</code></p>` : ''}${analysis.domains.length ? `<div class="domain-box"><strong>Destination domains</strong><p>Compare these with an independently verified official address. A familiar name elsewhere in the link does not establish trust.</p>${analysis.domains.map(d => `<code>${escape(d.replaceAll('.', '[.]'))}</code>`).join(' ')}</div>` : ''}<div class="findings">${analysis.findings.map(f => `<article class="finding ${f.level}"><span class="finding-symbol" aria-hidden="true">${f.level==='attention'?'!':'i'}</span><div><h3>${escape(f.title)}</h3><p>${escape(f.explanation)}</p><p class="next-step"><strong>Next step:</strong> ${escape(f.action)}</p></div></article>`).join('') || '<p>Nothing obvious was detected by the limited local patterns. Verify unexpected requests independently.</p>'}</div><div class="limitations"><h3>What this check cannot tell you</h3><ul>${analysis.limitations.map(l=>`<li>${escape(l)}</li>`).join('')}<li>Phishing feed: <strong>disabled</strong>. No live match or freshness information is available.</li></ul></div><div class="report-controls"><label><input type="checkbox" id="include-details"> Include destination domains and phone number in export (may identify people)</label><p class="quiet">Default export omits raw content, email metadata, numbers and domains. Review any report before sharing.</p><div><button type="button" class="secondary" id="export-report">Export redacted report ↓</button><button type="button" class="text-button" id="clear-check">Clear this check</button></div></div>`;
  results.hidden = false;
  results.focus({ preventScroll: true });
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelector<HTMLInputElement>('#include-details')!.addEventListener('change', event => { document.querySelector('#export-report')!.textContent = (event.target as HTMLInputElement).checked ? 'Export report with details ↓' : 'Export redacted report ↓'; });
  document.querySelector('#export-report')!.addEventListener('click', () => {
    if (!result) return;
    const include = document.querySelector<HTMLInputElement>('#include-details')!.checked;
    const url = URL.createObjectURL(new Blob([createReport(result, include)], {type:'text/markdown;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url; a.download = `checkfirst-${include?'with-details':'redacted'}-report.md`; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  document.querySelector('#clear-check')!.addEventListener('click', () => { setMode(mode); document.querySelector<HTMLElement>('#input-panel input, #input-panel textarea')?.focus(); });
}

document.querySelector<HTMLFormElement>('#check-form')!.addEventListener('submit', async event => {
  event.preventDefault();
  const operation = ++revision;
  const checkingMode = mode;
  result = undefined; results.hidden = true;
  const button = document.querySelector<HTMLButtonElement>('#analyze-button')!;
  error.textContent = ''; button.disabled = true; button.textContent = 'Checking locally…';
  try {
    let input = ''; let extra: Finding[] = []; let metadata = ''; let decoded = '';
    let country: CountryCode | undefined;
    if (checkingMode === 'email') {
      const { MAX_EMAIL_BYTES, parseEmail } = await import('./email');
      const file = document.querySelector<HTMLInputElement>('#email-file')!.files?.[0];
      if (!file) throw new Error('Select an .eml file to check.');
      if (!file.name.toLowerCase().endsWith('.eml')) throw new Error('Choose a file with the .eml extension.');
      if (file.size > MAX_EMAIL_BYTES) throw new Error('Choose an .eml file smaller than 2 MB.');
      const parsed = await parseEmail(await file.arrayBuffer()); input = parsed.text; extra = parsed.extra;
      metadata = `Claimed sender: ${parsed.sender} · Subject: ${parsed.subject}. These details have not been verified.`;
    } else if (checkingMode === 'qr') {
      const file = document.querySelector<HTMLInputElement>('#qr-file')!.files?.[0];
      if (!file) throw new Error('Select a QR image to check.');
      input = decoded = await decodeQR(file);
      metadata = 'QR decoded locally. Its contents were not opened or sent anywhere.';
    } else {
      input = document.querySelector<HTMLTextAreaElement>('#check-input')!.value;
      if (checkingMode === 'phone') { const number = document.querySelector<HTMLInputElement>('#phone-number')!.value; if (!number.trim()) throw new Error('Enter the phone number shown.'); input = `${number}\n${input}`; country = document.querySelector<HTMLSelectElement>('#phone-country')!.value as CountryCode || undefined; }
    }
    if (!input.trim()) throw new Error('Add something to check first.');
    if (operation !== revision) return;
    result = analyze(input, checkingMode, country, extra);
    renderResults(result, metadata, decoded);
  } catch (err) { if (operation === revision) error.textContent = err instanceof Error ? err.message : 'This content could not be checked. Try another file or paste its readable text.'; }
  finally { button.disabled = false; button.innerHTML = 'Check for warning signs <span aria-hidden="true">↗</span>'; }
});

document.querySelectorAll<HTMLButtonElement>('[data-example]').forEach(button => button.addEventListener('click', () => {
  const example = button.dataset.example;
  setMode(example === 'call' ? 'phone' : 'message');
  const input = document.querySelector<HTMLTextAreaElement>('#check-input')!;
  input.value = example === 'delivery' ? 'FICTIONAL EXAMPLE: Urgent! Your parcel is suspended. Pay a delivery fee within 2 hours at https://delivery.example/verify. Send your verification code to release it.' : example === 'account' ? 'FICTIONAL EXAMPLE: Final warning. Your account will be suspended immediately. Confirm your password at https://account.example/verify.' : 'FICTIONAL EXAMPLE: A caller says they are support and asks me to install AnyDesk, share my screen and read out a one-time code.';
  if (example === 'call') document.querySelector<HTMLInputElement>('#phone-number')!.value = '02 5550 1234';
  input.focus();
}));

document.querySelector<HTMLButtonElement>('#check-service')!.addEventListener('click', async () => {
  const status = document.querySelector<HTMLElement>('#service-status')!;
  status.textContent = 'Checking the status endpoint; no submission is sent…';
  const controller = new AbortController(); const timeout = setTimeout(()=>controller.abort(),5000);
  try {
    const response = await fetch('/api/status', {signal:controller.signal,cache:'no-store'});
    if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) throw new Error('Unavailable');
    const data = await response.json();
    if (data.service !== 'checkfirst' || data.onlineChecks !== 'disabled') throw new Error('Unexpected status');
    status.textContent = 'Service endpoint available. Live phishing reports are disabled; no source freshness is available. Local checks remain available.';
  } catch { status.textContent = 'Service endpoint unavailable. Ordinary frontend preview does not run Functions. Live phishing reports remain disabled; local checks still work.'; }
  finally { clearTimeout(timeout); }
});
setMode('message');
