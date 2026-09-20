import React, { useMemo } from 'react';
import { BookOpen } from 'lucide-react';

const HERO_ROTATE_MS = 10000;

export function HomeView({ manhwaList, characterList, insightList, charactersOf, onNavigate, onAddManhwa }) {
  const heroSlides = useMemo(() => [...manhwaList].sort((a, b) => Number(b.rank ?? 0) - Number(a.rank ?? 0)).slice(0, 5), [manhwaList]);
  const [heroIndex, setHeroIndex] = React.useState(0);

  React.useEffect(() => {
    if (heroSlides.length < 2) return;
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, HERO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  React.useEffect(() => {
    if (heroIndex >= heroSlides.length) setHeroIndex(0);
  }, [heroIndex, heroSlides.length]);

  const hero = heroSlides[heroIndex];
  const recentlyAdded = useMemo(() => [...manhwaList].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 4), [manhwaList]);
  const topCharacters = useMemo(() => [...characterList].sort((a, b) => Number(b.rank ?? 0) - Number(a.rank ?? 0)).slice(0, 4), [characterList]);
  const latestInsights = useMemo(() => [...insightList].slice(0, 4), [insightList]);
  const spotlightCharacter = useMemo(() => {
    if (!characterList.length) return null;
    return characterList[Math.floor(Math.random() * characterList.length)];
  }, [characterList]);

  const newThisWeek = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return [...manhwaList, ...characterList].filter(
      (item) => item.created_at && new Date(item.created_at).getTime() >= oneWeekAgo
    ).length;
  }, [manhwaList, characterList]);

  const favoriteManhwa = manhwaList.filter((m) => m.isFavorite === true);

  return (
    <div className="view-container archive-view">
      {hero ? (
        <section className="hero-banner" key={hero.id}>
          <div className="hero-overlay" />
          {hero.cover_image && <div className="hero-art" style={{ backgroundImage: `url(${hero.cover_image})` }} />}
          <div className="hero-content fade-in-key" key={hero.id}>
            <p className="eyebrow">Classified record</p>
            <h1>MANHWA CONSOLE</h1>
            <h2>{hero.title}</h2>
            <p className="hero-subtitle">
              {hero.description?.slice(0, 160) || 'A hidden archive containing worlds, lore, factions, and ancient conflicts.'}
            </p>
            <div className="hero-meta">
              {hero.status && <span className="status-pill">{hero.status.toUpperCase()}</span>}
              <span className="genre-pill">{charactersOf(hero.id).length} recorded entities</span>
            </div>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => onNavigate('manhwa', hero.id)}>
                ENTER THE ARCHIVE
              </button>
              <button className="btn btn-secondary" onClick={() => onNavigate('insights')}>
                EXPLORE CHRONICLES
              </button>
            </div>
            {heroSlides.length > 1 && (
              <div className="hero-dots" role="tablist" aria-label="Featured series">
                {heroSlides.map((s, i) => (
                  <button
                    key={s.id}
                    className={`hero-dot ${i === heroIndex ? 'active' : ''}`}
                    onClick={() => setHeroIndex(i)}
                    aria-label={`Show ${s.title}`}
                    role="tab"
                    aria-selected={i === heroIndex}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <div className="empty-state archive-empty">
          <BookOpen size={42} aria-hidden="true" />
          <h3>The archive is empty</h3>
          <p>Add the first record to begin cataloging hidden worlds.</p>
          <button className="btn btn-primary" onClick={onAddManhwa} type="button">Add Series</button>
        </div>
      )}

      <div className="dashboard-metrics">
        <div className="metric-card">
          <div className="metric-value">{manhwaList.length}</div>
          <div className="metric-label">Recorded Series</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{characterList.length}</div>
          <div className="metric-label">Entities</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{insightList.length}</div>
          <div className="metric-label">Chronicles</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{newThisWeek}</div>
          <div className="metric-label">New This Week</div>
        </div>
      </div>

      <div className="action-bar">
        <button className="btn btn-primary" onClick={onAddManhwa} type="button">Add Series</button>
        <button className="btn btn-secondary" onClick={() => onNavigate('characters')} type="button">View Entities</button>
      </div>

      <section className="archive-section">
        <div className="section-header">
          <div className="header-left">
            <BookOpen size={22} aria-hidden="true" />
            <h2>Recent Records</h2>
          </div>
          <button type="button" className="view-all" onClick={() => onNavigate('series')}>View archives</button>
        </div>
        <div className="cards-grid">
          {recentlyAdded.map((m) => (
            <div key={m.id} className="card manhwa-card" role="button" tabIndex={0} onClick={() => onNavigate('manhwa', m.id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('manhwa', m.id)}>
              <div className="card-cover">
                {m.cover_image ? <img src={m.cover_image} alt={m.title} className="cover-image" loading="lazy" /> : <div className="card-fallback" />}
              </div>
              <div className="card-body">
                <h3>{m.title}</h3>
                <p className="text-sm">{m.author}</p>
                {m.status && <span className="status-pill">{m.status.toUpperCase()}</span>}
                <div className="card-footer">
                  <small>{charactersOf(m.id).length} entities</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="archive-section">
        <div className="section-header">
          <div className="header-left">
            <span className="section-icon">✦</span>
            <h2>Notable Entities</h2>
          </div>
          <button type="button" className="view-all" onClick={() => onNavigate('characters')}>View all</button>
        </div>
        <div className="cards-grid">
          {topCharacters.map((c) => (
            <div key={c.id} className="card character-card" role="button" tabIndex={0} onClick={() => onNavigate('character', c.id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('character', c.id)}>
              <div className="card-cover">
                {c.image_url ? <img src={c.image_url} alt={c.name} className="cover-image" loading="lazy" /> : <div className="card-fallback card-fallback-gold" />}
              </div>
              <div className="card-body">
                <h3>{c.name}</h3>
                {c.role && <p className="text-sm">{c.role}</p>}
                <span className="status-pill alt">RANK {c.rank || 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {spotlightCharacter && (
        <section className="archive-section">
          <div className="section-header">
            <div className="header-left">
              <span className="section-icon">✧</span>
              <h2>Entity Spotlight</h2>
            </div>
          </div>
          <div className="spotlight-card" onClick={() => onNavigate('character', spotlightCharacter.id)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('character', spotlightCharacter.id)}>
            <img src={spotlightCharacter.image_url || '/hero.webp'} alt={spotlightCharacter.name} />
            <div>
              <p className="eyebrow">Known entity</p>
              <h3>{spotlightCharacter.name}</h3>
              <p className="text-sm">{spotlightCharacter.role}</p>
              {spotlightCharacter.description && <p className="spotlight-desc">{spotlightCharacter.description.slice(0, 180)}</p>}
            </div>
          </div>
        </section>
      )}

      <section className="archive-section">
        <div className="section-header">
          <div className="header-left">
            <span className="section-icon">✦</span>
            <h2>Latest Chronicles</h2>
          </div>
          <button type="button" className="view-all" onClick={() => onNavigate('insights')}>Read all</button>
        </div>
        <div className="cards-grid">
          {latestInsights.map((insight) => (
            <div key={insight.id} className="card insight-card">
              <div className="card-body">
                <span className="insight-tag">{insight.type || 'Chronicle'}</span>
                <p>{insight.text?.slice(0, 120) || 'Hidden chronicle entry'}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {favoriteManhwa.length > 0 && (
        <section className="archive-section">
          <div className="section-header">
            <div className="header-left">
              <span className="section-icon">♥</span>
              <h2>Saved to the Vault</h2>
            </div>
          </div>
          <div className="cards-grid">
            {favoriteManhwa.map((m) => (
              <div key={m.id} className="card manhwa-card" role="button" tabIndex={0} onClick={() => onNavigate('manhwa', m.id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate('manhwa', m.id)}>
                <div className="card-cover">
                  {m.cover_image ? <img src={m.cover_image} alt={m.title} className="cover-image" loading="lazy" /> : <div className="card-fallback" />}
                </div>
                <div className="card-body">
                  <h3>{m.title}</h3>
                  <p className="text-sm">{m.author}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
