export const CONTENT_BASE_URL =
  'https://raw.githubusercontent.com/julian-passebecq/atlasnorsk-content/main/';

export interface ContentManifestItem {
  id: string;
  path: string;
  title: string;
  date: string;
  level: string;
  themes: string[];
}

export interface ContentManifest {
  schemaVersion: 1;
  type: 'atlasnorsk-manifest';
  collection: string;
  updatedAt: string;
  items: ContentManifestItem[];
}

export interface NewsArticle {
  schemaVersion: 1;
  type: 'newsArticle';
  id: string;
  title: string;
  date: string;
  level: 'A2' | 'B1' | 'B2' | 'C1';
  themes: string[];
  source: {
    title: string;
    publisher: string;
    url: string;
    publishedAt?: string | null;
    language: string;
  };
  rights?: {
    storageMode: 'link-only' | 'user-provided' | 'licensed' | 'public-domain';
    note?: string;
  };
  summary?: {
    norsk?: string;
    english?: string;
    french?: string;
  };
  sections: Array<{
    id: string;
    sourceText?: string;
    norsk: string;
    english?: string;
    french?: string;
    note?: string;
  }>;
  vocabulary: Array<{
    term: string;
    marker?: string;
    type: string;
    level: 'A2' | 'B1' | 'B2' | 'C1';
    english: string;
    french: string;
    forms?: string;
    note?: string;
  }>;
  grammar: Array<{
    topic: string;
    example: string;
    explanation?: string;
  }>;
  usefulPhrases: Array<{
    norsk: string;
    english: string;
    french: string;
    function?: string;
  }>;
}

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(new URL(path, CONTENT_BASE_URL), {
    cache: 'no-cache',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Content request failed: ${response.status} ${path}`);
  }
  return response.json() as Promise<T>;
}

export async function loadDailyNewsManifest(): Promise<ContentManifest> {
  const manifest = await fetchJson<ContentManifest>('content/daily-news/manifest.json');
  if (manifest.schemaVersion !== 1 || manifest.type !== 'atlasnorsk-manifest') {
    throw new Error('Unsupported Daily News manifest');
  }
  return manifest;
}

export async function loadNewsArticle(path: string): Promise<NewsArticle> {
  const article = await fetchJson<NewsArticle>(path);
  if (article.schemaVersion !== 1 || article.type !== 'newsArticle') {
    throw new Error('Unsupported news article');
  }
  return article;
}
