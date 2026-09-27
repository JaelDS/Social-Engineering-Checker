import { describe, expect, it } from 'vitest';
import { analyze, createReport, extractUrls } from '../src/analyze';

describe('honest local analysis', () => {
  it('never treats no findings as safe', () => {
    const result = analyze('See you at the library tomorrow.', 'message');
    expect(result.summary).toContain('still unverified');
    expect(result.limitations).toContain('Local patterns cannot establish who sent this or whether it is genuine.');
  });
  it('identifies credential pressure and payment without opening anything', () => {
    const result = analyze('Urgent: pay a fee and send your verification code at https://delivery.example', 'message');
    expect(result.findings.map(f=>f.title)).toEqual(expect.arrayContaining(['Pressure to act quickly','Sensitive information is mentioned','Money or payment is involved']));
    expect(result.domains).toEqual(['delivery.example']);
  });
  it('uses destination after userinfo and registrable domain', () => {
    const result = analyze('https://bank.example@unknown.example/account', 'link');
    expect(result.domains).toEqual(['unknown.example']);
    expect(result.findings.some(f=>f.title.includes('real destination'))).toBe(true);
  });
  it('detects international encoded, numeric and shortened domains', () => {
    for (const input of ['http://127.0.0.1/a', 'http://[::1]/a', 'https://xn--pple-43d.example', 'https://bit.ly/fictional']) {
      expect(analyze(input, 'link').findings.filter(f=>f.level==='attention').length).toBeGreaterThan(0);
    }
  });
  it('does not guess a phone country', () => {
    expect(analyze('02 5550 1234', 'phone').findings[0].title).toBe('Which country is this number from?');
    const result = analyze('02 5550 1234', 'phone', 'AU');
    expect(result.phone).toContain('+61');
    expect(result.findings[0].explanation).toContain('spoofed');
  });
  it('redacts submitted identifiers by construction', () => {
    const result = analyze('02 5550 1234\nUrgent: https://private.example/token?secret=SecretToken0123', 'phone', 'AU');
    const report = createReport(result);
    for (const secret of ['5550', 'private.example', 'private[.]example', 'SecretToken0123']) expect(report).not.toContain(secret);
    expect(createReport(result,true)).toContain('private[.]example');
    expect(createReport(result,true)).not.toContain('SecretToken0123');
  });
  it('limits long text and link enumeration explicitly', () => {
    expect(analyze('a'.repeat(50001),'message').limitations.join(' ')).toContain('50,000');
    expect(extractUrls(Array.from({length:120},(_,i)=>`https://${i}.example`).join(' '))).toHaveLength(100);
  });
  it('rejects unsupported URL schemes', () => {
    expect(analyze('javascript:alert(1)', 'link').findings[0].title).toBe('Unsupported link type');
  });
});
