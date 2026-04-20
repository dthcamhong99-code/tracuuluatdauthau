import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  console.log('Navigating to Government Portal...');
  try {
    // Attempting to visit the page
    await page.goto('https://pbgdplthainguyen.gov.vn/toan-van-nghi-dinh-24-2024-nd-cp-huong-dan-luat-dau-thau-ve-lua-chon-nha-thau-154780.html', { waitUntil: 'load', timeout: 30000 });
    
    // Check if it redirected or if content is there
    const content = await page.evaluate(() => {
        // Many Gov sites put the main text in a specific div
        const main = document.querySelector('.content-detail') || document.querySelector('.news-content') || document.body;
        return (main as HTMLElement).innerText;
    });
    
    fs.writeFileSync('decree_pbgdpl.txt', content);
    console.log('Success, length:', content.length);
  } catch (e) {
    console.error('Error:', e);
  }
  await browser.close();
})();
