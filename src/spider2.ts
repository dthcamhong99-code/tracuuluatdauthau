import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://thuvienphapluat.vn/van-ban/Dau-tu/Nghi-dinh-24-2024-ND-CP-huong-dan-Luat-Dau-thau-ve-lua-chon-nha-thau-598910.aspx', { waitUntil: 'load', timeout: 60000 });
  
  const content = await page.evaluate(() => {
    return document.body.innerText;
  });
  
  fs.writeFileSync('decree_text.txt', content);
  console.log('Success, length', content.length);
  await browser.close();
})();
