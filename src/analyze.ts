import { getDomain } from 'tldts';
import { parsePhoneNumberFromString, type CountryCode } from 'libphonenumber-js';

export type Mode = 'message' | 'link' | 'email' | 'phone' | 'qr';
export type Finding = { title: string; explanation: string; action: string; level: 'attention' | 'context' };
export type Analysis = { mode: Mode; checkedAt: string; findings: Finding[]; limitations: string[]; domains: string[]; summary: string; phone?: string };
export const MAX_TEXT = 50_000;

export function extractUrls(text: string): string[] {
  const urls = text.match(/\b(?:https?:\/\/|www\.)[^\s<>"']+/gi) ?? [];
  return [...new Set(urls.map(url => url.replace(/[.,;!?\])}]+$/, '')))].slice(0, 100);
}

export function analyze(input: string, mode: Mode, country?: CountryCode, extra: Finding[] = []): Analysis {
  const text = input.slice(0, MAX_TEXT);
  const findings: Finding[] = [...extra];
  const add = (title: string, explanation: string, action: string, level: Finding['level'] = 'attention') => {
    if (!findings.some(f => f.title === title)) findings.push({ title, explanation, action, level });
  };
  const limitations = ['Local patterns cannot establish who sent this or whether it is genuine.', 'Live phishing reports, destination contents, redirects and domain age were not checked.'];
  if (input.length > MAX_TEXT) limitations.push('Only the first 50,000 characters were checked.');
  if (/\b(urgent|immediately|act now|within \d+ hours?|suspend(?:ed)?|final warning|last chance)\b/i.test(text)) add('Pressure to act quickly', 'Deadlines and threats can make it harder to pause and check. Legitimate messages can also use urgent language.', 'Take your time. Contact the organisation through a route you already know.');
  if (/\b(password|passcode|one.?time (?:code|password)|verification code|security code|otp|seed phrase|recovery phrase)\b/i.test(text)) add('Sensitive information is mentioned', 'Codes and credentials can give someone access to your accounts. This pattern does not establish whether the request is legitimate.', 'Never share a password, recovery phrase or sign-in code with a caller or message sender.');
  if (/\b(gift cards?|wire transfer|cryptocurrency|bitcoin|pay(?:ment)?|bank account|refund|fee|invoice)\b/i.test(text)) add('Money or payment is involved', 'Payment requests deserve a separate check, especially if details have changed.', 'Verify the request using a known number, independently of this message.');
  if (/\b(anydesk|teamviewer|remote access|screen.?shar(?:e|ing)|install (?:this |an? )?(?:app|software))\b/i.test(text)) add('A request for device access', 'Remote-control tools can let another person operate your device.', 'Do not install tools or share your screen at the request of an unexpected caller.');
  if (/\b(keep (?:this )?(?:secret|confidential)|do not tell|don't tell|secret between)\b/i.test(text)) add('A request for secrecy', 'Isolation can prevent you from getting a second opinion.', 'Speak with someone you trust before taking action.');
  const urls = extractUrls(text);
  if (mode === 'link' && urls.length === 0 && text.trim()) urls.push(text.trim());
  if (urls.length === 100) limitations.push('Link analysis is limited to the first 100 distinct links.');
  const domains: string[] = [];
  for (const raw of urls) {
    try {
      const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(raw) ? raw : `https://${raw}`);
      if (!['https:', 'http:'].includes(url.protocol)) { add('Unsupported link type', 'This is not an ordinary web link; its destination was not analysed.', 'Do not open it automatically. Verify what the sender is asking you to do.'); continue; }
      if (!url.hostname.includes('.') && !url.hostname.startsWith('[') && url.hostname !== 'localhost') { add('The address is incomplete', 'A recognisable public website address could not be identified.', 'Check the full address without opening it.'); continue; }
      const domain = getDomain(url.hostname, { allowPrivateDomains: true }) ?? url.hostname;
      if (!domains.includes(domain)) domains.push(domain);
      if (url.protocol === 'http:') add('This address does not use HTTPS', 'The address begins with HTTP. HTTPS protects a connection, but neither HTTP nor HTTPS establishes trust.', 'Use an independently verified official website.');
      if (url.username || url.password) add('An address can hide its real destination', 'Text before an @ sign in a web address is not the destination. It can impersonate a familiar name.', 'Read the destination domain shown below, then verify it independently.');
      if (url.hostname.includes('xn--')) add('International characters in the domain', 'The encoded domain uses international characters, which can sometimes resemble another name. Many such domains are legitimate.', 'Compare the full domain carefully with a known official source.');
      if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(url.hostname) || url.hostname.startsWith('[')) add('The destination is a numeric address', 'A raw IP address provides less recognisable information about the organisation.', 'Ask for a verifiable official website.');
      if (['bit.ly', 'tinyurl.com', 't.co', 'is.gd', 'ow.ly', 'shorturl.at'].includes(domain)) add('A shortened link hides the destination', 'The final address is not visible. CheckFirst does not follow or expand links.', 'Ask for the full official address or open the known app yourself.');
      if (url.hostname.split('.').length > 4) add('A complicated destination name', 'Many address segments can make the controlling domain hard to spot. This alone is not proof of deception.', 'Focus on the destination domain rather than familiar words earlier in the address.');
      if (/\.(exe|msi|scr|bat|cmd|js|vbs|apk|iso)$/i.test(url.pathname)) add('A link appears to download software', 'The path looks like an executable or installation file. Its contents have not been inspected.', 'Do not run unexpected downloads. Use the official software distributor.');
      if (url.search || url.hash) add('The link contains extra data', 'Address parameters can carry tracking information, account identifiers or access tokens. Their meaning was not checked.', 'Avoid sharing the full address publicly.', 'context');
    } catch { add('The address could not be understood', 'A complete web destination could not be parsed. No destination was contacted.', 'Check that you pasted the full address, without opening it.'); }
  }
  let phone: string | undefined;
  if (mode === 'phone') {
    const rawNumber = text.split('\n')[0].trim();
    if (!rawNumber.startsWith('+') && !country) {
      add('Which country is this number from?', 'National phone numbers are ambiguous without a country. No country has been guessed.', 'Select the country the number belongs to, or enter the international number starting with +.', 'context');
    } else {
      const number = parsePhoneNumberFromString(rawNumber, country);
      if (!number || !number.isPossible()) add('The number format is incomplete or unusual', 'The number does not fit an expected length for the selected country. Formatting cannot identify a caller.', 'Confirm the country and digits. Do not call back an unknown number.');
      else { phone = `${number.formatInternational()} · ${number.country ?? 'international/shared calling code'}`; add('A plausible number does not identify the caller', 'Caller ID can be spoofed. Number format and country do not show ownership, location or trustworthiness.', 'Hang up and contact the organisation using a number from its official website or your account documents.', 'context'); }
    }
    limitations.push('Caller identity, ownership, reputation and physical location were not checked. Call audio is not analysed.');
  }
  if (mode === 'qr') limitations.push('Only the decoded QR text was analysed. A QR image can hide other content; multiple codes may not all be read.');
  const warningCount = findings.filter(f => f.level === 'attention').length;
  return { mode, checkedAt: new Date().toISOString(), findings, limitations, domains, phone, summary: warningCount ? 'Pause and verify before acting' : 'No obvious patterns found — still unverified' };
}

export function createReport(result: Analysis, includeDetails = false): string {
  return [
    '# CheckFirst report', '', `Checked: ${result.checkedAt}`, `Input type: ${result.mode}`, '',
    `## ${result.summary}`, '', 'This is a limited local assessment, not a safety verdict.',
    '', '## Observations', ...result.findings.map(f => `- ${f.title}: ${f.explanation} Next step: ${f.action}`),
    '', '## Not checked', ...result.limitations.map(item => `- ${item}`),
    '- Live phishing feed: disabled; no source freshness or reputation result is available.',
    ...(includeDetails ? ['', '## Destination details (may identify people or organisations)', ...result.domains.map(d => `- ${d.replaceAll('.', '[.]')}`), ...(result.phone ? [`- ${result.phone}`] : [])] : ['', 'Redacted export: raw submissions, email metadata, phone numbers and destination domains are omitted.']),
    '', 'No absent finding should be interpreted as safe.',
  ].join('\n');
}
