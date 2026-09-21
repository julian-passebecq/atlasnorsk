export type ResourceType =
  | 'translation'
  | 'news'
  | 'vocabulary'
  | 'cheatsheet'
  | 'grammar'
  | 'tablebook'
  | 'phrases'
  | 'course'
  | 'note';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'Unknown';

export type VocabularyType =
  | 'Noun'
  | 'Verb'
  | 'Verb expression'
  | 'Adjective'
  | 'Adverb'
  | 'Pronoun'
  | 'Preposition'
  | 'Conjunction'
  | 'Connector'
  | 'Expression'
  | 'Idiom'
  | 'Phrase';

export type LearningState = 'New' | 'Learning' | 'Review' | 'Known';

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  workspace: string;
  level?: CefrLevel;
  category?: string;
  updatedAt: string;
}

export interface VocabularyEntry {
  id: string;
  level: CefrLevel;
  category: string;
  subcategory: string;
  theme: string;
  type: VocabularyType;
  marker?: string;
  norsk: string;
  english: string;
  french: string;
  forms?: string;
  synonyms?: string[];
  antonyms?: string[];
  source?: string;
  state: LearningState;
}

export interface TranslationExample {
  original: string;
  norsk: string;
  natural?: string;
  simpler?: string;
  level: CefrLevel;
  theme: string;
}

export interface SkeletonSection {
  id: string;
  title: string;
  hint: string;
  status: 'empty' | 'filled';
  content?: string;
}

export interface CheatSheetSkeleton {
  id: string;
  title: string;
  kind: 'Grammar' | 'Verb' | 'Connector' | 'Topic';
  level: CefrLevel;
  sections: SkeletonSection[];
}
