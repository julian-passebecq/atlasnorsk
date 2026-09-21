import type { CefrLevel } from './model';

export type GrammarGroup =
  | 'Sentence structure'
  | 'Verbs'
  | 'Nouns'
  | 'Adjectives'
  | 'Adverbs'
  | 'Pronouns'
  | 'Prepositions'
  | 'Connectors'
  | 'Word formation'
  | 'Irregularities';

export interface GrammarTopic {
  id: string;
  title: string;
  group: GrammarGroup;
  level: CefrLevel;
  summary: string;
  patterns: string[];
  examples: string[];
  relatedTableBook?: string;
}

export const grammarGroups: GrammarGroup[] = [
  'Sentence structure',
  'Verbs',
  'Nouns',
  'Adjectives',
  'Adverbs',
  'Pronouns',
  'Prepositions',
  'Connectors',
  'Word formation',
  'Irregularities',
];

export const grammarTopics: GrammarTopic[] = [
  {
    id: 'grammar-v2',
    title: 'V2 word order',
    group: 'Sentence structure',
    level: 'B1',
    summary: 'Finite verb stays in second position in Norwegian main clauses, including after a fronted adverbial.',
    patterns: ['Subject + verb + …', 'Adverbial + verb + subject + …'],
    examples: ['Jeg jobber hjemme i dag.', 'I dag jobber jeg hjemme.'],
  },
  {
    id: 'grammar-subordinate-order',
    title: 'Subordinate-clause word order',
    group: 'Sentence structure',
    level: 'B1',
    summary: 'Negation and many sentence adverbs normally come before the finite verb in subordinate clauses.',
    patterns: ['fordi + subject + ikke + verb', 'hvis + subject + kanskje + verb'],
    examples: ['Jeg dro hjem fordi jeg ikke følte meg bra.'],
  },
  {
    id: 'grammar-verb-groups',
    title: 'Verb groups and strong verbs',
    group: 'Verbs',
    level: 'B1',
    summary: 'Learn productive weak-verb groups separately from strong and irregular high-frequency verbs.',
    patterns: ['G1: -et', 'G2: -te / -de', 'G3: -de', 'Strong: vowel change'],
    examples: ['å snakke – snakker – snakket – har snakket', 'å gå – går – gikk – har gått'],
    relatedTableBook: 'tablebook-grammar-patterns',
  },
  {
    id: 'grammar-fixed-verbs',
    title: 'Reflexive and fixed-preposition verbs',
    group: 'Verbs',
    level: 'B2',
    summary: 'Store the entire expression as one learning unit instead of memorizing the verb alone.',
    patterns: ['glede seg til', 'avhenge av', 'advare mot'],
    examples: ['Jeg gleder meg til å begynne.', 'Det avhenger av situasjonen.'],
    relatedTableBook: 'tablebook-grammar-patterns',
  },
  {
    id: 'grammar-noun-gender',
    title: 'Noun gender and declension',
    group: 'Nouns',
    level: 'B1',
    summary: 'Learn en/ei/et together with singular and plural forms; use ending tendencies only as support.',
    patterns: ['en bil – bilen – biler – bilene', 'et barn – barnet – barn – barna'],
    examples: ['Jeg kjøpte en bil.', 'Barna leker ute.'],
    relatedTableBook: 'tablebook-grammar-patterns',
  },
  {
    id: 'grammar-adjective-agreement',
    title: 'Adjective agreement',
    group: 'Adjectives',
    level: 'B1',
    summary: 'Adjectives change with gender, number and definiteness; comparison adds another form family.',
    patterns: ['stor – stort – store', 'fin – finere – finest'],
    examples: ['et stort hus', 'de store husene'],
    relatedTableBook: 'tablebook-grammar-patterns',
  },
  {
    id: 'grammar-adverbs',
    title: 'Sentence adverbs and stance',
    group: 'Adverbs',
    level: 'B2',
    summary: 'Use adverbs to express certainty, probability, emphasis and source while respecting word order.',
    patterns: ['kanskje', 'sannsynligvis', 'angivelig', 'imidlertid'],
    examples: ['Det er sannsynligvis riktig.'],
    relatedTableBook: 'tablebook-b2-toolbox',
  },
  {
    id: 'grammar-pronouns',
    title: 'Pronouns and reference',
    group: 'Pronouns',
    level: 'B1',
    summary: 'Keep subject, object, possessive and reflexive forms distinct and track what each pronoun refers to.',
    patterns: ['jeg – meg – min', 'han – ham – hans', 'seg / sin / sitt / sine'],
    examples: ['Hun tok med seg boka si.'],
  },
  {
    id: 'grammar-prepositions',
    title: 'Prepositions and fixed combinations',
    group: 'Prepositions',
    level: 'B2',
    summary: 'Many combinations are lexical rather than directly predictable from English or French.',
    patterns: ['interessert i', 'avhengig av', 'enig med', 'bekymret for'],
    examples: ['Jeg er interessert i språk.'],
    relatedTableBook: 'tablebook-b2-toolbox',
  },
  {
    id: 'grammar-connectors',
    title: 'Connectors and sentence binding',
    group: 'Connectors',
    level: 'B2',
    summary: 'Classify connectors by rhetorical function and pair meaning with syntax and register.',
    patterns: ['i tillegg', 'derfor', 'derimot', 'likevel', 'på den andre siden'],
    examples: ['Tiltaket er billig. Dessuten er det lett å gjennomføre.'],
    relatedTableBook: 'tablebook-b2-toolbox',
  },
  {
    id: 'grammar-derivation',
    title: 'Word formation and derivation',
    group: 'Word formation',
    level: 'B2',
    summary: 'Learn recurring noun, verb and adjective families by suffix and structural pattern.',
    patterns: ['verb → -ing/-ning noun', 'adjective → -het noun', 'compound nouns follow final-element gender'],
    examples: ['å forske → forskning', 'fri → frihet', 'sove + rom → soverom'],
    relatedTableBook: 'tablebook-grammar-patterns',
  },
  {
    id: 'grammar-irregulars',
    title: 'Irregularities and exam traps',
    group: 'Irregularities',
    level: 'B2',
    summary: 'Keep a short must-memorize set separate from the full grammar database.',
    patterns: ['få – får – fikk – har fått', 'gå – går – gikk – har gått', 'barn – barnet – barn – barna'],
    examples: ['Hun fikk jobben.', 'Barna har gått hjem.'],
    relatedTableBook: 'tablebook-grammar-patterns',
  },
];
