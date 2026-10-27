import { expect, test } from '@playwright/test';

test('palette follows the 720px story at 1.25 times its width and copies HEX with a short toast', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en#palette');
  const story = await page.locator('.story-body').boundingBox();
  const palette = await page.locator('.palette-preview').boundingBox();
  const editor = await page.locator('.editor-preview').boundingBox();
  expect(story!.width).toBe(720);
  expect(palette!.width).toBe(900);
  expect(palette!.y).toBeLessThan(editor!.y);

  const swatch = page.getByRole('button', { name: 'Copy #0A1F2E — Background', exact: true });
  await swatch.hover();
  await expect(swatch.locator('.palette-copy-label')).toHaveCSS('opacity', '1');
  await expect(swatch.locator('.palette-copy-label')).toHaveCSS('border-top-style', 'dashed');
  await swatch.click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('#0A1F2E');
  const toast = page.locator('[data-sonner-toast]').filter({ hasText: '#0A1F2E copied to clipboard.' });
  await expect(toast).toBeVisible();
  await expect(page.locator('[data-sonner-toaster]')).toHaveAttribute('data-x-position', 'center');
  await expect(page.locator('[data-sonner-toaster]')).toHaveAttribute('data-y-position', 'bottom');
  await expect(toast).toBeHidden({ timeout: 1600 });
});

test('clipboard rejection shows an error instead of claiming success', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async () => { throw new DOMException('Permission denied', 'NotAllowedError'); },
    } });
  });
  await page.goto('/ko#palette');
  await page.getByRole('button', { name: '복사 #0A1F2E — 기본 배경', exact: true }).click();
  await expect(page.locator('[data-sonner-toast]')).toContainText('복사하지 못했습니다. 다시 시도해 주세요.');
  await expect(page.locator('[data-sonner-toast]')).not.toContainText('복사했습니다.');
});

test.describe('touch palette', () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  test('copy affordance is visible without hover and reduced motion is respected', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/ko#palette');
    const swatch = page.getByRole('button', { name: '복사 #0A1F2E — 기본 배경', exact: true });
    await expect(swatch.locator('.palette-copy-label')).toHaveCSS('opacity', '1');
    await expect(swatch.locator('.palette-face')).toHaveCSS('transition-duration', '0s');
    await swatch.tap();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe('#0A1F2E');
    await expect(page.locator('[data-sonner-toast]')).toContainText('#0A1F2E 복사했습니다.');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
});
