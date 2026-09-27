import { describe, expect, it } from 'vitest';
import { htmlAsText, MAX_EMAIL_BYTES, parseEmail } from '../src/email';
import { readFile } from 'node:fs/promises';

const buffer = (text: string) => new TextEncoder().encode(text).buffer;
describe('inert email parsing', () => {
  it('reads the fictional fixture and identifies reply mismatch', async () => {
    const raw = await readFile('public/fixtures/fictional-delivery.eml');
    const parsed = await parseEmail(raw.buffer.slice(raw.byteOffset,raw.byteOffset+raw.byteLength));
    expect(parsed.text).toContain('verification code');
    expect(parsed.extra.some(f=>f.title==='Replies go to a different address')).toBe(true);
  });
  it('decodes base64 body without executing HTML', async () => {
    const parsed = await parseEmail(buffer('From: sender@example.com\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: base64\r\n\r\n'+btoa('<img src="https://images.example/tracker"><script>alert(1)</script><p>Urgent password request</p>')));
    expect(parsed.text).toContain('Urgent password request');
    expect(parsed.text).toContain('https://images.example/tracker');
    expect(parsed.text).not.toContain('alert(1)');
    expect(parsed.limited).toBe(true);
  });
  it('bounds large or empty email files', async () => {
    await expect(parseEmail(new ArrayBuffer(MAX_EMAIL_BYTES+1))).rejects.toThrow('2 MB');
    await expect(parseEmail(new ArrayBuffer(0))).rejects.toThrow('empty');
  });
  it('handles malformed markup with linear tag scanning', () => {
    const start = performance.now();
    expect(htmlAsText('<'.repeat(50000))).toHaveLength(50001);
    expect(performance.now()-start).toBeLessThan(1000);
    expect(htmlAsText('<script>secret<script>secret')).not.toContain('secret');
  });
  it('does not interpret a header as validated authentication', async () => {
    const parsed = await parseEmail(buffer('From: sender@example.com\r\nAuthentication-Results: forged; dkim=pass\r\n\r\nHello'));
    expect(parsed.extra.some(f=>f.explanation.includes('does not independently verify'))).toBe(true);
  });
});
