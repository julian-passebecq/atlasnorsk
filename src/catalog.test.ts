import { describe, expect, it } from 'vitest';
import { vocabulary } from './data';

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
});
