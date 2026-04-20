import https from 'https';
import fs from 'fs';

const url = "https://r.jina.ai/https://luatvietnam.vn/dau-tu/nghi-dinh-24-2024-nd-cp-huong-dan-luat-dau-thau-2023-ve-lua-chon-nha-thau-281816-d1.html";

https.get(url, {
  headers: {
    'X-Target-Selector': '.content-doc'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('decree.md', data);
    console.log('Success, wrote to decree.md, length', data.length);
  });
}).on('error', err => {
  console.log('Error', err.message);
});
