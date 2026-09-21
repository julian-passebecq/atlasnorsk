import { useMemo, useState, type ReactNode } from 'react';
import {
  Badge,
  Button,
  Divider,
  Input,
  Select,
  Tooltip,
} from '@fluentui/react-components';
import {
  Add20Regular,
  AppsList20Regular,
  BookOpen20Regular,
  ChevronDown16Regular,
  Dismiss16Regular,
  Document20Regular,
  Edit20Regular,
  Filter20Regular,
  Flash20Regular,
  Grid20Regular,
  Library20Regular,
  PanelRight20Regular,
  Search20Regular,
  SplitHorizontal20Regular,
  TextBulletList20Regular,
} from '@fluentui/react-icons';
import { connectorSkeleton, resources, translation, vocabulary } from './data';
import { grammarGroups, grammarTopics } from './grammar';
import { oralListeningPhrases, phraseSections } from './phrases';
import { tableBookForResource } from './tablebooks';
import { NewsDocument } from './news';
import { nextActiveResourceAfterClose, preferredResourceForWorkspace, resourcesForWorkspace } from './workspaceState';
import type { CefrLevel, Resource, ResourceType, VocabularyEntry, VocabularyType } from './model';

const workspaces = ['Daily Norwegian', 'B2 Preparation', 'Her på berget', 'Work Norwegian'] as const;

const resourceIcon: Record<ResourceType, ReactNode> = {
  translation: <Document20Regular />,
  news: <Document20Regular />,
  vocabulary: <AppsList20Regular />,
  cheatsheet: <TextBulletList20Regular />,
  grammar: <BookOpen20Regular />,
  tablebook: <Grid20Regular />,
  phrases: <Flash20Regular />,
  course: <Library20Regular />,
  note: <Document20Regular />,
};

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

interface FilterState {
  query: string;
  level: 'All' | CefrLevel;
  category: string;
  subcategory: string;
  type: 'All' | VocabularyType;
}

function TopBar({
  onOpen,
}: {
  onOpen: (resource: Resource) => void;
}) {
  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">N</span>
        <span>
          <strong>AtlasNorsk</strong>
          <small>Bokmål learning workspace</small>
        </span>
      </div>
      <div className="quick-input">
        <Search20Regular />
        <input aria-label="Quick translate or search" placeholder="Translate, correct or search Norwegian..." />
        <kbd>⌘ K</kbd>
      </div>
      <Button appearance="primary" icon={<Document20Regular />} onClick={() => onOpen(resources[0])}>
        Translate
      </Button>
    </header>
  );
}

function LibrarySidebar({
  activeWorkspace,
  onWorkspaceChange,
  onOpen,
}: {
  activeWorkspace: string;
  onWorkspaceChange: (workspace: string) => void;
  onOpen: (resource: Resource) => void;
}) {
  const workspaceResources = useMemo(
    () => resourcesForWorkspace(resources, activeWorkspace),
    [activeWorkspace],
  );

  const grouped = useMemo(() => {
    const byType = new Map<ResourceType, Resource[]>();
    for (const resource of workspaceResources) {
      const list = byType.get(resource.type) ?? [];
      list.push(resource);
      byType.set(resource.type, list);
    }
    return byType;
  }, [workspaceResources]);

  const sections: { type: ResourceType; label: string }[] = [
    { type: 'translation', label: 'Translations' },
    { type: 'news', label: 'Daily News' },
    { type: 'vocabulary', label: 'Vocabulary' },
    { type: 'grammar', label: 'Grammar' },
    { type: 'tablebook', label: 'Reference tables' },
    { type: 'cheatsheet', label: 'Cheat sheets' },
    { type: 'phrases', label: 'Phrase packs' },
    { type: 'course', label: 'Courses' },
  ];

  return (
    <aside className="library">
      <div className="sidebar-title">
        <Library20Regular />
        <span>Library</span>
      </div>

      <div className="workspace-switcher">
        <span className="eyebrow">WORKSPACE</span>
        <Select
          aria-label="Workspace"
          value={activeWorkspace}
          onChange={(event) => onWorkspaceChange(event.currentTarget.value)}
        >
          {workspaces.map((workspace) => <option key={workspace}>{workspace}</option>)}
        </Select>
      </div>

      <nav className="library-scroll" aria-label="Norwegian resources">
        <button className="nav-home">
          <Grid20Regular />
          <span>Today</span>
          <span className="nav-count">{workspaceResources.length}</span>
        </button>

        {sections.map(({ type, label }) => (
          <section className="tree-section" key={type}>
            <button className="tree-heading">
              <ChevronDown16Regular />
              <span>{label}</span>
              <span>{grouped.get(type)?.length ?? 0}</span>
            </button>
            {(grouped.get(type) ?? []).map((resource) => (
              <button className="tree-resource" key={resource.id} onClick={() => onOpen(resource)}>
                {resourceIcon[resource.type]}
                <span>{resource.title}</span>
                {resource.level ? <small>{resource.level}</small> : null}
              </button>
            ))}
          </section>
        ))}
      </nav>

      <div className="library-footer">
        <Button appearance="subtle" icon={<Add20Regular />} size="small">New resource</Button>
      </div>
    </aside>
  );
}

