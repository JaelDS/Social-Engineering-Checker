import { expect, it } from 'vitest';
import { onRequestGet } from '../functions/api/status';
it('exposes disabled status without claiming a feed result or freshness', async () => {
  const response = onRequestGet();
  const body = await response.json();
  expect(response.headers.get('Cache-Control')).toBe('no-store');
  expect(body).toMatchObject({onlineChecks:'disabled',lastUpdated:null,acceptsSubmissions:false});
});
