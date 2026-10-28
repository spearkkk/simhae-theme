import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

const englishMessages = JSON.parse(readFileSync(new URL('../../web/src/messages/en.json', import.meta.url), 'utf8'));

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`hero can be revisited until entry, then scrolling stays in the content at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/ko');
    const hero = page.locator('.ocean-hero');
    const content = page.locator('#information');
    const header = page.getByRole('banner');
    await expect(hero).toBeVisible();
    await expect(page.locator('.ocean-image')).toHaveAttribute('src', /webp/);
    await expect.poll(() => page.locator('.ocean-image').evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    const initialHero = await hero.boundingBox();
    const initialContent = await content.boundingBox();
    expect(initialHero!.y).toBe(0);
    expect(initialHero!.height).toBe(viewport.height);
    expect(initialContent!.y).toBe(viewport.height);
    const initialOpacity = await header.evaluate(el => Number(getComputedStyle(el).opacity));
    expect(initialOpacity).toBeLessThan(0.5);

    await page.evaluate(height => window.scrollTo(0, height / 2), viewport.height);
    await expect.poll(async () => (await hero.boundingBox())!.y).toBe(0);
    await expect.poll(async () => (await content.boundingBox())!.y).toBeCloseTo(viewport.height / 2, 0);
    await expect.poll(() => header.evaluate(el => Number(getComputedStyle(el).opacity))).toBeGreaterThan(0.8);
    expect(await page.evaluate(() => document.elementFromPoint(innerWidth / 2, innerHeight - 10)?.closest('#information') !== null)).toBe(true);

    // Before reaching the header, reversing the scroll still reveals the image.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect.poll(() => header.evaluate(el => Number(getComputedStyle(el).opacity))).toBeLessThan(0.5);
    await expect(hero).toBeVisible();

    // Once docked, the panel stays below the header while its contents move.
    const headerBottom = (await header.boundingBox())!.height;
    const dockAt = viewport.height - headerBottom;
    await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), dockAt);
    await expect(hero).toBeHidden();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect.poll(async () => (await content.boundingBox())!.y).toBeCloseTo(headerBottom, 0);
    const inner = page.locator('.information-inner');
    const innerTop = (await inner.boundingBox())!.y;
    await page.evaluate(() => window.scrollTo({ top: 240, behavior: 'instant' }));
    await expect.poll(async () => (await content.boundingBox())!.y).toBeCloseTo(headerBottom, 0);
    await expect.poll(async () => (await inner.boundingBox())!.y).toBeCloseTo(innerTop - 240, 0);
    await expect(page.locator('.ocean-hero h1')).toHaveCount(0);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await expect(header).toHaveCSS('opacity', '1');
    await expect(hero).toBeHidden();
    await page.mouse.wheel(0, -2000);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect.poll(async () => (await content.boundingBox())!.y).toBeCloseTo(headerBottom, 0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.setViewportSize({ width: viewport.width === 1440 ? 390 : 1440, height: viewport.height });
    await expect(hero).toBeHidden();
    await expect.poll(async () => (await content.boundingBox())!.y).toBeCloseTo((await header.boundingBox())!.height, 0);
  });
}

test('keyboard navigation reveals the header and scroll link reaches information with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('banner')).toHaveCSS('opacity', '1');
  await page.getByRole('link', { name: 'Scroll to explore' }).click({ timeout: 3000 });
  await expect(page).toHaveURL(/#information$/);
  await expect.poll(() => page.locator('#information').evaluate(el => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(0);
  await expect(page.getByRole('heading', { name: 'Have you been in the deep ocean before?' })).toBeInViewport();
  await expect(page.locator('.theme-story')).toHaveCSS('text-align', 'center');
  const storyTop = (await page.locator('.theme-story').boundingBox())!.y;
  const previewTop = (await page.locator('.code').boundingBox())!.y;
  const paletteTop = (await page.locator('.palette-preview').boundingBox())!.y;
  const showcaseTop = (await page.locator('.app-showcase').boundingBox())!.y;
  expect(storyTop).toBeLessThan(paletteTop);
  expect(paletteTop).toBeLessThan(previewTop);
  expect(previewTop).toBeLessThan(showcaseTop);
  await expect(page.locator('.app-showcase .muted')).toHaveCount(0);
  await expect(page.locator('footer')).toContainText('The Simhae project');
});

test('landing content remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/en');
  await expect(page.getByRole('banner')).toHaveCSS('opacity', '1');
  await page.getByRole('link', { name: 'Scroll to explore' }).click();
  await expect(page.locator('#information')).toBeInViewport();
  await page.getByRole('link', { name: '한국어', exact: true }).click();
  await expect(page).toHaveURL(/\/ko$/);
  await context.close();
});

test('reverse keyboard navigation skips the dismissed hero', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en');
  const cue = page.getByRole('link', { name: 'Scroll to explore' });
  await cue.click();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Copy #0A1F2E — Background', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('link', { name: '한국어', exact: true })).toBeFocused();
  await expect(page.locator('.ocean-hero')).toBeHidden();
});

test('section fragments reveal headings inside the docked information panel', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en#palette');
  const headerBottom = (await page.getByRole('banner').boundingBox())!.height;
  await expect.poll(async () => (await page.locator('#palette').boundingBox())!.y).toBeGreaterThanOrEqual(headerBottom);
  // The final section may stop lower when the page reaches its scroll limit.
  await expect(page.locator('#palette')).toBeInViewport({ ratio: 1 });
  await page.evaluate(() => { location.hash = 'preview'; });
  await expect.poll(async () => (await page.locator('#preview').boundingBox())!.y).toBeGreaterThanOrEqual(headerBottom);
  await expect.poll(async () => (await page.locator('#preview').boundingBox())!.y).toBeLessThanOrEqual(headerBottom + 32);
  await expect(page.locator('#preview')).toBeInViewport();
});

test('scrolling beyond the footer fades the ocean over the story', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en');
  const headerHeight = (await page.getByRole('banner').boundingBox())!.height;
  await page.evaluate(() => document.querySelector('.scroll-cue')?.scrollIntoView());
  await page.evaluate(() => window.scrollTo({ top: document.querySelector('.information-stage')!.getBoundingClientRect().top + window.scrollY + document.querySelector('.information-inner')!.scrollHeight, behavior: 'instant' }));
  const footer = page.locator('footer');
  await expect(footer).toBeAttached();
  await expect(page.locator('.information-stage')).toHaveAttribute('data-enhanced', '');
  await page.evaluate(() => {
    const headerHeight = document.querySelector('.site-header')!.getBoundingClientRect().height;
    window.scrollTo({ top: window.innerHeight - headerHeight + 1, behavior: 'instant' });
  });
  await expect(page.locator('#ocean')).toHaveAttribute('data-dismissed', '');
  const transition = await page.evaluate(() => {
    const content = document.querySelector('.information-inner')!;
    const panel = document.querySelector('#information')!;
    const stage = document.querySelector('.information-stage')!;
    const header = document.querySelector('.site-header')!;
    const distance = window.innerHeight * 0.8;
    const dockAt = stage.getBoundingClientRect().top + window.scrollY - header.getBoundingClientRect().height;
    return { start: dockAt + content.scrollHeight - panel.clientHeight, distance };
  });
  await page.evaluate(({ start, distance }) => window.scrollTo({ top: start + distance / 2, behavior: 'instant' }), transition);
  await expect.poll(() => page.locator('.ocean-return-image').evaluate(el => Number(getComputedStyle(el).opacity))).toBeCloseTo(0.5, 2);
  await expect.poll(() => page.locator('.information-inner').evaluate(el => Number(getComputedStyle(el).opacity))).toBeCloseTo(0.5, 2);
  await page.evaluate(({ start, distance }) => window.scrollTo({ top: start + distance, behavior: 'instant' }), transition);
  await expect.poll(() => page.locator('.ocean-return-image').evaluate(el => Number(getComputedStyle(el).opacity))).toBeCloseTo(1, 2);
  await expect(page.locator('.information-inner')).toHaveCSS('opacity', '0');
  await expect(page.getByRole('banner')).toHaveCSS('opacity', '0');
  await page.evaluate(({ start, distance }) => window.scrollTo({ top: start + distance * 1.5, behavior: 'instant' }), transition);
  await expect.poll(() => page.locator('.ocean-return-image').evaluate(el => Number(getComputedStyle(el).opacity))).toBeCloseTo(0.81, 2);
  await expect(page.locator('.ocean-ending')).toContainText('end.');
  await expect(page.locator('.ocean-ending-separator')).toBeAttached();
  await expect.poll(() => page.locator('.ocean-ending').evaluate(el => Number(getComputedStyle(el).opacity))).toBeCloseTo(0.36, 2);
  await expect.poll(() => page.locator('.ocean-return-scene').evaluate(el => Number(getComputedStyle(el, '::before').opacity))).toBeCloseTo(0.5, 2);
  await page.evaluate(({ start, distance }) => window.scrollTo({ top: start + distance * 2, behavior: 'instant' }), transition);
  await expect.poll(() => page.locator('.ocean-return-image').evaluate(el => Number(getComputedStyle(el).opacity))).toBeCloseTo(0.62, 2);
  await expect.poll(() => page.locator('.ocean-return-image').evaluate(el => Number(getComputedStyle(el).filter.match(/blur\(([^)]+)/)?.[1].replace('px', '')))).toBeCloseTo(2, 1);
  await expect(page.locator('.ocean-return-scene')).toHaveCSS('opacity', '1');
  await expect.poll(() => page.locator('.ocean-return-scene').evaluate(el => getComputedStyle(el, '::before').backgroundColor)).toBe('rgb(7, 20, 32)');
  await expect.poll(() => page.locator('.ocean-return-scene').evaluate(el => Number(getComputedStyle(el, '::after').opacity))).toBeCloseTo(0.72, 2);
  await expect.poll(() => page.locator('.ocean-ending').evaluate(el => Number(getComputedStyle(el).opacity))).toBeCloseTo(0.72, 2);
  await expect(page.locator('.ocean-return p')).toHaveCount(0);
  expect(headerHeight).toBeGreaterThan(0);
});

test('setup gallery shows each app screenshot without installation or source actions', async ({ page }) => {
  await page.goto('/en');
  const cards = page.locator('.app-shot-card');
  const apps = [
    { id: 'alfred', name: 'Alfred', screenshot: '/app-shots/alfred.png' },
    { id: 'chrome', name: 'Chrome', screenshot: '/app-shots/chrome.png' },
    { id: 'ghostty-fastfetch', name: 'Ghostty + Fastfetch', screenshot: '/app-shots/ghostty-fastfetch.png' },
    { id: 'tmux', name: 'tmux', screenshot: '/app-shots/tmux.png' },
    { id: 'zen-browser', name: 'Zen Browser', screenshot: '/app-shots/zen-browser.png' },
  ];
  await expect(cards).toHaveCount(apps.length);

  for (const app of apps) {
    const card = page.locator(`[data-app-id="${app.id}"]`);
    await expect(card).toHaveCount(1);
    await expect(card.getByRole('heading')).toHaveText(app.name);
    if (app.id === 'alfred') {
      await expect(card).toHaveClass(/app-shot-card--launcher/);
      await expect(card.locator('.app-shot-art')).toHaveClass(/app-shot-art--launcher/);
    }
    const image = card.locator('img');
    await expect(image).toHaveAttribute('src', new RegExp(encodeURIComponent(app.screenshot)));
    await expect(image).toHaveAttribute('alt', englishMessages.appScreenshotAlt[app.id]);
    await image.evaluate(el => { (el as HTMLImageElement).loading = 'eager'; });
    await expect.poll(() => image.evaluate(img => (img as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(card.getByRole('link')).toHaveCount(0);
    await expect(card.locator('[data-slot="badge"]')).toHaveCount(0);
  }
  const desktopGalleryWidth = await page.locator('.app-shot-grid').evaluate(el => el.getBoundingClientRect().width);
  const desktopAlfredWidth = await page.locator('[data-app-id="alfred"]').evaluate(el => el.getBoundingClientRect().width);
  expect(Math.abs(desktopGalleryWidth - desktopAlfredWidth)).toBeLessThan(1);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.app-shot-card').first()).toHaveCSS('animation-name', 'none');

  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(page.locator('.app-shot-card')).toHaveCount(apps.length);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const galleryWidth = await page.locator('.app-shot-grid').evaluate(el => el.getBoundingClientRect().width);
    const alfredWidth = await page.locator('[data-app-id="alfred"]').evaluate(el => el.getBoundingClientRect().width);
    expect(Math.abs(galleryWidth - alfredWidth)).toBeLessThan(1);
  }
});
