# Uploaded Norsk content audit

## Decision

AtlasNorsk should **not** become an Excel application.

XLSX/XLSM is treated as an import/source format. Useful workbooks are converted to native **Table Book** resources with:
- tabs;
- searchable/filterable rows;
- semantic links to Vocabulary and Grammar;
- no macros, formulas, workbook navigation sheets or duplicated A-Z aggregate sheets.

## Canonical table books

### 1. A2–B1 Core Vocabulary
Source: `NorskV1.xlsx`

Why:
- explicit A2 and B1 membership;
- A2/B1 chapter and subchapter references;
- difficulty;
- category/subcategory/sub-subcategory;
- lexical type and marker;
- Bokmål/English/French;
- forms, phonetics, synonyms, antonyms, lexical relations and irregularity notes.

This is more useful to AtlasNorsk than keeping several parallel A2/B1 vocabulary workbooks.

### 2. B2 Toolbox
Source: `Toolbox_v121_norsk_purple.xlsx`

Keep the semantically useful sheets:
- Core B2;
- General / Basic;
- Grammatikk terms;
- Connectors;
- Adv / Adj / Prep;
- Time / Quantity;
- Text Composition;
- thematic society/work/environment/etc. sheets.

Do not preserve `All A-Z` as a separate permanent copy because AtlasNorsk can synthesize an alphabetical view.

### 3. Grammar & Word Formation
Native composite from:
- `HerPa_B2_substantiv_adjektiv_patterns_7sheets_v8_dating_exam_improved.xlsx`;
- `NORA0130_B2_exam_grammar_irregulars_study_friendly_v6_final_clean.xlsx`;
- `Her_pa_berget_bokmal_derivation_families_v6_by_pattern (1).xlsx`.

This is deliberately one resource. It combines complementary material:
- noun declension and gender;
- adjective agreement/comparison/traps;
- strong/irregular verbs;
- fixed-preposition/reflexive verbs;
- word families;
- derivation;
- connector transformations.

QA/raw-metadata sheets are not learning tabs.

## Convert to other native resource types

### Oral/listening
`Her_pa_berget_oral_listening_cheatsheet_reorganized_v12_subcategory_pass.xlsx`

Convert to a **Phrase / Oral** collection, not a Table Book.

### Idioms
`Idiom_v13_rich_formatting_restored.xlsx`

Convert to the Phrase/Idiom entity store. Do not keep as another permanent workbook.

### Her på berget detailed glossary
`Her_pa_berget_detailed_glossary_v149_grammatikk_structured.xlsx`

Use as chapter/course content feeding the 12 Her på berget course resources. Do not expose its giant A-Z sheet as a fourth workbook.

### Ord og begrep B1/B2
`Ord_og_begrep_B1_B2_v3_rich_formatting_restored.xlsx`

Merge unique concepts into Vocabulary. It overlaps enough with the canonical vocabulary sources that a permanent workbook would add clutter.

### Main_Vocab v64
`Main_Vocab_v64_rich_formatting_restored.xlsx`

Useful as a QA/fallback source and for filling missing definitions/forms. It overlaps heavily with B2 Toolbox, so it should not become another top-level table book.

## Duplicate archive finding

Several B2 workbooks are byte-identical across the uploaded B2/docB2/diversB2 ZIPs. Archive location is therefore not a content identity. Imports should deduplicate by content hash/source identity.

## Grammar information architecture

Grammar is a first-class library category, separate from words whose lexical category happens to be `GRAMMAR`.

Top-level grammar groups:
1. Sentence structure
2. Verbs
3. Nouns
4. Adjectives
5. Adverbs
6. Pronouns
7. Prepositions
8. Connectors
9. Word formation
10. Irregularities

Each grammar topic can reference rows in Vocabulary or a Table Book without copying them.
