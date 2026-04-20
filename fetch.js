const https = require('https');
const fs = require('fs');

const url = "https://luatvietnam.vn/dau-tu/nghi-dinh-24-2024-nd-cp-huong-dan-luat-dau-thau-2023-ve-lua-chon-nha-thau-281816-d1.html";

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // very basic regex to strip html
    const contentMatch = data.match(/<div class="content-doc[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/);
    let text = contentMatch ? contentMatch[1] : data;
    text = text.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<\/p>/gi, '\n');
    text = text.replace(/<\/?[^>]+(>|$)/g, ""); // remove tags
    
    fs.writeFileSync('decree.txt', text);
    console.log('Success, wrote to decree.txt, length', text.length);
  });
}).on('error', err => {
  console.log('Error', err.message);
});