function TabStrip({
  tabs,
  activeId,
  setActive,
  closeTab,
  split,
  toggleSplit,
  onAddTab,
  canAddTab,
}: {
  tabs: Resource[];
  activeId: string;
  setActive: (id: string) => void;
  closeTab: (id: string) => void;
  split: boolean;
  toggleSplit: () => void;
  onAddTab: () => void;
  canAddTab: boolean;
}) {
  return (
    <div className="tab-strip">
      <div className="tabs" role="tablist" aria-label="Open documents">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={tab.id === activeId ? 'document-tab-shell active' : 'document-tab-shell'}
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab.id === activeId}
              className="document-tab"
              onClick={() => setActive(tab.id)}
            >
              {resourceIcon[tab.type]}
              <span>{tab.title}</span>
            </button>
            <button
              type="button"
              aria-label={`Close ${tab.title}`}
              className="tab-close"
              onClick={() => closeTab(tab.id)}
            >
              <Dismiss16Regular />
            </button>
          </div>
        ))}
        <button
          className="add-tab"
          aria-label="Open another resource"
          title={canAddTab ? 'Open next resource in this workspace' : 'All workspace resources are open'}
          onClick={onAddTab}
          disabled={!canAddTab}
        >
          <Add20Regular />
        </button>
      </div>
      <div className="tab-actions">
        <Tooltip content={split ? 'Close split pane' : 'Split workspace'} relationship="label">
          <Button appearance="subtle" icon={<SplitHorizontal20Regular />} onClick={toggleSplit} />
        </Tooltip>
      </div>
    </div>
  );
}

