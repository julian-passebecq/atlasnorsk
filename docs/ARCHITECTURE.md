# AtlasNorsk architecture

## Product boundary

AtlasNorsk is a local-first Norwegian learning workspace derived from the successful workspace ideas in AtlasNote, not a fork of AtlasNote's PDF product.

The primary navigation unit is a durable resource, never an AI conversation.

## Reused ideas from AtlasNote

- document tabs inside a workspace;
- optional two-pane compare/reference mode;
- persistent library on the left;
- resource-specific context surface on the right;
- compact desktop density;
- resources can be referenced by more than one learning context.

PDF, browser, archive-provider and V2/V3 durability machinery are intentionally excluded from this repository.

## Useful findings from Fluent2_J_Norsk

The old repository is a donor, not the foundation.

Keep:
- Bokmål/English/French vocabulary;
- accent-folded search (æ/ø/å);
- compact vocabulary rows;
- learning states;
- theme filtering;
- printable cheat-sheet thinking;
- accessibility and responsive QA patterns.

Replace:
- Datapass workspace dependencies;
- French sidecar workaround;
- challenge-shaped progress adapter;
- single-page Browse/Cheats/Review navigation.

## Domain model

Resource types:

- translation
- vocabulary
- cheatsheet
- grammar
- table book
- phrase collection
- course note
- generic note

Vocabulary is a structured entity store, with CEFR level, category, subcategory, theme, lexical type, translations, forms, relationships and learning state.

Cheat sheets use semantic skeleton slots. An empty B2-example slot is data, not an empty paragraph. This lets AI fill or improve one part without rewriting unrelated content.

## AI boundary

AI actions are commands against resources:

- Translate
- Correct
- Naturalize
- Simplify
- Explain
- Extract
- Classify
- Fill skeleton slot

The inspector exposes these commands in context. A generic chat transcript is not the product model.

## Near-term milestones

1. Foundation shell and static domain fixtures.
2. Local persistence for resources/tabs/workspaces.
3. Block editor and skeleton-slot editing.
4. Import the 215 legacy professional-vocabulary records into the new vocabulary schema.
5. AI provider abstraction and structured JSON responses.
6. Export/import and QA.


## Table Books instead of Excel runtime

AtlasNorsk does not embed Excel. XLSX/XLSM is an import format only.

A Table Book preserves the useful spreadsheet affordances:
- multiple named tabs;
- dense rows;
- search/filter;
- row-to-vocabulary and row-to-grammar actions.

It intentionally drops:
- macros;
- formulas as behavior;
- workbook navigation sheets;
- styling as semantic data;
- duplicated A-Z aggregate sheets when the app can synthesize that view.

The current canonical conversion strategy is documented in `docs/CONTENT_IMPORT_AUDIT.md`.

## Grammar as first-class knowledge

Grammar is not a vocabulary tag. It has its own topic hierarchy:
- sentence structure;
- verbs;
- nouns;
- adjectives;
- adverbs;
- pronouns;
- prepositions;
- connectors;
- word formation;
- irregularities.

Grammar topics can reference vocabulary entities or Table Book rows without copying the underlying material.
