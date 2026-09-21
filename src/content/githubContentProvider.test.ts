import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CONTENT_BASE_URL,
  loadDailyNewsManifest,
  loadNewsArticle,
} from './githubContentProvider';

const manifest = {
  schemaVersion: 1,
  type: 'atlasnorsk-manifest',
  collection: 'daily-news',
  updatedAt: '2026-09-21',
  items: [
    {
      id: 'news-1',
      path: 'content/daily-news/2026/09/news-1.json',
      title: 'Test',
      date: '2026-09-21',
      level: 'B1',
      themes: ['learning'],
    },
  ],
};

const article = {
  schemaVersion: 1,
  type: 'newsArticle',
  id: 'news-1',
  title: 'Test',
  date: '2026-09-21',
  level: 'B1',
  themes: ['learning'],
  source: {
    title: 'Source',
    publisher: 'AtlasNorsk',
    url: 'https://example.com',
    language: 'en',
  },
  sections: [{ id: 's1', norsk: 'Dette er en test.' }],
  vocabulary: [],
  grammar: [],
  usefulPhrases: [],
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('GitHub content provider', () => {
  it('loads the Daily News manifest from the content repository', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(manifest), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    await expect(loadDailyNewsManifest()).resolves.toEqual(manifest);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      `${CONTENT_BASE_URL}content/daily-news/manifest.json`,
    );
  });

  it('loads a news article by manifest path', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify(article), { status: 200 })),
    );

    await expect(loadNewsArticle(manifest.items[0].path)).resolves.toEqual(article);
  });

  it('rejects unsupported manifest versions', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ...manifest, schemaVersion: 2 }), { status: 200 }),
      ),
    );

    await expect(loadDailyNewsManifest()).rejects.toThrow('Unsupported Daily News manifest');
  });

  it('rejects unsupported article types', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ...article, type: 'note' }), { status: 200 }),
      ),
    );

    await expect(loadNewsArticle(manifest.items[0].path)).rejects.toThrow('Unsupported news article');
  });

  it('surfaces HTTP failures with the requested path', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 404 })),
    );

    await expect(loadNewsArticle('missing.json')).rejects.toThrow(
      'Content request failed: 404 missing.json',
    );
  });
});
