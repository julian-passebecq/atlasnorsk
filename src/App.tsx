import { useMemo, useState } from 'react';
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
  Language20Regular,
  Library20Regular,
  PanelRight20Regular,
  Search20Regular,
  SplitHorizontal20Regular,
  TextBulletList20Regular,
} from '@fluentui/react-icons';
import { connectorSkeleton, resources, translation, vocabulary } from './data';
import type { CefrLevel, Resource, ResourceType, VocabularyEntry, VocabularyType } from './model';

const workspaces = ['Daily Norwegian', 'B2 Preparation', 'Her på berget', 'Work Norwegian'] as const;

const resourceIcon: Record<ResourceType, JSX.Element> = {
  translation: <Language20Regular />,
  vocabulary: <AppsList20Regular />,
  cheatsheet: <TextBulletList20Regular />,
  grammar: <BookOpen20Regular />,
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
      <Button appearance="primary" icon={<Add20Regular />} onClick={() => onOpen(resources[0])}>
        New
      </Button>
    </header>
  );
}

function LibrarySidebar({
  activeWorkspace,
  setActiveWorkspace,
  onOpen,
}: {
  activeWorkspace: string;
  setActiveWorkspace: (workspace: string) => void;
  onOpen: (resource: Resource) => void;
}) {
  const grouped = useMemo(() => {
    const byType = new Map<ResourceType, Resource[]>();
    for (const resource of resources) {
      const list = byType.get(resource.type) ?? [];
      list.push(resource);
      byType.set(resource.type, list);
    }
    return byType;
  }, []);

  const sections: { type: ResourceType; label: string }[] = [
    { type: 'translation', label: 'Translations' },
    { type: 'vocabulary', label: 'Vocabulary' },
    { type: 'cheatsheet', label: 'Cheat sheets' },
    { type: 'grammar', label: 'Grammar' },
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
          onChange={(event) => setActiveWorkspace(event.currentTarget.value)}
        >
          {workspaces.map((workspace) => <option key={workspace}>{workspace}</option>)}
        </Select>
      </div>

      <nav className="library-scroll" aria-label="Norwegian resources">
        <button className="nav-home">
          <Grid20Regular />
          <span>Today</span>
          <span className="nav-count">4</span>
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
}: {
  tabs: Resource[];
  activeId: string;
  setActive: (id: string) => void;
  closeTab: (id: string) => void;
  split: boolean;
  toggleSplit: () => void;
}) {
  return (
    <div className="tab-strip">
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={tab.id === activeId ? 'document-tab active' : 'document-tab'}
            onClick={() => setActive(tab.id)}
          >
            {resourceIcon[tab.type]}
            <span>{tab.title}</span>
            <span
              role="button"
              aria-label={`Close ${tab.title}`}
              className="tab-close"
              onClick={(event) => {
                event.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <Dismiss16Regular />
            </span>
          </button>
        ))}
        <button className="add-tab" aria-label="New document tab"><Add20Regular /></button>
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
        <Button appearance="primary" icon={<Language20Regular />}>Translate</Button>
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
  const selected = vocabulary.find((entry) => entry.id === selectedId) ?? rows[0];

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
  if (resource.type === 'vocabulary') return <VocabularyDocument />;
  if (resource.type === 'cheatsheet') return <CheatSheetDocument />;
  return <GenericDocument resource={resource} />;
}

function Inspector({ resource }: { resource: Resource }) {
  const actions = resource.type === 'translation'
    ? ['Translate', 'Correct', 'More natural', 'Simplify', 'Explain grammar', 'Extract vocabulary']
    : resource.type === 'vocabulary'
      ? ['Add example', 'Classify', 'Find related', 'Change level', 'Add to cheat sheet']
      : resource.type === 'cheatsheet'
        ? ['Fill missing slots', 'Generate examples', 'Improve to B2', 'Check overlap', 'Find related vocabulary']
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

  const openResource = (resource: Resource) => {
    setTabs((current) => current.some((tab) => tab.id === resource.id) ? current : [...current, resource]);
    setActiveId(resource.id);
  };

  const closeTab = (id: string) => {
    setTabs((current) => {
      if (current.length === 1) return current;
      const next = current.filter((tab) => tab.id !== id);
      if (id === activeId) setActiveId(next[0].id);
      return next;
    });
  };

  return (
    <div className="app-shell">
      <TopBar onOpen={openResource} />
      <div className="app-body">
        <LibrarySidebar
          activeWorkspace={activeWorkspace}
          setActiveWorkspace={setActiveWorkspace}
          onOpen={openResource}
        />

        <main className={split ? 'workspace split' : 'workspace'}>
          <section className="pane primary-pane">
            <TabStrip
              tabs={tabs}
              activeId={active.id}
              setActive={setActiveId}
              closeTab={closeTab}
              split={split}
              toggleSplit={() => setSplit((value) => !value)}
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
