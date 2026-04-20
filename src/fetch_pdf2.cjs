const https = require('https');
const fs = require('fs');
const pdfParse = require('pdf-parse');

const url = "https://data.chinhphu.vn/TTHC/Doc/2024/2/24-nd.pdf";

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0',
    'Accept': '*/* '
  }
}, (res) => {
  const chunks = [];
  res.on('data', chunk => chunks.push(chunk));
  res.on('end', async () => {
    try {
      const buffer = Buffer.concat(chunks);
      const data = await pdfParse(buffer);
      fs.writeFileSync('./decree.txt', data.text);
      console.log('Success, wrote to decree.txt with length', data.text.length);
    } catch(e) {
      console.log('Error', e);
    }
  });
}).on('error', err => {
  console.log('Error', err.message);
});
