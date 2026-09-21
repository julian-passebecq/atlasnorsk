export interface TableBookRow {
  kind?: 'data' | 'section';
  cells: string[];
}

export interface TableBookTab {
  id: string;
  title: string;
  columns: string[];
  rows: TableBookRow[];
  note?: string;
}

export interface TableBook {
  id: string;
  title: string;
  level: string;
  source: string;
  description: string;
  tabs: TableBookTab[];
}

export const tableBooks: TableBook[] = [
  {
    id: 'tablebook-a2b1-core',
    title: 'A2–B1 Core Vocabulary',
    level: 'A2–B1',
    source: 'NorskV1.xlsx',
    description: 'Canonical A2/B1 vocabulary source because it includes level membership, chapters, difficulty, lexical type, forms, phonetics, English and French.',
    tabs: [
      {
        id: 'core',
        title: 'Core vocabulary',
        columns: ['Level', 'Category', 'Subcategory', 'Type', 'Marker', 'Norsk', 'English', 'French', 'Forms'],
        rows: [
          { cells: ['B1', 'Business', 'Finance & taxation', 'Noun', 'et', 'abonnement', 'subscription, plan', 'abonnement', 'et abonnement · abonnementet · abonnementer · abonnementene'] },
          { cells: ['A2 · B1', 'Communication', 'Conversation & stance', 'Adverb', '—', 'absolutt', 'absolutely, definitely', 'absolument, tout à fait', '—'] },
          { cells: ['A2', 'Documents', 'Forms & paperwork', 'Noun', 'en', 'administrasjon', 'administration', 'administration', 'en administrasjon · administrasjonen · administrasjoner · administrasjonene'] },
          { cells: ['B1', 'Work', 'Work tasks & organization', 'Verb', 'å', 'administrere', 'administer, manage, run', 'administrer, gérer', 'administrerer · administrerte · har administrert'] },
          { cells: ['B1', 'Family', 'Pregnancy & early life', 'Noun', 'en', 'adopsjon', 'adoption', 'adoption', 'en adopsjon · adopsjonen · adopsjoner · adopsjonene'] },
        ],
      },
      {
        id: 'grammar-vocab',
        title: 'Grammar vocabulary',
        columns: ['Type', 'Norsk', 'English', 'French', 'Function'],
        rows: [
          { cells: ['Adverb', 'absolutt', 'absolutely / definitely', 'absolument', 'certainty / emphasis'] },
          { cells: ['Phrase', 'i tillegg', 'in addition', 'en plus', 'addition'] },
          { cells: ['Adverb', 'aldri', 'never', 'jamais', 'frequency / time'] },
        ],
      },
      {
        id: 'expressions',
        title: 'Expressions',
        columns: ['Norsk', 'English', 'French', 'Use'],
        rows: [
          { cells: ['Hvordan går det?', 'How is it going?', 'Comment ça va ?', 'Everyday question'] },
          { cells: ['Hva skal du gjøre i dag?', 'What are you going to do today?', 'Qu’est-ce que tu vas faire aujourd’hui ?', 'Everyday question'] },
          { cells: ['å drive', 'to run / manage', 'gérer', 'Verb expression'] },
        ],
      },
    ],
  },
  {
    id: 'tablebook-b2-toolbox',
    title: 'B2 Toolbox',
    level: 'B2',
    source: 'Toolbox_v121_norsk_purple.xlsx',
    description: 'Consolidated B2 reference for connectors, grammar terms, adverbs, adjectives, prepositions, text composition and thematic vocabulary.',
    tabs: [
      {
        id: 'core-b2',
        title: 'Core B2',
        columns: ['Function', 'English / French', 'Norsk', 'Use / nuance', 'Model sentence'],
        rows: [
          { cells: ['Addition', 'in addition / en plus', 'i tillegg', 'Add another point.', 'Dette er dyrt, og i tillegg tar det lang tid.'] },
          { cells: ['Addition', 'moreover / de plus', 'dessuten', 'Add a stronger extra argument.', 'Tiltaket er billig. Dessuten er det lett å gjennomføre.'] },
          { cells: ['Consequence', 'therefore / donc', 'derfor', 'Cause before result.', 'Mange mangler informasjon. Derfor blir valget vanskelig.'] },
        ],
      },
      {
        id: 'connectors',
        title: 'Connectors',
        columns: ['Type', 'Meaning', 'Norsk', 'Synonyms', 'Contrast'],
        rows: [
          { kind: 'section', cells: ['Addition and continuation', '', '', '', ''] },
          { cells: ['Conjunction', 'and / et', 'og', 'samt · i tillegg', 'men'] },
          { cells: ['Connector', 'in addition / en plus', 'i tillegg', 'dessuten · også · attpåtil', '—'] },
        ],
      },
      {
        id: 'adverbs',
        title: 'Adverbs',
        columns: ['Meaning', 'Norsk', 'Synonyms', 'Antonyms'],
        rows: [
          { kind: 'section', cells: ['Certainty, assumption and source', '', '', ''] },
          { cells: ['allegedly / prétendument', 'angivelig', 'etter sigende · visstnok', 'bekreftet · dokumentert'] },
          { cells: ['presumably / probablement', 'formodentlig', 'sannsynligvis · antakelig', 'neppe'] },
          { cells: ['maybe / peut-être', 'kanskje', 'muligens · kan hende', 'helt sikkert · absolutt'] },
        ],
      },
      {
        id: 'grammar-terms',
        title: 'Grammar terms',
        columns: ['Type', 'Explanation', 'Norsk', 'Related'],
        rows: [
          { kind: 'section', cells: ['Punctuation and writing rules', '', '', ''] },
          { cells: ['Noun', 'quotation marks / guillemets', 'anførselstegn', 'hermetegn · sitattegn'] },
          { cells: ['Noun', 'quotation marks / guillemets', 'hermetegn', 'anførselstegn · sitattegn'] },
        ],
      },
      {
        id: 'text-composition',
        title: 'Text composition',
        columns: ['Type', 'Explanation', 'Norsk', 'Synonyms', 'Antonyms'],
        rows: [
          { kind: 'section', cells: ['Cause, consequence and usefulness', '', '', '', ''] },
          { cells: ['Verb', 'decrease, subside / diminuer', 'avta', 'minke · synke', 'øke · tilta'] },
        ],
      },
    ],
  },
  {
    id: 'tablebook-grammar-patterns',
    title: 'Grammar & Word Formation',
    level: 'B1–B2',
    source: 'Composite: noun/adjective patterns + NORA exam irregulars + derivation families',
    description: 'One native grammar reference replacing several overlapping XLSX files. It keeps pattern tabs, not spreadsheet formatting.',
    tabs: [
      {
        id: 'noun-patterns',
        title: 'Noun patterns',
        columns: ['Pattern', 'Gender', 'Indefinite SG', 'Definite SG', 'Indefinite PL', 'Definite PL', 'Note'],
        rows: [
          { cells: ['regular en', 'en', 'en bil', 'bilen', 'biler', 'bilene', 'Most common masculine/common pattern.'] },
          { kind: 'section', cells: ['High-risk irregulars', '', '', '', '', '', ''] },
          { cells: ['barn pattern', 'et', 'et barn', 'barnet', 'barn', 'barna', 'Must memorize.'] },
        ],
      },
      {
        id: 'adjective-agreement',
        title: 'Adjective agreement',
        columns: ['Pattern', 'Norsk', 'English', 'm/f', 'Neuter', 'Plural/definite', 'Comparative', 'Superlative'],
        rows: [
          { cells: ['-t / -e', 'stor', 'large', 'stor', 'stort', 'store', 'større', 'størst'] },
          { cells: ['-ere / -est', 'fin', 'nice', 'fin', 'fint', 'fine', 'finere', 'finest'] },
          { cells: ['Determiner trap', 'all', 'all', 'all', 'alt', 'alle', '—', '—'] },
        ],
      },
      {
        id: 'verb-irregulars',
        title: 'Verb forms & irregulars',
        columns: ['Norsk', 'English', 'Infinitive', 'Present', 'Past', 'Perfect', 'Pattern'],
        rows: [
          { cells: ['å få', 'get / receive', 'å få', 'får', 'fikk', 'har fått', 'Strong / must memorize'] },
          { cells: ['å gå', 'go', 'å gå', 'går', 'gikk', 'har gått', 'Strong / must memorize'] },
          { cells: ['å advare mot', 'warn against', 'å advare mot', 'advarer mot', 'advarte mot', 'har advart mot', 'Fixed preposition'] },
        ],
      },
      {
        id: 'word-formation',
        title: 'Word formation',
        columns: ['Family / ending', 'Direction', 'Base', 'Related', 'Rule / trap'],
        rows: [
          { cells: ['-ing / -ning', 'Verb → noun', 'å forske', 'forskning', 'Often process/result nouns.'] },
          { cells: ['-het', 'Adjective → noun', 'fri', 'frihet', 'Common abstract-noun family.'] },
          { cells: ['Compound', 'Words → compound noun', 'sove + rom', 'soverom', 'Gender and plural follow the final element.'] },
        ],
      },
      {
        id: 'connector-transforms',
        title: 'Connector transformations',
        columns: ['Pattern', 'English', 'Syntax', 'Skeleton', 'Example'],
        rows: [
          { cells: ['av den grunn', 'for that reason', 'Adverbial phrase: V2 after phrase.', 'Av den grunn + verb + subject …', 'Av den grunn ble et nytt prosjekt startet.'] },
        ],
      },
    ],
  },
];

export function tableBookForResource(id: string): TableBook | undefined {
  return tableBooks.find((book) => book.id === id);
}
