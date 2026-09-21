import { describe, expect, it } from 'vitest';
import { vocabulary } from './data';
import { subcategoriesForCategory } from './vocabularyState';

describe('vocabulary filter state', () => {
  it('limits subcategories to the selected category', () => {
    expect(subcategoriesForCategory(vocabulary, 'Grammar')).toEqual(['Connectors']);
    expect(subcategoriesForCategory(vocabulary, 'Work')).toEqual(['Starting a job']);
  });

  it('returns all unique subcategories for the All category', () => {
    expect(subcategoriesForCategory(vocabulary, 'All')).toEqual([
      'Transport',
      'Time',
      'Connectors',
      'Starting a job',
    ]);
  });
});
