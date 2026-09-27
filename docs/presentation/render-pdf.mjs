import { chromium } from '@playwright/test';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';

const directory = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch({
  headless: true,
  ...(process.platform === 'win32' ? { channel: 'msedge' } : {}),
});

try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(resolve(directory, 'checkfirst-pitch.html')).href);
  await page.emulateMedia({ media: 'print' });
  const slideCount = await page.locator('section.slide').count();
  if (slideCount !== 11) throw new Error(`Expected 11 slides; found ${slideCount}`);
  await page.pdf({
    path: resolve(directory, 'checkfirst-pitch.pdf'),
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
  });
  console.log(`Rendered ${slideCount} slides to docs/presentation/checkfirst-pitch.pdf`);
} finally {
  await browser.close();
}
