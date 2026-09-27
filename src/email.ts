import PostalMime from 'postal-mime';
import type { Finding } from './analyze';
export const MAX_EMAIL_BYTES = 2 * 1024 * 1024;
export type ParsedEmail = { text: string; extra: Finding[]; sender: string; subject: string; attachments: number; limited: boolean };

/** HTML is treated strictly as a string: no DOMParser, document insertion or URL fetch. */
export function htmlAsText(html: string): string {
  const destinations = [...html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']{1,2000})["']/gi)].map(m => m[1]);
  const pieces: string[] = [];
  let cursor = 0;
  let suppressed = '';
  for (const match of html.matchAll(/<[^<>]*>/g)) {
    if (!suppressed) pieces.push(html.slice(cursor, match.index));
    const tag = /^<\s*(\/?)\s*(script|style)\b/i.exec(match[0]);
    if (tag && !tag[1]) suppressed = tag[2].toLowerCase();
    else if (tag && tag[1] && tag[2].toLowerCase() === suppressed) suppressed = '';
    pieces.push(' ');
    cursor = match.index + match[0].length;
  }
  if (!suppressed) pieces.push(html.slice(cursor));
  return pieces.join('').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>') + '\n' + destinations.join('\n');
}

export async function parseEmail(raw: ArrayBuffer): Promise<ParsedEmail> {
  if (raw.byteLength > MAX_EMAIL_BYTES) throw new Error('Choose an .eml file smaller than 2 MB. Nothing was uploaded.');
  if (raw.byteLength === 0) throw new Error('This email file is empty.');
  const email = await PostalMime.parse(raw, { maxNestingDepth: 20 });
  if (!email.from && !email.subject && !email.text && !email.html) throw new Error('No readable email content was found. Encrypted or unsupported email cannot be checked.');
  const extra: Finding[] = [];
  const from = email.from?.address ?? '';
  const reply = email.replyTo?.[0]?.address;
  if (from && reply && from.toLowerCase() !== reply.toLowerCase()) extra.push({ title: 'Replies go to a different address', explanation: 'The From and Reply-To addresses differ. This can be legitimate, but it deserves a separate check.', action: 'Verify the sender through an independent contact route.', level: 'attention' });
  if (email.attachments.length) extra.push({ title: 'Attachments were not inspected', explanation: `${email.attachments.length} attachment(s) were present. They were not opened or scanned.`, action: 'Do not open unexpected attachments. Ask the sender through a known contact route.', level: 'context' });
  const encrypted = /multipart\/encrypted|application\/(?:pkcs7-mime|x-pkcs7-mime)/i.test(email.headers.map(h => `${h.key}: ${h.value}`).join('\n'));
  const limited = Boolean(email.html) || encrypted || (!email.text && !email.html);
  if (limited) extra.push({ title: 'Email analysis is incomplete', explanation: encrypted ? 'This email appears to be encrypted. Its contents cannot be analysed here.' : 'HTML is reduced to text without rendering. Some formatting, obfuscated links or unsupported content may not be understood.', action: 'Use the original email only in a trusted mail app; avoid its links and attachments.', level: 'context' });
  extra.push({ title: 'Email headers are claims, not proof', explanation: 'Sender details and authentication headers can be forged. CheckFirst does not independently verify SPF, DKIM or DMARC.', action: 'Contact the purported sender using a route you already trust.', level: 'context' });
  return { text: `${email.subject ?? ''}\n${email.text ?? ''}\n${email.html ? htmlAsText(email.html) : ''}`, extra, sender: from || 'Not available', subject: email.subject || 'No subject', attachments: email.attachments.length, limited };
}
