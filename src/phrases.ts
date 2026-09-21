export interface PhraseEntry {
  id: string;
  section: 'Core B2' | 'Fixed expressions' | 'Oral listening' | 'Academic/news' | 'Nuance';
  form?: string;
  norsk: string;
  english: string;
  type: string;
  use: string;
  example: string;
  priority: 'High' | 'Medium' | 'Low';
}

export const oralListeningPhrases: PhraseEntry[] = [
  {
    id: 'oral-anbefale',
    section: 'Core B2',
    form: 'å',
    norsk: 'anbefale',
    english: 'to recommend',
    type: 'verb',
    use: 'opinion / advice',
    example: 'Jeg anbefaler å høre på podkaster.',
    priority: 'High',
  },
  {
    id: 'oral-finne-ut',
    section: 'Core B2',
    form: 'å',
    norsk: 'finne ut',
    english: 'to find out',
    type: 'verb phrase',
    use: 'learning / listening',
    example: 'Vi må finne ut hva som skjedde.',
    priority: 'High',
  },
  {
    id: 'oral-det-stemmer',
    section: 'Fixed expressions',
    norsk: 'det stemmer',
    english: "that's right",
    type: 'confirmation',
    use: 'agreement',
    example: 'Ja, det stemmer.',
    priority: 'High',
  },
  {
    id: 'oral-rett-og-slett',
    section: 'Fixed expressions',
    norsk: 'rett og slett',
    english: 'simply / quite simply',
    type: 'spoken marker',
    use: 'emphasis',
    example: 'Det er rett og slett vanskelig.',
    priority: 'High',
  },
  {
    id: 'oral-altsa',
    section: 'Oral listening',
    norsk: 'altså',
    english: 'so / I mean',
    type: 'spoken marker',
    use: 'thinking / clarifying',
    example: 'Altså, jeg mener at ...',
    priority: 'High',
  },
  {
    id: 'oral-egentlig',
    section: 'Oral listening',
    norsk: 'egentlig',
    english: 'actually / really',
    type: 'spoken marker',
    use: 'contrast / clarification',
    example: 'Hva mener du egentlig?',
    priority: 'High',
  },
  {
    id: 'oral-for-a-si-det-sann',
    section: 'Oral listening',
    norsk: 'for å si det sånn',
    english: 'to put it that way',
    type: 'spoken marker',
    use: 'emphasis',
    example: 'Det var krevende, for å si det sånn.',
    priority: 'High',
  },
  {
    id: 'oral-fellesskap',
    section: 'Academic/news',
    form: 'et',
    norsk: 'fellesskap',
    english: 'community',
    type: 'noun',
    use: 'society',
    example: 'Språk skaper fellesskap.',
    priority: 'High',
  },
  {
    id: 'oral-integrering',
    section: 'Academic/news',
    form: 'en',
    norsk: 'integrering',
    english: 'integration',
    type: 'noun',
    use: 'society',
    example: 'Språk er viktig for integrering.',
    priority: 'High',
  },
  {
    id: 'oral-akkurat',
    section: 'Nuance',
    norsk: 'akkurat',
    english: 'exactly / precisely / just',
    type: 'spoken marker',
    use: 'precision / agreement',
    example: 'Det er akkurat det jeg mener.',
    priority: 'High',
  },
  {
    id: 'oral-nettopp-derfor',
    section: 'Nuance',
    norsk: 'det er nettopp derfor',
    english: 'that is precisely why',
    type: 'spoken connector',
    use: 'emphasis / explanation',
    example: 'Det er nettopp derfor vi må øve mer.',
    priority: 'High',
  },
];

export const phraseSections = ['All', 'Core B2', 'Fixed expressions', 'Oral listening', 'Academic/news', 'Nuance'] as const;
