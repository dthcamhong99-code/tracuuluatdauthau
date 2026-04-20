const fs = require('fs');

const rawText = fs.readFileSync('raw.md', 'utf8');

const chapters = [];
let currentChapter = null;
let currentArticle = null;

const lines = rawText.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const chapMatch = line.match(/^#\s+(Chương\s+[A-ZIVX]+)\s+(.*)/i);
  const artMatch = line.match(/^##\s+Điều\s+(\d+[a-zA-Z]*)\.\s+(.*)/i);

  if (chapMatch) {
     if (currentArticle) {
        currentArticle.content = currentArticle.content.trim();
        currentChapter.articles.push(currentArticle);
        currentArticle = null;
     }
     if (currentChapter) {
        chapters.push(currentChapter);
     }
     currentChapter = {
        id: 'nd214_ch' + (chapters.length + 1),
        title: chapMatch[1] + ': ' + chapMatch[2].trim(),
        articles: []
     };
  } else if (artMatch) {
     if (currentArticle) {
        currentArticle.content = currentArticle.content.trim();
        currentChapter.articles.push(currentArticle);
     }
     currentArticle = {
        id: 'nd214_D' + artMatch[1],
        title: 'Điều ' + artMatch[1] + '. ' + artMatch[2].trim(),
        content: ''
     };
  } else {
     if (currentArticle && line.trim() !== '') {
        // Remove markdown escaping characters like "\." -> "."
        let cleanLine = line.replace(/\\([\.\-\*])/g, '$1');
        currentArticle.content += cleanLine + '\n\n';
     }
  }
}
if (currentArticle) {
    currentArticle.content = currentArticle.content.trim();
    currentChapter.articles.push(currentArticle);
}
if (currentChapter) {
    chapters.push(currentChapter);
}

const output = `import { DocumentData } from '../types';

export const nghiDinh214Data: DocumentData = {
  id: 'nghidinh',
  title: 'Nghị định 214',
  chapters: ${JSON.stringify(chapters, null, 2)}
};
`;
fs.writeFileSync('src/data/nghiDinh214.ts', output);
