import fs from 'fs';

const html = fs.readFileSync('./decree.html', 'utf8');
const contentMatch = html.match(/<div class="content-doc.*?>(.*)<\/div>\s*<\/div>\s*<\/div>/s);
let text = contentMatch ? contentMatch[1] : html;

text = text.replace(/<br\s*\/?>/gi, '\n');
text = text.replace(/<\/p>/gi, '\n');
text = text.replace(/<\/?[^>]+(>|$)/g, "");

fs.writeFileSync('./decree.txt', text);
console.log('Processed to decree.txt');
