const https = require('https');
const fs = require('fs');

const url = "https://thuvienphapluat.vn/van-ban/Dau-tu/Nghi-dinh-24-2024-ND-CP-huong-dan-Luat-Dau-thau-ve-lua-chon-nha-thau-598910.aspx";

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('tvpl.html', data);
    console.log('Success, length', data.length);
  });
}).on('error', err => {
  console.log('Error', err.message);
});
