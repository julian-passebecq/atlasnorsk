import { describe, expect, it } from 'vitest';
import { resources, vocabulary } from './data';
import { grammarTopics } from './grammar';
import { tableBooks, tableBookForResource } from './tablebooks';

function normalize(value: string) {
  return value
    .toLocaleLowerCase('nb-NO')
    .replaceAll('æ', 'ae')
    .replaceAll('ø', 'o')
    .replaceAll('å', 'a')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

describe('AtlasNorsk seed model', () => {
  it('keeps resource ids unique and required resource fields non-empty', () => {
    expect(new Set(resources.map((resource) => resource.id)).size).toBe(resources.length);
    expect(resources.every((resource) =>
      resource.id.trim()
      && resource.title.trim()
      && resource.workspace.trim()
      && resource.updatedAt.trim(),
    )).toBe(true);
  });

  it('keeps startup resources addressable by stable ids', () => {
    expect(resources.find((resource) => resource.id === 'translation-daily')?.type).toBe('translation');
    expect(resources.find((resource) => resource.id === 'news-daily')?.type).toBe('news');
    expect(resources.find((resource) => resource.id === 'vocab-transport')?.type).toBe('vocabulary');
  });

  it('keeps stable unique vocabulary ids', () => {
    expect(new Set(vocabulary.map((entry) => entry.id)).size).toBe(vocabulary.length);
  });

  it('supports norwegian accent-folded lookup', () => {
    expect(normalize('forsinket')).toContain('forsinket');
    expect(normalize('stå')).toBe('sta');
    expect(normalize('søke')).toBe('soke');
  });

  it('has trilingual values for every seed term', () => {
    expect(vocabulary.every((entry) => entry.norsk && entry.english && entry.french)).toBe(true);
  });
  it('keeps grammar topic ids unique', () => {
    expect(new Set(grammarTopics.map((topic) => topic.id)).size).toBe(grammarTopics.length);
  });

  it('ships only the three curated reference table books', () => {
    expect(tableBooks.map((book) => book.id)).toEqual([
      'tablebook-a2b1-core',
      'tablebook-b2-toolbox',
      'tablebook-grammar-patterns',
    ]);
  });

  it('keeps table book tab ids unique inside each book', () => {
    expect(tableBooks.every((book) => new Set(book.tabs.map((tab) => tab.id)).size === book.tabs.length)).toBe(true);
  });

  it('keeps table book catalog resources and payloads in one-to-one sync', () => {
    const resourceIds = resources
      .filter((resource) => resource.type === 'tablebook')
      .map((resource) => resource.id)
      .sort();
    const payloadIds = tableBooks.map((book) => book.id).sort();

    expect(resourceIds).toEqual(payloadIds);
    expect(resourceIds.every((id) => tableBookForResource(id))).toBe(true);
  });
});
