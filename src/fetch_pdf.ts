import https from 'https';
import fs from 'fs';

const url = "https://r.jina.ai/https://data.chinhphu.vn/TTHC/Doc/2024/2/24-nd.pdf";

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('decree.md', data);
    console.log('Success, wrote to decree.md, length', data.length);
  });
}).on('error', err => {
  console.log('Error', err.message);
});
