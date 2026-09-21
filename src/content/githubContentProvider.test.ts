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

    await expect(loadNewsArticle(manifest.items[0].path, manifest.items[0])).resolves.toEqual(article);
  });

  it('rejects an article whose metadata does not match its manifest entry', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ...article, title: 'Different title' }), { status: 200 }),
      ),
    );

    await expect(
      loadNewsArticle(manifest.items[0].path, manifest.items[0]),
    ).rejects.toThrow('News article metadata does not match manifest');
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

  it('rejects manifest paths outside the Daily News content tree', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ...manifest,
            items: [{ ...manifest.items[0], path: 'https://example.com/evil.json' }],
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(loadDailyNewsManifest()).rejects.toThrow('Invalid Daily News manifest item');
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

  it('rejects unsafe source URL protocols', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ...article,
            source: { ...article.source, url: 'javascript:alert(1)' },
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(loadNewsArticle(manifest.items[0].path)).rejects.toThrow('Invalid news article');
  });

  it('rejects malformed nested vocabulary entries', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ...article,
            vocabulary: [{ term: 'øving', type: 'Noun', level: 'B3', english: 'practice', french: 'entraînement' }],
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(loadNewsArticle(manifest.items[0].path)).rejects.toThrow('Invalid news article vocabulary');
  });

  it('rejects malformed grammar entries', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ...article,
            grammar: [{ topic: 'V2', example: '' }],
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(loadNewsArticle(manifest.items[0].path)).rejects.toThrow('Invalid news article grammar');
  });

  it('rejects malformed useful phrases', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            ...article,
            usefulPhrases: [{ norsk: 'i tillegg', english: 'in addition', french: '' }],
          }),
          { status: 200 },
        ),
      ),
    );

    await expect(loadNewsArticle(manifest.items[0].path)).rejects.toThrow('Invalid news article phrase');
  });

  it('rejects structurally incomplete articles', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ...article, sections: undefined }), { status: 200 }),
      ),
    );

    await expect(loadNewsArticle(manifest.items[0].path)).rejects.toThrow('Invalid news article');
  });

  it('does not let manifest-mismatched remote content overwrite the last-known-good cache', async () => {
    const cache = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => cache.get(key) ?? null,
      setItem: (key: string, value: string) => cache.set(key, value),
    });

    const mismatched = { ...article, title: 'Wrong title' };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(article), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify(mismatched), { status: 200 }))
      .mockRejectedValueOnce(new Error('offline'));
    vi.stubGlobal('fetch', fetchMock);

    await expect(
      loadNewsArticle(manifest.items[0].path, manifest.items[0]),
    ).resolves.toEqual(article);

    await expect(
      loadNewsArticle(manifest.items[0].path, manifest.items[0]),
    ).resolves.toEqual(article);

    await expect(
      loadNewsArticle(manifest.items[0].path, manifest.items[0]),
    ).resolves.toEqual(article);
  });

  it('falls back to last-known-good cached content when new remote JSON is malformed', async () => {
    const cache = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => cache.get(key) ?? null,
      setItem: (key: string, value: string) => cache.set(key, value),
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(manifest), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ...manifest, schemaVersion: 2 }), { status: 200 }),
      );
    vi.stubGlobal('fetch', fetchMock);

    await expect(loadDailyNewsManifest()).resolves.toEqual(manifest);
    await expect(loadDailyNewsManifest()).resolves.toEqual(manifest);
  });

  it('falls back to last-known-good cached content on network failure', async () => {
    const cache = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => cache.get(key) ?? null,
      setItem: (key: string, value: string) => cache.set(key, value),
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(manifest), { status: 200 }))
      .mockRejectedValueOnce(new Error('offline'));
    vi.stubGlobal('fetch', fetchMock);

    await expect(loadDailyNewsManifest()).resolves.toEqual(manifest);
    await expect(loadDailyNewsManifest()).resolves.toEqual(manifest);
  });

  it('surfaces HTTP failures when no cached copy exists', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('', { status: 404 })),
    );

    await expect(loadNewsArticle('missing.json')).rejects.toThrow(
      'Content request failed: 404 missing.json',
    );
  });
});
