export function onRequestGet(): Response {
  return Response.json({
    service: 'checkfirst',
    version: '0.1.0',
    onlineChecks: 'disabled',
    source: 'OpenPhish',
    lastUpdated: null,
    reason: 'No live feed is connected. Provider permission and a reviewed feed adapter are required. Local analysis remains available.',
    acceptsSubmissions: false,
  }, { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
}
