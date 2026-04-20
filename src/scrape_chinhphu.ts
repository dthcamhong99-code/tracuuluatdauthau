import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  console.log('Navigating...');
  try {
    await page.goto('https://vanban.chinhphu.vn/default.aspx?pageid=27160&docid=209702', { waitUntil: 'networkidle2', timeout: 60000 });
    const content = await page.evaluate(() => {
      // Common selectors for government sites
      const selectors = ['.content-vankien', '.vankien-noidung', '#divContent', '#noidung-vanban', '.document-content'];
      for (const s of selectors) {
        const el = document.querySelector(s);
        if (el) return (el as HTMLElement).innerText;
      }
      return document.body.innerText;
    });
    fs.writeFileSync('decree_full.txt', content);
    console.log('Success, length:', content.length);
  } catch (e) {
    console.error('Error:', e);
  }
  await browser.close();
})();
