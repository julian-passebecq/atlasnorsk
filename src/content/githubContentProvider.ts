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

const CACHE_PREFIX = 'atlasnorsk-content:';

function cacheKey(path: string) {
  return `${CACHE_PREFIX}${path}`;
}

function readCache<T>(path: string): T | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const value = localStorage.getItem(cacheKey(path));
    return value ? JSON.parse(value) as T : null;
  } catch {
    return null;
  }
}

function writeCache(path: string, value: unknown) {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(cacheKey(path), JSON.stringify(value));
  } catch {
    // Cache is best-effort only. Full/disabled storage must never break reading.
  }
}

async function fetchJson<T>(path: string): Promise<{ value: T; fromCache: boolean }> {
  try {
    const response = await fetch(new URL(path, CONTENT_BASE_URL), {
      cache: 'no-cache',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`Content request failed: ${response.status} ${path}`);
    }
    return { value: await response.json() as T, fromCache: false };
  } catch (error) {
    const cached = readCache<T>(path);
    if (cached !== null) return { value: cached, fromCache: true };
    throw error;
  }
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function assertManifest(value: unknown): asserts value is ContentManifest {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid Daily News manifest: expected object');
  }
  const manifest = value as Partial<ContentManifest>;
  if (manifest.schemaVersion !== 1 || manifest.type !== 'atlasnorsk-manifest') {
    throw new Error('Unsupported Daily News manifest');
  }
  if (manifest.collection !== 'daily-news' || !Array.isArray(manifest.items)) {
    throw new Error('Invalid Daily News manifest');
  }
  for (const item of manifest.items) {
    if (
      !item
      || !isNonEmptyString(item.id)
      || !isNonEmptyString(item.path)
      || !isNonEmptyString(item.title)
      || !isNonEmptyString(item.date)
      || !isNonEmptyString(item.level)
      || !Array.isArray(item.themes)
    ) {
      throw new Error('Invalid Daily News manifest item');
    }
  }
}

function assertNewsArticle(value: unknown): asserts value is NewsArticle {
  if (!value || typeof value !== 'object') {
    throw new Error('Invalid news article: expected object');
  }
  const article = value as Partial<NewsArticle>;
  if (article.schemaVersion !== 1 || article.type !== 'newsArticle') {
    throw new Error('Unsupported news article');
  }
  if (
    !isNonEmptyString(article.id)
    || !isNonEmptyString(article.title)
    || !isNonEmptyString(article.date)
    || !isNonEmptyString(article.level)
    || !Array.isArray(article.themes)
    || !article.source
    || !isNonEmptyString(article.source.publisher)
    || !isNonEmptyString(article.source.url)
    || !Array.isArray(article.sections)
    || !Array.isArray(article.vocabulary)
    || !Array.isArray(article.grammar)
    || !Array.isArray(article.usefulPhrases)
  ) {
    throw new Error('Invalid news article');
  }
  if (!article.sections.every((section) => section && isNonEmptyString(section.id) && isNonEmptyString(section.norsk))) {
    throw new Error('Invalid news article section');
  }
}

export async function loadDailyNewsManifest(): Promise<ContentManifest> {
  const path = 'content/daily-news/manifest.json';
  const { value, fromCache } = await fetchJson<unknown>(path);
  assertManifest(value);
  if (!fromCache) writeCache(path, value);
  return value;
}

export async function loadNewsArticle(path: string): Promise<NewsArticle> {
  const { value, fromCache } = await fetchJson<unknown>(path);
  assertNewsArticle(value);
  if (!fromCache) writeCache(path, value);
  return value;
}
