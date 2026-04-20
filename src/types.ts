export interface Article {
  id: string;
  number: number;
  title: string;
  content: string;
}

export interface Section {
  id: string;
  title: string;
  articles: Article[];
}

export interface Chapter {
  id: string;
  title: string;
  sections?: Section[];
  articles?: Article[]; // For chapters that don't have sections
}

export interface DocumentData {
  id: string;
  title: string;
  shortTitle: string;
  chapters: Chapter[];
}
