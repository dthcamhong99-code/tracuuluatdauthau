const https = require('https');
const fs = require('fs');

const url = "https://luatvietnam.vn/dau-tu/nghi-dinh-24-2024-nd-cp-huong-dan-luat-dau-thau-2023-ve-lua-chon-nha-thau-281816-d1.html";

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('decree.html', data);
    console.log('Success, wrote to decree.html');
  });
}).on('error', err => {
  console.log('Error', err.message);
});
