import {test,expect} from '@playwright/test';
test('root negotiates browser languages and never caches the choice',async({request})=>{
 for(const [language,route] of [['ko-KR,en;q=0.8','/ko'],['en-US','/en'],['fr;q=1,ko;q=0.9','/ko'],['ja-JP','/en']]){
  const response=await request.get('/',{headers:{'Accept-Language':language},maxRedirects:0});
  expect(response.status()).toBe(307);expect(new URL(response.headers().location, response.url()).pathname).toBe(route);
  expect(response.headers()['cache-control']).toContain('no-store');
 }
});
test('explicit locale wins, manual choice persists and shared colours are present',async({page,context})=>{
 await context.setExtraHTTPHeaders({'Accept-Language':'ko-KR'});
 await page.goto('/en');await expect(page.locator('html')).toHaveAttribute('lang','en');
 await expect(page.getByRole('heading',{level:1})).toContainText('Simhae');
 await expect(page.locator('.variants')).toContainText('#24425C');
 await expect(page.locator('.variants')).toContainText('#4A6E86');
 await expect(page.locator('.ports article')).toHaveCount(3);
 await page.getByRole('link',{name:'한국어',exact:true}).click();
 await expect(page).toHaveURL(/\/ko$/);await expect(page.locator('html')).toHaveAttribute('lang','ko');
 await page.getByRole('link',{name:'English',exact:true}).click();
 await page.goto('/');await expect(page).toHaveURL(/\/en$/);
 await page.goto('/ko');await expect(page.locator('html')).toHaveAttribute('lang','ko');
 await expect(page.locator('link[hreflang="en"]')).toHaveAttribute('href',/\/en$/);
});
test('unknown locale is not presented as a supported translation',async({request})=>{
 expect((await request.get('/fr')).status()).toBe(404);
});
