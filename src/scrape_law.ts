import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  console.log('Navigating to Law site...');
  try {
    // This site is often a mirrors of TVPL or similar but sometimes has less strict bot detection
    await page.goto('https://phapluat.vn/van-ban/nghi-dinh-24-2024-nd-cp-cua-chinh-phu-quy-dinh-chi-tiet-mot-so-dieu-va-bien-phap-thi-hanh-luat-dau-thau-ve-lua-chon-nha-thau-598910.aspx', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    const content = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync('decree_raw.txt', content);
    console.log('Success, length:', content.length);
  } catch (e) {
    console.error('Error:', e);
  }
  await browser.close();
})();