function TranslationDocument() {
  return (
    <article className="document translation-document">
      <header className="document-heading">
        <div>
          <span className="eyebrow">TRANSLATION · B1</span>
          <h1>Daily translation</h1>
          <p>Fast translation first. Learning detail stays available without making the document noisy.</p>
        </div>
        <div className="heading-badges">
          <Badge appearance="tint">Bokmål</Badge>
          <Badge appearance="outline">Daily life</Badge>
          <Badge appearance="outline">Transport</Badge>
        </div>
      </header>

      <div className="action-bar">
        <Button appearance="primary" icon={<Document20Regular />}>Translate</Button>
        <Button appearance="subtle" icon={<Edit20Regular />}>Correct</Button>
        <Button appearance="subtle">Natural</Button>
        <Button appearance="subtle">Simpler</Button>
        <Button appearance="subtle">Explain</Button>
        <Button appearance="subtle">Extract</Button>
      </div>

      <section className="translation-card">
        <div className="translation-label">ORIGINAL</div>
        <p className="source-sentence">{translation.original}</p>
        <Divider />
        <div className="translation-label">NORSK</div>
        <p className="norsk-sentence" lang="nb">{translation.norsk}</p>
        <p className="translation-secondary">{translation.natural}</p>
        <div className="translation-meta">
          <span>{translation.level}</span>
          <span>{translation.theme}</span>
        </div>
      </section>

      <section className="document-section">
        <div className="section-heading">
          <h2>Extracted language</h2>
          <Button appearance="subtle" size="small">Add all useful terms</Button>
        </div>
        <div className="inline-vocab-grid">
          {vocabulary.slice(0, 3).map((entry) => (
            <article className="mini-vocab" key={entry.id}>
              <div>
                <strong lang="nb">{entry.marker ? `${entry.marker} ` : ''}{entry.norsk}</strong>
                <Badge appearance="outline">{entry.level}</Badge>
              </div>
              <span>{entry.type}</span>
              <p>{entry.english}</p>
            </article>
          ))}
        </div>
      </section>
    </article>
  );
}

function VocabularyDocument() {
  const [filters, setFilters] = useState<FilterState>({
    query: '',
    level: 'All',
    category: 'All',
    subcategory: 'All',
    type: 'All',
  });
  const [selectedId, setSelectedId] = useState(vocabulary[0]?.id ?? '');

  const categories = ['All', ...new Set(vocabulary.map((entry) => entry.category))];
  const subcategories = ['All', ...new Set(vocabulary.map((entry) => entry.subcategory))];
  const types = ['All', ...new Set(vocabulary.map((entry) => entry.type))] as const;
  const rows = vocabulary.filter((entry) => {
    const query = normalize(filters.query);
    const text = normalize([entry.norsk, entry.english, entry.french, entry.category, entry.subcategory, entry.theme, entry.type].join(' '));
    return (!query || text.includes(query))
      && (filters.level === 'All' || entry.level === filters.level)
      && (filters.category === 'All' || entry.category === filters.category)
      && (filters.subcategory === 'All' || entry.subcategory === filters.subcategory)
      && (filters.type === 'All' || entry.type === filters.type);
  });
  const selected = rows.find((entry) => entry.id === selectedId) ?? rows[0];

  return (
    <article className="document vocabulary-document">
      <header className="document-heading compact">
        <div>
          <span className="eyebrow">VOCABULARY DATABASE</span>
          <h1>Vocabulary</h1>
          <p>One vocabulary entity can appear in many documents, themes and courses without duplication.</p>
        </div>
        <Badge appearance="tint">{rows.length} terms</Badge>
      </header>

      <div className="filter-bar">
        <Input
          contentBefore={<Search20Regular />}
          value={filters.query}
          onChange={(_, data) => setFilters({ ...filters, query: data.value })}
          placeholder="Search NO, EN, FR, theme..."
        />
        <label>Level
          <Select value={filters.level} onChange={(event) => setFilters({ ...filters, level: event.currentTarget.value as FilterState['level'] })}>
            {['All', 'A1', 'A2', 'B1', 'B2', 'C1'].map((value) => <option key={value}>{value}</option>)}
          </Select>
        </label>
        <label>Category
          <Select value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.currentTarget.value })}>
            {categories.map((value) => <option key={value}>{value}</option>)}
          </Select>
        </label>
        <label>Subcategory
          <Select value={filters.subcategory} onChange={(event) => setFilters({ ...filters, subcategory: event.currentTarget.value })}>
            {subcategories.map((value) => <option key={value}>{value}</option>)}
          </Select>
        </label>
        <label>Type
          <Select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.currentTarget.value as FilterState['type'] })}>
            {types.map((value) => <option key={value}>{value}</option>)}
          </Select>
        </label>
        <Button appearance="subtle" icon={<Filter20Regular />}>Save view</Button>
      </div>

      <div className="vocabulary-layout">
        <div className="vocabulary-table" role="table">
          <div className="vocab-header" role="row">
            <span>Norsk</span><span>Level</span><span>Type</span><span>Theme</span><span>English</span><span>Status</span>
          </div>
          {rows.map((entry) => (
            <button
              className={entry.id === selected?.id ? 'vocab-row selected' : 'vocab-row'}
              key={entry.id}
              onClick={() => setSelectedId(entry.id)}
              role="row"
            >
              <span className="term" lang="nb">{entry.marker ? `${entry.marker} ` : ''}{entry.norsk}</span>
              <span><Badge appearance="outline">{entry.level}</Badge></span>
              <span>{entry.type}</span>
              <span>{entry.subcategory} · {entry.theme}</span>
              <span>{entry.english}</span>
              <span className={`state state-${entry.state.toLowerCase()}`}>{entry.state}</span>
            </button>
          ))}
        </div>

        {selected ? <VocabularyDetail entry={selected} /> : <div className="empty">No matching vocabulary.</div>}
      </div>
    </article>
  );
}

