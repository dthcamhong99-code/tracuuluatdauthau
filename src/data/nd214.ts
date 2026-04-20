import rawText from './raw_nd214.txt?raw';
import { DocumentData, Chapter, Article } from '../types';

export function parseNghiDinh(text: string): DocumentData {
  const chapters: Chapter[] = [];
  let currentChapter: Chapter | null = null;
  let currentArticle: Article | null = null;

  const lines = text.split('\n');
  for (let line of lines) {
    const chapMatch = line.match(/^#\s+(Chương\s+[A-ZIVX]+)\s*(.*)/i);
    
    if (chapMatch) {
      if (currentArticle && currentChapter) {
        currentArticle.content = currentArticle.content.trim();
        currentChapter.articles!.push(currentArticle);
        currentArticle = null;
      }
      if (currentChapter) {
        chapters.push(currentChapter);
      }
      currentChapter = {
        id: 'nd214_ch' + (chapters.length + 1),
        title: chapMatch[1] + (chapMatch[2] ? ' ' + chapMatch[2].trim() : ''),
        articles: []
      };
    } else if (line.match(/(Mục\s+\d+\.\s+.*?)(Điều\s+\d+[a-zA-Z]*\.\s*.*)/i)) {
      const splitMatch = line.match(/(Mục\s+\d+\.\s+.*?)(Điều\s+\d+[a-zA-Z]*\.\s*.*)/i);
      if (splitMatch) {
         const articlePart = splitMatch[2];
         const match = articlePart.match(/Điều\s+(\d+[a-zA-Z]*)\.\s*(.*)/i);
         if (match) {
             if (currentArticle && currentChapter) {
                 currentArticle.content = currentArticle.content.trim();
                 currentChapter.articles!.push(currentArticle);
             }
             const numMatch = match[1].match(/\d+/);
             const num = numMatch ? parseInt(numMatch[0] || '0') : 0;
             currentArticle = {
                 id: 'nd214_D' + match[1],
                 number: num,
                 title: 'Điều ' + match[1] + '. ' + match[2].trim(),
                 content: ''
             };
         }
      }
    } else if (line.includes('Điều ') && line.match(/Điều\s+(\d+[a-zA-Z]*)\.\s*(.*)/i) && (line.startsWith('##') || line.startsWith('Điều'))) {
        const match = line.match(/Điều\s+(\d+[a-zA-Z]*)\.\s*(.*)/i);
        if (match) {
            if (currentArticle && currentChapter) {
                currentArticle.content = currentArticle.content.trim();
                currentChapter.articles!.push(currentArticle);
            }
            const numMatch = match[1].match(/\d+/);
            const num = numMatch ? parseInt(numMatch[0] || '0') : 0;
            currentArticle = {
                id: 'nd214_D' + match[1],
                number: num,
                title: 'Điều ' + match[1] + '. ' + match[2].trim(),
                content: ''
            };
        }
    } else {
      if (currentArticle) {
        let cleanLine = line.replace(/\\([\.\-\*])/g, '$1').trim();
        if (cleanLine !== '') {
          currentArticle.content += cleanLine + '\n\n';
        }
      }
    }
  }

  if (currentArticle && currentChapter) {
    currentArticle.content = currentArticle.content.trim();
    currentChapter.articles!.push(currentArticle);
  }
  if (currentChapter) {
    chapters.push(currentChapter);
  }

  if (chapters.length === 0) {
      chapters.push({
          id: 'nd214_empty',
          title: 'Đang chờ dữ liệu...',
          articles: [
              {
                  id: 'nd214_empty_art',
                  number: 0,
                  title: 'Chưa có thông tin',
                  content: 'Vui lòng dán nội dung vào file src/data/raw_nd214.txt'
              }
          ]
      })
  }

  return {
    id: 'nd214',
    title: 'Nghị định 214/2024/NĐ-CP',
    shortTitle: 'NĐ 214',
    chapters
  };
}

export const nghiDinh214Data = parseNghiDinh(rawText);

export const allNd214Articles: Article[] = nghiDinh214Data.chapters.flatMap(ch => 
  [...(ch.articles || []), ...(ch.sections ? ch.sections.flatMap(s => s.articles) : [])]
);
