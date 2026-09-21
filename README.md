# AtlasNorsk

AtlasNote-style local-first Norwegian learning workspace built with React and Fluent UI 2.

The product is organized around durable resources (translations, vocabulary, grammar, cheat sheets, phrase packs, course notes and native reference tables), document tabs and flexible panes. AI is a content engine, not the primary navigation model.

## Current foundation

- left Library / center workspace / right Norsk Inspector;
- document tabs and optional split reference pane;
- Translation document;
- structured trilingual Vocabulary database;
- first-class Grammar knowledge base;
- semantic Cheat Sheet skeletons;
- three curated native **Table Books** with workbook-style tabs;
- offline XLSX/XLSM → Table Book conversion utility.

## Spreadsheet rule

AtlasNorsk does **not** embed Excel.

We keep at most a few high-value reference books:
1. A2–B1 Core Vocabulary;
2. B2 Toolbox;
3. Grammar & Word Formation.

Other spreadsheet material is converted into its natural AtlasNorsk resource type: Vocabulary, Grammar, Phrase/Oral, Course or Cheat Sheet.

See `docs/CONTENT_IMPORT_AUDIT.md` for the uploaded-content audit and `tools/import_tablebook.py` for the offline converter.


## Live content repository

AtlasNorsk reads AI-generated learning content from:

https://github.com/julian-passebecq/atlasnorsk-content

Daily News is fetched at runtime from the `main` branch manifest, so publishing a new validated JSON article does not require rebuilding the application.

The content repository owns:
- daily news articles;
- future vocabulary/grammar content packs;
- table-book payloads;
- phrase packs;
- course content;
- content schemas and validation.

The application repository owns UI, local workspace state, rendering and editing behavior.