function VocabularyDetail({ entry }: { entry: VocabularyEntry }) {
  return (
    <aside className="vocab-detail">
      <div className="detail-kicker">{entry.category} · {entry.subcategory}</div>
      <h2 lang="nb">{entry.marker ? `${entry.marker} ` : ''}{entry.norsk}</h2>
      <div className="detail-chips">
        <Badge appearance="tint">{entry.level}</Badge>
        <Badge appearance="outline">{entry.type}</Badge>
        <Badge appearance="outline">{entry.state}</Badge>
      </div>
      <dl>
        <dt>English</dt><dd>{entry.english}</dd>
        <dt>Français</dt><dd>{entry.french}</dd>
        <dt>Theme</dt><dd>{entry.theme}</dd>
        {entry.forms ? <><dt>Forms</dt><dd>{entry.forms}</dd></> : null}
        {entry.synonyms?.length ? <><dt>Synonyms</dt><dd>{entry.synonyms.join(', ')}</dd></> : null}
        <dt>Source</dt><dd>{entry.source ?? '—'}</dd>
      </dl>
      <Divider />
      <div className="detail-actions">
        <Button appearance="primary">Open as document</Button>
        <Button appearance="subtle">Add examples</Button>
        <Button appearance="subtle">Related grammar</Button>
      </div>
    </aside>
  );
}

function CheatSheetDocument() {
  return (
    <article className="document cheatsheet-document">
      <header className="document-heading compact">
        <div>
          <span className="eyebrow">SEMANTIC SKELETON · {connectorSkeleton.level}</span>
          <h1>{connectorSkeleton.title}</h1>
          <p>Empty sections are meaningful slots. AI can fill one slot without rewriting the whole sheet.</p>
        </div>
        <div className="heading-badges">
          <Badge appearance="tint">{connectorSkeleton.kind}</Badge>
          <Badge appearance="outline">{connectorSkeleton.level}</Badge>
        </div>
      </header>

      <div className="skeleton-toolbar">
        <Button appearance="primary" icon={<Flash20Regular />}>Fill empty sections</Button>
        <Button appearance="subtle">Generate B2 examples</Button>
        <Button appearance="subtle">Check duplicates</Button>
      </div>

      <div className="skeleton-grid">
        {connectorSkeleton.sections.map((section) => (
          <section className={section.status === 'empty' ? 'skeleton-slot empty-slot' : 'skeleton-slot filled-slot'} key={section.id}>
            <div className="slot-heading">
              <h2>{section.title}</h2>
              <Badge appearance={section.status === 'empty' ? 'outline' : 'tint'}>{section.status}</Badge>
            </div>
            {section.content ? <p>{section.content}</p> : <p className="slot-hint">{section.hint}</p>}
            <Button appearance="subtle" size="small">{section.status === 'empty' ? 'Fill with AI' : 'Improve'}</Button>
          </section>
        ))}
      </div>
    </article>
  );
}

