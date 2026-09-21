import type { VocabularyEntry } from './model';

export function subcategoriesForCategory(
  entries: VocabularyEntry[],
  category: string,
): string[] {
  const values = entries
    .filter((entry) => category === 'All' || entry.category === category)
    .map((entry) => entry.subcategory);

  return [...new Set(values)];
}
