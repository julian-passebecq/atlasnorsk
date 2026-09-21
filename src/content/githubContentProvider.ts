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

async function fetchJson(path: string): Promise<unknown> {
  const response = await fetch(new URL(path, CONTENT_BASE_URL), {
    cache: 'no-cache',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Content request failed: ${response.status} ${path}`);
  }
  return response.json() as Promise<unknown>;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isNonEmptyString);
}

function isCefrLevel(value: unknown): value is NewsArticle['level'] {
  return value === 'A2' || value === 'B1' || value === 'B2' || value === 'C1';
}

function isSafeContentPath(value: string) {
  return value.startsWith('content/daily-news/')
    && !value.includes('..')
    && !value.includes('://')
    && !value.startsWith('/');
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
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
      || !isCefrLevel(item.level)
      || !isStringArray(item.themes)
      || !isSafeContentPath(item.path)
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
    || !isCefrLevel(article.level)
    || !isStringArray(article.themes)
    || !article.source
    || !isNonEmptyString(article.source.title)
    || !isNonEmptyString(article.source.publisher)
    || !isNonEmptyString(article.source.url)
    || !isHttpUrl(article.source.url)
    || !isNonEmptyString(article.source.language)
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

  if (!article.vocabulary.every((entry) =>
    entry
    && isNonEmptyString(entry.term)
    && isNonEmptyString(entry.type)
    && isCefrLevel(entry.level)
    && isNonEmptyString(entry.english)
    && isNonEmptyString(entry.french),
  )) {
    throw new Error('Invalid news article vocabulary');
  }

  if (!article.grammar.every((entry) =>
    entry
    && isNonEmptyString(entry.topic)
    && isNonEmptyString(entry.example),
  )) {
    throw new Error('Invalid news article grammar');
  }

  if (!article.usefulPhrases.every((entry) =>
    entry
    && isNonEmptyString(entry.norsk)
    && isNonEmptyString(entry.english)
    && isNonEmptyString(entry.french),
  )) {
    throw new Error('Invalid news article phrase');
  }
}

async function loadValidated<T>(
  path: string,
  validate: (value: unknown) => asserts value is T,
): Promise<T> {
  try {
    const remote = await fetchJson(path);
    validate(remote);
    writeCache(path, remote);
    return remote;
  } catch (remoteError) {
    const cached = readCache<unknown>(path);
    if (cached !== null) {
      try {
        validate(cached);
        return cached;
      } catch {
        // Never return an invalid cached value. Prefer the original remote error.
      }
    }
    throw remoteError;
  }
}

export async function loadDailyNewsManifest(): Promise<ContentManifest> {
  return loadValidated('content/daily-news/manifest.json', assertManifest);
}

function articleMatchesManifest(article: NewsArticle, item: ContentManifestItem): boolean {
  return article.id === item.id
    && article.title === item.title
    && article.date === item.date
    && article.level === item.level
    && article.themes.length === item.themes.length
    && article.themes.every((theme, index) => theme === item.themes[index]);
}

export async function loadNewsArticle(
  path: string,
  expected?: ContentManifestItem,
): Promise<NewsArticle> {
  const article = await loadValidated(path, assertNewsArticle);
  if (expected && !articleMatchesManifest(article, expected)) {
    throw new Error('News article metadata does not match manifest');
  }
  return article;
}
