import https from 'https';
import fs from 'fs';

const url = "https://r.jina.ai/https://thuvienphapluat.vn/van-ban/Dau-tu/Nghi-dinh-24-2024-ND-CP-huong-dan-Luat-Dau-thau-ve-lua-chon-nha-thau-598910.aspx";

https.get(url, {
  headers: {
    'X-Return-Format': 'markdown'
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