function GrammarDocument({ resource }: { resource: Resource }) {
  const initialGroup = resource.id === 'grammar-subordinate' ? 'Sentence structure' : 'All';
  const [group, setGroup] = useState<string>(initialGroup);
  const [level, setLevel] = useState<'All' | CefrLevel>('All');

  const topics = grammarTopics.filter((topic) =>
    (group === 'All' || topic.group === group)
    && (level === 'All' || topic.level === level),
  );

  return (
    <article className="document grammar-document">
      <header className="document-heading compact">
        <div>
          <span className="eyebrow">GRAMMAR KNOWLEDGE BASE</span>
          <h1>{resource.id === 'grammar-hub' ? 'Grammar' : resource.title}</h1>
          <p>Rules, patterns and examples are first-class knowledge resources. Grammar is separate from vocabulary tagged as grammatical terminology.</p>
        </div>
        <Badge appearance="tint">{topics.length} topics</Badge>
      </header>

      <div className="grammar-toolbar">
        <label>Level
          <Select value={level} onChange={(event) => setLevel(event.currentTarget.value as 'All' | CefrLevel)}>
            {['All', 'A2', 'B1', 'B2'].map((value) => <option key={value}>{value}</option>)}
          </Select>
        </label>
        <Button appearance="primary" icon={<Flash20Regular />}>Build grammar cheat sheet</Button>
      </div>

      <div className="grammar-layout">
        <nav className="grammar-groups" aria-label="Grammar categories">
          <button className={group === 'All' ? 'active' : ''} onClick={() => setGroup('All')}>
            <span>All grammar</span><small>{grammarTopics.length}</small>
          </button>
          {grammarGroups.map((name) => (
            <button className={group === name ? 'active' : ''} key={name} onClick={() => setGroup(name)}>
              <span>{name}</span>
              <small>{grammarTopics.filter((topic) => topic.group === name).length}</small>
            </button>
          ))}
        </nav>

        <div className="grammar-topic-list">
          {topics.map((topic) => (
            <section className="grammar-topic-card" key={topic.id}>
              <div className="grammar-topic-heading">
                <div>
                  <span>{topic.group}</span>
                  <h2>{topic.title}</h2>
                </div>
                <Badge appearance="outline">{topic.level}</Badge>
              </div>
              <p>{topic.summary}</p>
              <div className="pattern-list">
                {topic.patterns.map((pattern) => <code key={pattern}>{pattern}</code>)}
              </div>
              {topic.examples.length ? (
                <div className="grammar-example">
                  <span>EXAMPLE</span>
                  <strong lang="nb">{topic.examples[0]}</strong>
                </div>
              ) : null}
              <div className="grammar-card-actions">
                <Button appearance="subtle" size="small">Open topic</Button>
                <Button appearance="subtle" size="small">More examples</Button>
                {topic.relatedTableBook ? <Button appearance="subtle" size="small">Reference table</Button> : null}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

function TableBookDocument({ resource }: { resource: Resource }) {
  const book = tableBookForResource(resource.id);
  const [tabId, setTabId] = useState(book?.tabs[0]?.id ?? '');
  const [query, setQuery] = useState('');

  if (!book) return <GenericDocument resource={resource} />;

  const tab = book.tabs.find((candidate) => candidate.id === tabId) ?? book.tabs[0];
  const rows = tab.rows.filter((row) => !query || normalize(row.cells.join(' ')).includes(normalize(query)));

  return (
    <article className="document tablebook-document">
      <header className="document-heading compact">
        <div>
          <span className="eyebrow">NATIVE TABLE BOOK · {book.level}</span>
          <h1>{book.title}</h1>
          <p>{book.description}</p>
        </div>
        <div className="heading-badges">
          <Badge appearance="tint">{book.tabs.length} tabs</Badge>
          <Badge appearance="outline">{book.source}</Badge>
        </div>
      </header>

      <div className="tablebook-tabs" role="tablist" aria-label={book.title}>
        {book.tabs.map((candidate) => (
          <button
            role="tab"
            aria-selected={candidate.id === tab.id}
            className={candidate.id === tab.id ? 'active' : ''}
            key={candidate.id}
            onClick={() => {
              setTabId(candidate.id);
              setQuery('');
            }}
          >
            {candidate.title}
          </button>
        ))}
      </div>

      <div className="tablebook-toolbar">
        <Input
          contentBefore={<Search20Regular />}
          value={query}
          onChange={(_, data) => setQuery(data.value)}
          placeholder={`Search ${tab.title}…`}
        />
        <Badge appearance="outline">{rows.length} rows</Badge>
        <Button appearance="subtle">Filter</Button>
        <Button appearance="subtle">Convert selection</Button>
      </div>

      <div className="tablebook-scroll">
        <table className="tablebook-table">
          <thead>
            <tr>{tab.columns.map((column) => <th key={column}>{column}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, index) => row.kind === 'section' ? (
              <tr className="tablebook-section" key={`${tab.id}-${index}`}>
                <td colSpan={tab.columns.length}>{row.cells.find(Boolean)}</td>
              </tr>
            ) : (
              <tr key={`${tab.id}-${index}`}>
                {tab.columns.map((_, columnIndex) => <td key={columnIndex}>{row.cells[columnIndex] || '—'}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  );
}

function PhraseDocument({ resource }: { resource: Resource }) {
  const [section, setSection] = useState<string>('All');
  const [query, setQuery] = useState('');
  const isOral = resource.id === 'phrases-b2-oral';
  const rows = isOral
    ? oralListeningPhrases.filter((entry) =>
        (section === 'All' || entry.section === section)
        && (!query || normalize([entry.norsk, entry.english, entry.type, entry.use, entry.example].join(' ')).includes(normalize(query))),
      )
    : oralListeningPhrases.slice(0, 0);

  if (!isOral) return <GenericDocument resource={resource} />;

  return (
    <article className="document phrase-document">
      <header className="document-heading compact">
        <div>
          <span className="eyebrow">PHRASE / ORAL COLLECTION · B2</span>
          <h1>B2 Oral & Listening</h1>
          <p>Useful language is grouped by function: response, clarification, fillers, academic/news vocabulary and nuanced spoken connectors.</p>
        </div>
        <Badge appearance="tint">{rows.length} items</Badge>
      </header>

      <div className="phrase-toolbar">
        <Input
          contentBefore={<Search20Regular />}
          value={query}
          onChange={(_, data) => setQuery(data.value)}
          placeholder="Search expressions, function or example…"
        />
        <Select value={section} onChange={(event) => setSection(event.currentTarget.value)}>
          {phraseSections.map((value) => <option key={value}>{value}</option>)}
        </Select>
      </div>

      <div className="phrase-list">
        {rows.map((entry) => (
          <article className="phrase-card" key={entry.id}>
            <div className="phrase-main">
              <div>
                <span className="phrase-section">{entry.section}</span>
                <h2 lang="nb">{entry.form ? `${entry.form} ` : ''}{entry.norsk}</h2>
                <p>{entry.english}</p>
              </div>
              <Badge appearance={entry.priority === 'High' ? 'tint' : 'outline'}>{entry.priority}</Badge>
            </div>
            <div className="phrase-meta">
              <span>{entry.type}</span>
              <span>{entry.use}</span>
            </div>
            <div className="phrase-example" lang="nb">{entry.example}</div>
            <div className="grammar-card-actions">
              <Button appearance="subtle" size="small">Add to vocabulary</Button>
              <Button appearance="subtle" size="small">More examples</Button>
              <Button appearance="subtle" size="small">Practice orally</Button>
            </div>
          </article>
        ))}
      </div>
    </article>
  );
}

function GenericDocument({ resource }: { resource: Resource }) {
  return (
    <article className="document generic-document">
      <header className="document-heading">
        <div>
          <span className="eyebrow">{resource.type.toUpperCase()}</span>
          <h1>{resource.title}</h1>
          <p>This resource uses the shared AtlasNorsk document shell and can be expanded with semantic blocks.</p>
        </div>
      </header>
      <section className="blank-block">
        <TextBulletList20Regular />
        <div>
          <strong>Structured document</strong>
          <p>Paragraphs, bullet lists, translation pairs, grammar rules, examples and vocabulary references live as blocks.</p>
        </div>
      </section>
    </article>
  );
}

function ResourceDocument({ resource }: { resource: Resource }) {
  if (resource.type === 'translation') return <TranslationDocument />;
  if (resource.type === 'news') return <NewsDocument />;
  if (resource.type === 'vocabulary') return <VocabularyDocument />;
  if (resource.type === 'cheatsheet') return <CheatSheetDocument />;
  if (resource.type === 'grammar') return <GrammarDocument resource={resource} />;
  if (resource.type === 'tablebook') return <TableBookDocument resource={resource} />;
  if (resource.type === 'phrases') return <PhraseDocument resource={resource} />;
  return <GenericDocument resource={resource} />;
}

function Inspector({ resource }: { resource: Resource }) {
  const actions = resource.type === 'translation'
    ? ['Translate', 'Correct', 'More natural', 'Simplify', 'Explain grammar', 'Extract vocabulary']
    : resource.type === 'news'
      ? ['Translate article', 'Simplify to B1', 'Raise to B2', 'Explain sentence', 'Extract vocabulary', 'Extract grammar']
    : resource.type === 'vocabulary'
      ? ['Add example', 'Classify', 'Find related', 'Change level', 'Add to cheat sheet']
      : resource.type === 'cheatsheet'
        ? ['Fill missing slots', 'Generate examples', 'Improve to B2', 'Check overlap', 'Find related vocabulary']
        : resource.type === 'grammar'
          ? ['Explain rule', 'Generate examples', 'Compare patterns', 'Build cheat sheet', 'Find related vocabulary']
          : resource.type === 'tablebook'
            ? ['Search table', 'Convert row to vocabulary', 'Send row to grammar', 'Create cheat sheet', 'View import source']
            : resource.type === 'phrases'
              ? ['Explain nuance', 'Generate variants', 'Practice orally', 'Add to vocabulary', 'Build phrase sheet']
              : ['Explain', 'Generate examples', 'Find related resources'];

  return (
    <aside className="inspector">
      <div className="inspector-title">
        <PanelRight20Regular />
        <span>Norsk Inspector</span>
      </div>
      <div className="inspector-scroll">
        <span className="eyebrow">CURRENT RESOURCE</span>
        <h2>{resource.title}</h2>
        <div className="inspector-meta">
          <Badge appearance="tint">{resource.type}</Badge>
          {resource.level ? <Badge appearance="outline">{resource.level}</Badge> : null}
          {resource.category ? <Badge appearance="outline">{resource.category}</Badge> : null}
        </div>

        <Divider />

        <section>
          <h3>AI actions</h3>
          <div className="inspector-actions">
            {actions.map((action, index) => (
              <Button key={action} appearance={index === 0 ? 'primary' : 'subtle'}>{action}</Button>
            ))}
          </div>
        </section>

        <Divider />

        <section>
          <h3>Context</h3>
          <div className="context-card">
            <span>Workspace</span>
            <strong>{resource.workspace}</strong>
          </div>
          <div className="context-card">
            <span>Updated</span>
            <strong>{resource.updatedAt}</strong>
          </div>
        </section>

        <Divider />

        <section>
          <h3>Send to</h3>
          <div className="inspector-actions">
            <Button appearance="subtle">Vocabulary</Button>
            <Button appearance="subtle">Cheat sheet</Button>
            <Button appearance="subtle">Phrase pack</Button>
          </div>
        </section>
      </div>
    </aside>
  );
}

export function App() {
  const [activeWorkspace, setActiveWorkspace] = useState<string>('Daily Norwegian');
  const [tabs, setTabs] = useState<Resource[]>([resources[0], resources[1], resources[2]]);
  const [activeId, setActiveId] = useState(resources[0].id);
  const [split, setSplit] = useState(false);
  const [secondaryId, setSecondaryId] = useState(resources[2].id);

  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0] ?? resources[0];
  const secondary = tabs.find((tab) => tab.id === secondaryId) ?? resources[2];

  const activateTab = (id: string) => {
    const tab = tabs.find((candidate) => candidate.id === id);
    if (!tab) return;
    setActiveId(tab.id);
    setActiveWorkspace(tab.workspace);
  };

  const switchWorkspace = (workspace: string) => {
    const next = preferredResourceForWorkspace(tabs, resources, workspace);
    setActiveWorkspace(workspace);

    if (!next) return;

    setTabs((current) => current.some((tab) => tab.id === next.id) ? current : [...current, next]);
    setActiveId(next.id);
  };

  const openResource = (resource: Resource) => {
    setTabs((current) => current.some((tab) => tab.id === resource.id) ? current : [...current, resource]);
    setActiveId(resource.id);
    setActiveWorkspace(resource.workspace);
  };

  const nextWorkspaceResource = resourcesForWorkspace(resources, activeWorkspace)
    .find((resource) => !tabs.some((tab) => tab.id === resource.id));

  const closeTab = (id: string) => {
    if (tabs.length === 1) return;

    const nextActive = nextActiveResourceAfterClose(tabs, id, activeId);
    const nextTabs = tabs.filter((tab) => tab.id !== id);

    setTabs(nextTabs);

    if (nextActive) {
      setActiveId(nextActive.id);
      setActiveWorkspace(nextActive.workspace);
    }

    if (id === secondaryId) {
      const replacement = nextTabs.find((tab) => tab.id !== nextActive?.id) ?? nextTabs[0];
      if (replacement) setSecondaryId(replacement.id);
    }
  };

  return (
    <div className="app-shell">
      <TopBar onOpen={openResource} />
      <div className="app-body">
        <LibrarySidebar
          activeWorkspace={activeWorkspace}
          onWorkspaceChange={switchWorkspace}
          onOpen={openResource}
        />

        <main className={split ? 'workspace split' : 'workspace'}>
          <section className="pane primary-pane">
            <TabStrip
              tabs={tabs}
              activeId={active.id}
              setActive={activateTab}
              closeTab={closeTab}
              split={split}
              toggleSplit={() => setSplit((value) => !value)}
              onAddTab={() => {
                if (nextWorkspaceResource) openResource(nextWorkspaceResource);
              }}
              canAddTab={Boolean(nextWorkspaceResource)}
            />
            <div className="breadcrumb">
              <span>{active.workspace}</span>
              <span>›</span>
              <span>{active.type}</span>
              <span>›</span>
              <strong>{active.title}</strong>
            </div>
            <div className="pane-scroll">
              <ResourceDocument resource={active} />
            </div>
          </section>

          {split ? (
            <section className="pane secondary-pane">
              <div className="secondary-header">
                <span>Compare / reference</span>
                <Select value={secondary.id} onChange={(event) => setSecondaryId(event.currentTarget.value)}>
                  {tabs.map((tab) => <option key={tab.id} value={tab.id}>{tab.title}</option>)}
                </Select>
                <Button appearance="subtle" icon={<Dismiss16Regular />} onClick={() => setSplit(false)} />
              </div>
              <div className="breadcrumb">
                <span>{secondary.workspace}</span>
                <span>›</span>
                <strong>{secondary.title}</strong>
              </div>
              <div className="pane-scroll">
                <ResourceDocument resource={secondary} />
              </div>
            </section>
          ) : null}
        </main>

        <Inspector resource={active} />
      </div>
    </div>
  );
}
