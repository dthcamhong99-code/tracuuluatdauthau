import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  console.log('Navigating to TVPL...');
  try {
    // Using a different TVPL URL format if possible
    await page.goto('https://thuvienphapluat.vn/van-ban/Dau-tu/Nghi-dinh-24-2024-ND-CP-huong-dan-Luat-Dau-thau-ve-lua-chon-nha-thau-598910.aspx', { waitUntil: 'domcontentloaded', timeout: 60000 });
    // Wait a bit for the content to render or bot check to pass if it's simple
    await new Promise(r => setTimeout(r, 5000));
    
    const content = await page.evaluate(() => {
      const el = document.querySelector('#content_full') || document.querySelector('.content1') || document.body;
      return (el as HTMLElement).innerText;
    });
    
    fs.writeFileSync('decree_tvpl.txt', content);
    console.log('Success, length:', content.length);
  } catch (e) {
    console.error('Error:', e);
  }
  await browser.close();
})();
