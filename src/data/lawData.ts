import { Chapter, Section, Article, DocumentData } from "../types";
import { LUAT_DAU_THAU_TEXT } from "./rawText1";
import { LUAT_DAU_THAU_TEXT2 } from "./rawText2";
import { LUAT_DAU_THAU_TEXT3 } from "./rawText3";
import { LUAT_DAU_THAU_TEXT4 } from "./rawText4";
import { LUAT_DAU_THAU_TEXT5 } from "./rawText5";
import { LUAT_DAU_THAU_TEXT6 } from "./rawText6";
import { LUAT_DAU_THAU_TEXT7 } from "./rawText7";

export const FULL_TEXT = LUAT_DAU_THAU_TEXT + "\n\n" + 
                         LUAT_DAU_THAU_TEXT2 + "\n\n" + 
                         LUAT_DAU_THAU_TEXT3 + "\n\n" + 
                         LUAT_DAU_THAU_TEXT4 + "\n\n" + 
                         LUAT_DAU_THAU_TEXT5 + "\n\n" + 
                         LUAT_DAU_THAU_TEXT6 + "\n\n" + 
                         LUAT_DAU_THAU_TEXT7;

function parseLawData(text: string, prefix: string): Chapter[] {
  const chapters: Chapter[] = [];
  let currentChapter: any = null;
  let currentSection: any = null;
  let currentArticle: any = null;

  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('# Chương')) {
      currentChapter = {
        id: `${prefix}-CH-${chapters.length + 1}`,
        title: line.replace(/^#\s*/, ''),
        sections: [],
        articles: []
      };
      chapters.push(currentChapter);
      currentSection = null;
      currentArticle = null;
    } else if (line.startsWith('## Mục')) {
      if (currentChapter) {
        currentSection = {
          id: `${currentChapter.id}-S${(currentChapter.sections?.length || 0) + 1}`,
          title: line.replace(/^##\s*/, ''),
          articles: []
        };
        if (!currentChapter.sections) currentChapter.sections = [];
        currentChapter.sections.push(currentSection);
        currentArticle = null;
      }
    } else if (line.match(/^(?:##?#?\s*)?Điều\s+\d/i)) {
      const match = line.match(/^(?:##?#?\s*)?Điều\s+(\d+[a-zA-Z]*)\.\s*(.+)/i);
      if (match) {
        let numberText = match[1];
        let titleText = line.replace(/^(?:##?#?)\s*/, '');
        
        currentArticle = {
          id: `${prefix}-D${numberText}`,
          number: numberText as any, // Might be string like '2a'
          title: titleText,
          content: ""
        };

        if (currentSection) {
          currentSection.articles.push(currentArticle);
        } else if (currentChapter) {
          if (!currentChapter.articles) currentChapter.articles = [];
          currentChapter.articles.push(currentArticle);
        }
      } else {
        // It started with Điều but didn't match the pattern perfectly, eg missing a dot
        let titleText = line.replace(/^(?:##?#?)\s*/, '');
        currentArticle = {
          id: `${prefix}-D-unknown-${Math.random()}`,
          number: 0,
          title: titleText,
          content: ""
        };
        if (currentSection) {
          currentSection.articles.push(currentArticle);
        } else if (currentChapter) {
          if (!currentChapter.articles) currentChapter.articles = [];
          currentChapter.articles.push(currentArticle);
        }
      }
    } else {
      // Content line
      if (currentArticle) {
        if (currentArticle.content) {
          currentArticle.content += "\n\n" + line; // Keep paragraph breaks
        } else {
          currentArticle.content = line;
        }
      }
    }
  }

  // Final cleanup: if a chapter has sections, don't use direct articles (or keep them if there are pre-section articles)
  // Our types say it can be one or the other. Let's make sure it's clean.
  chapters.forEach(ch => {
    if (ch.sections && ch.sections.length === 0) {
      delete ch.sections;
    }
    if (ch.articles && ch.articles.length === 0) {
      delete ch.articles;
    }
  });

  return chapters;
}

export const LAW_DATA: Chapter[] = parseLawData(FULL_TEXT, "luat");

export const DOCUMENTS: DocumentData[] = [
  { id: 'luat', title: 'Luật Đấu Thầu Số 22/2023/QH15', shortTitle: 'Luật Đấu Thầu', chapters: LAW_DATA }
];

const _allLawArticles: Article[] = [];
LAW_DATA.forEach(ch => {
  if (ch.articles) _allLawArticles.push(...ch.articles);
  if (ch.sections) {
    ch.sections.forEach(s => _allLawArticles.push(...s.articles));
  }
});
export const allLawArticles = _allLawArticles;
