import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('fictional delivery warning stays local and the default report omits submitted details', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => {
    if (!request.url().startsWith('http://127.0.0.1:4175/')) external.push(request.url());
  });
  await page.goto('/');
  await page.getByRole('tab', { name: 'Link' }).click();
  await page.locator('#check-input').fill('https://parcel-help.example/verify?customer=PRIVATE-TOKEN');
  await page.getByRole('button', { name: /Check for warning signs/ }).click();
  await expect(page.locator('#results')).toBeVisible();
  await expect(page.locator('#results')).toContainText('Live phishing');
  await expect(page.locator('#results')).toContainText('disabled');
  await expect(page.locator('#results a')).toHaveCount(0);
  await page.screenshot({ path: 'test-results/checkfirst-desktop.png', fullPage: true });
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Export redacted report/ }).click();
  const download = await downloadPromise;
  const report = await readFile(await download.path(), 'utf8');
  expect(report).not.toContain('parcel-help.example');
  expect(report).not.toContain('PRIVATE-TOKEN');
  expect(report).toContain('disabled');
  expect(external).toEqual([]);
});

test('HTML email is analysed as text without loading its remote image', async ({ page }) => {
  const external: string[] = [];
  page.on('request', request => {
    if (!request.url().startsWith('http://127.0.0.1:4175/')) external.push(request.url());
  });
  await page.goto('/');
  await page.getByRole('tab', { name: 'Email file' }).click();
  const eml = [
    'From: Example Sender <sender@example.com>',
    'Subject: FICTIONAL urgent payment',
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    '<p>Pay this fictional fee now.</p><img src="https://image.example/PRIVATE-PIXEL">',
  ].join('\r\n');
  await page.locator('#email-file').setInputFiles({
    name: 'fictional.eml', mimeType: 'message/rfc822', buffer: Buffer.from(eml),
  });
  await page.getByRole('button', { name: /Check for warning signs/ }).click();
  await expect(page.locator('#results')).toBeVisible();
  await expect(page.locator('#results')).toContainText('Email analysis is incomplete');
  expect(external).toEqual([]);
});

test('phone country remains a clarification and the mobile layout has no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('tab', { name: 'Phone' }).click();
  await page.locator('#phone-number').fill('02 5550 1234');
  await page.getByRole('button', { name: /Check for warning signs/ }).click();
  await expect(page.locator('#results')).toContainText('Which country is this number from?');
  await expect(page.locator('#results')).toContainText('Caller identity');
  const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
  expect(fits).toBe(true);
  await page.screenshot({ path: 'test-results/checkfirst-mobile.png', fullPage: true });
});

test('keyboard tab navigation and a zoom-equivalent narrow layout retain the checker', async ({ page }) => {
  // 640 CSS pixels approximate a 1280-pixel desktop viewport at 200% browser zoom.
  await page.setViewportSize({ width: 640, height: 800 });
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to the checker' })).toBeFocused();
  await page.getByRole('tab', { name: 'Message' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Link' })).toBeFocused();
  await expect(page.getByRole('tab', { name: 'Link' })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#check-input')).toBeVisible();
  await expect(page.getByRole('button', { name: /Check for warning signs/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});
