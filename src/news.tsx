import { useEffect, useMemo, useState } from 'react';
import { Badge, Button, Divider, Select, Spinner } from '@fluentui/react-components';
import {
  CONTENT_BASE_URL,
  loadDailyNewsManifest,
  loadNewsArticle,
  type ContentManifestItem,
  type NewsArticle,
} from './content/githubContentProvider';

type ReadingMode = 'Norsk + English' | 'Norsk + French' | 'Norsk only' | 'Learning';

function articleLabel(item: ContentManifestItem) {
  return `${item.date} · ${item.level}`;
}

export function NewsDocument() {
  const [items, setItems] = useState<ContentManifestItem[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [mode, setMode] = useState<ReadingMode>('Norsk + English');
  const [manifestStatus, setManifestStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [manifestError, setManifestError] = useState('');
  const [articleStatus, setArticleStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [articleError, setArticleError] = useState('');
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [articleRefreshNonce, setArticleRefreshNonce] = useState(0);

  useEffect(() => {
    let active = true;
    setManifestStatus('loading');
    setManifestError('');
    loadDailyNewsManifest()
      .then((manifest) => {
        if (!active) return;
        setItems(manifest.items);
        setSelectedId((current) =>
          manifest.items.some((item) => item.id === current)
            ? current
            : manifest.items[0]?.id || '',
        );
        setManifestStatus('ready');
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setManifestError(reason instanceof Error ? reason.message : 'Could not load Daily News.');
        setManifestStatus('error');
      });
    return () => { active = false; };
  }, [refreshNonce]);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? items[0],
    [items, selectedId],
  );

  useEffect(() => {
    if (!selected) {
      setArticle(null);
      setArticleStatus('idle');
      setArticleError('');
      return;
    }
    let active = true;
    setArticle(null);
    setArticleStatus('loading');
    setArticleError('');
    loadNewsArticle(selected.path, selected)
      .then((value) => {
        if (!active) return;
        setArticle(value);
        setArticleStatus('ready');
      })
      .catch((reason: unknown) => {
        if (!active) return;
        setArticleError(reason instanceof Error ? reason.message : 'Could not load article.');
        setArticleStatus('error');
      });
    return () => { active = false; };
  }, [selected, articleRefreshNonce]);

  return (
    <article className="document news-document">
      <header className="document-heading compact">
        <div>
          <span className="eyebrow">DAILY NEWS · LIVE CONTENT</span>
          <h1>Daily News</h1>
          <p>Translated learning articles load directly from atlasnorsk-content/main. Publishing JSON is enough; the app does not need a redeploy.</p>
        </div>
        <div className="heading-badges">
          <Badge appearance="tint">GitHub content</Badge>
          <Badge appearance="outline">{items.length} articles</Badge>
          <Button appearance="subtle" size="small" onClick={() => setRefreshNonce((value) => value + 1)}>
            Refresh feed
          </Button>
        </div>
      </header>

      {manifestStatus === 'loading' ? (
        <div className="news-status"><Spinner size="tiny" /><span>Loading content manifest…</span></div>
      ) : null}

      {manifestStatus === 'error' ? (
        <div className="news-error">
          <strong>Daily News could not load.</strong>
          <span>{manifestError}</span>
          <div className="news-error-actions">
            <Button appearance="primary" size="small" onClick={() => setRefreshNonce((value) => value + 1)}>
              Try again
            </Button>
            <a href={CONTENT_BASE_URL} target="_blank" rel="noreferrer">Open content source</a>
          </div>
        </div>
      ) : null}

      {manifestStatus === 'ready' && items.length === 0 ? (
        <div className="news-empty">
          <strong>No published articles yet.</strong>
          <p>Add a JSON article to atlasnorsk-content and update the Daily News manifest.</p>
        </div>
      ) : null}

      {items.length > 0 ? (
        <div className="news-layout">
          <aside className="news-list">
            <div className="news-list-title">ARTICLES</div>
            {items.map((item) => (
              <button
                key={item.id}
                className={item.id === selected?.id ? 'news-list-item active' : 'news-list-item'}
                onClick={() => setSelectedId(item.id)}
              >
                <span>{articleLabel(item)}</span>
                <strong>{item.title}</strong>
                <small>{item.themes.join(' · ')}</small>
              </button>
            ))}
          </aside>

          <section className="news-reader">
            {articleStatus === 'loading' ? (
              <div className="news-status"><Spinner size="tiny" /><span>Loading article…</span></div>
            ) : null}

            {articleStatus === 'error' ? (
              <div className="news-error news-article-error">
                <strong>This article could not load.</strong>
                <span>{articleError}</span>
                <div className="news-error-actions">
                  <Button appearance="primary" size="small" onClick={() => setArticleRefreshNonce((value) => value + 1)}>
                    Retry article
                  </Button>
                </div>
              </div>
            ) : null}

            {articleStatus === 'ready' && article ? (
              <>
                <div className="news-reader-heading">
                  <div>
                    <span className="eyebrow">{article.date} · {article.source.publisher}</span>
                    <h2>{article.title}</h2>
                    <div className="news-tags">
                      <Badge appearance="tint">{article.level}</Badge>
                      {article.themes.map((theme) => <Badge appearance="outline" key={theme}>{theme}</Badge>)}
                    </div>
                  </div>
                  <Select value={mode} onChange={(event) => setMode(event.currentTarget.value as ReadingMode)}>
                    <option>Norsk + English</option>
                    <option>Norsk + French</option>
                    <option>Norsk only</option>
                    <option>Learning</option>
                  </Select>
                </div>

                {article.summary?.norsk ? (
                  <div className="news-summary">
                    <span>SUMMARY</span>
                    <p lang="nb">{article.summary.norsk}</p>
                  </div>
                ) : null}

                <div className="news-sections">
                  {article.sections.map((section, index) => (
                    <section className="news-section" key={section.id}>
                      <div className="news-section-number">{String(index + 1).padStart(2, '0')}</div>
                      <div className="news-section-content">
                        <p className="news-norsk" lang="nb">{section.norsk}</p>
                        {mode === 'Norsk + English' && section.english ? <p className="news-translation">{section.english}</p> : null}
                        {mode === 'Norsk + French' && section.french ? <p className="news-translation">{section.french}</p> : null}
                        {mode === 'Learning' ? (
                          <>
                            {section.english ? <p className="news-translation">{section.english}</p> : null}
                            {section.french ? <p className="news-translation">{section.french}</p> : null}
                            {section.note ? <p className="news-note">{section.note}</p> : null}
                          </>
                        ) : null}
                      </div>
                    </section>
                  ))}
                </div>

                <Divider />

                <section className="news-learning-grid">
                  <div>
                    <div className="section-heading"><h3>Vocabulary</h3></div>
                    <div className="news-chip-list">
                      {article.vocabulary.map((entry) => (
                        <article className="news-learning-card" key={`${entry.term}-${entry.english}`}>
                          <div><strong lang="nb">{entry.marker ? `${entry.marker} ` : ''}{entry.term}</strong><Badge appearance="outline">{entry.level}</Badge></div>
                          <span>{entry.type}</span>
                          <p>{entry.english} · {entry.french}</p>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="section-heading"><h3>Grammar</h3></div>
                    <div className="news-chip-list">
                      {article.grammar.map((entry) => (
                        <article className="news-learning-card" key={`${entry.topic}-${entry.example}`}>
                          <strong>{entry.topic}</strong>
                          <p lang="nb">{entry.example}</p>
                          {entry.explanation ? <small>{entry.explanation}</small> : null}
                        </article>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="document-section">
                  <div className="section-heading"><h3>Useful phrases</h3></div>
                  <div className="inline-vocab-grid">
                    {article.usefulPhrases.map((phrase) => (
                      <article className="mini-vocab" key={phrase.norsk}>
                        <strong lang="nb">{phrase.norsk}</strong>
                        <p>{phrase.english}</p>
                        <p>{phrase.french}</p>
                      </article>
                    ))}
                  </div>
                </section>

                <div className="news-source-bar">
                  <span>Source: {article.source.publisher}</span>
                  <Button
                    appearance="subtle"
                    onClick={() => window.open(article.source.url, '_blank', 'noopener,noreferrer')}
                  >
                    Open source
                  </Button>
                </div>
              </>
            ) : null}
          </section>
        </div>
      ) : null}
    </article>
  );
}
