import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Users, Lightbulb, Plus, Shuffle, Heart, Trophy } from 'lucide-react';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { ManhwaCard } from '../../components/cards/ManhwaCard';
import { CharacterCard } from '../../components/cards/CharacterCard';
import { InsightCard } from '../../components/cards/InsightCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { useFavorites } from '../../hooks/useFavorites';
import { rankWeight, sortItems } from '../../utils/format';

const HERO_ROTATE_MS = 10000;

export function HomeView({ manhwaList, characterList, insightList, charactersOf, onNavigate, onAddManhwa }) {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [heroIndex, setHeroIndex] = useState(0);
  const heroSlides = useMemo(() => sortItems(manhwaList, 'rank').slice(0, 5), [manhwaList]);
  const hero = heroSlides[heroIndex];

  useEffect(() => {
    if (heroSlides.length < 2 || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => setHeroIndex((index) => (index + 1) % heroSlides.length), HERO_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (heroIndex >= heroSlides.length) setHeroIndex(0);
  }, [heroIndex, heroSlides.length]);

  const recentlyAdded = useMemo(() => sortItems(manhwaList, 'newest').slice(0, 4), [manhwaList]);
  const topCharacters = useMemo(() => sortItems(characterList, 'rank').slice(0, 4), [characterList]);
  const latestInsights = useMemo(() => insightList.slice(0, 4), [insightList]);
  const spotlightCharacter = useMemo(() => characterList.length ? characterList[0] : null, [characterList]);
  const newThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return [...manhwaList, ...characterList].filter((item) => item.created_at && new Date(item.created_at).getTime() >= weekAgo).length;
  }, [manhwaList, characterList]);
  const topRankCharacter = useMemo(() => [...characterList].sort((a, b) => rankWeight(b.rank) - rankWeight(a.rank))[0], [characterList]);
  const favoriteManhwa = manhwaList.filter((item) => isFavorite('manhwa', item.id) || favorites.manhwa?.includes(item.id));

  return (
    <div className="view-container archive-view">
      {hero ? (
        <section className="hero-banner" key={hero.id}>
          <div className="hero-overlay" />
          {hero.cover_image && <div className="hero-art" style={{ backgroundImage: `url(${hero.cover_image})` }} aria-hidden="true" />}
          <div className="hero-content">
            <p className="eyebrow">Classified record</p>
            <h1>MANHWA CONSOLE</h1>
            <h2>{hero.title}</h2>
            <p className="hero-subtitle">{hero.description?.slice(0, 160) || 'Access the archive. Discover worlds. Uncover legends.'}</p>
            <div className="hero-meta">{hero.status && <span className="status-pill">{hero.status.toUpperCase()}</span>}<span className="genre-pill">{charactersOf(hero.id).length} recorded entities</span></div>
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => onNavigate('manhwa', hero.id)} type="button">ENTER THE ARCHIVE</button>
              <button className="btn btn-secondary" onClick={() => onNavigate('insights')} type="button">EXPLORE CHRONICLES</button>
            </div>
            {heroSlides.length > 1 && <div className="hero-dots" role="tablist" aria-label="Featured records">{heroSlides.map((slide, index) => <button key={slide.id} className={`hero-dot ${index === heroIndex ? 'active' : ''}`} onClick={() => setHeroIndex(index)} aria-label={`Show ${slide.title}`} role="tab" aria-selected={index === heroIndex} type="button" />)}</div>}
          </div>
        </section>
      ) : <EmptyState icon={BookOpen} title="The archive is empty" subtitle="Add the first record to begin cataloging hidden worlds." actionLabel="Add Series" onAction={onAddManhwa} />}

      <div className="dashboard-metrics">
        <MetricCard label="Recorded Series" value={manhwaList.length} />
        <MetricCard label="Entities" value={characterList.length} />
        <MetricCard label="Chronicles" value={insightList.length} />
        <MetricCard label="New This Week" value={newThisWeek} />
        <MetricCard label="Highest Rank" value={topRankCharacter?.name || '—'} text />
      </div>

      <div className="action-bar"><button className="btn btn-primary" onClick={onAddManhwa} type="button"><Plus size={16} /> Add Series</button><button className="btn btn-secondary" onClick={() => onNavigate('characters')} type="button"><Users size={16} /> View Entities</button></div>

      <ArchiveSection icon={BookOpen} title="Recent Records" actionLabel="View archives" onAction={() => onNavigate('series')}>
        <div className="cards-grid">{recentlyAdded.length ? recentlyAdded.map((item) => <ManhwaCard key={item.id} manhwa={item} characterCount={charactersOf(item.id).length} onClick={() => onNavigate('manhwa', item.id)} isFavorite={isFavorite('manhwa', item.id)} onToggleFavorite={() => toggleFavorite('manhwa', item.id)} />) : <EmptyState icon={BookOpen} title="No records yet" />}</div>
      </ArchiveSection>

      <ArchiveSection icon={Trophy} title="Notable Entities" actionLabel="View all" onAction={() => onNavigate('characters')}>
        <div className="cards-grid">{topCharacters.length ? topCharacters.map((item) => <CharacterCard key={item.id} character={item} onClick={() => onNavigate('character', item.id)} isFavorite={isFavorite('character', item.id)} onToggleFavorite={() => toggleFavorite('character', item.id)} />) : <EmptyState icon={Users} title="No entities yet" />}</div>
      </ArchiveSection>

      {spotlightCharacter && <ArchiveSection icon={Shuffle} title="Entity Spotlight"><div className="spotlight-card" role="button" tabIndex={0} onClick={() => onNavigate('character', spotlightCharacter.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') onNavigate('character', spotlightCharacter.id); }}><img src={spotlightCharacter.image_url || '/hero.webp'} alt={spotlightCharacter.name} /><div><p className="eyebrow">Known entity</p><h3>{spotlightCharacter.name}</h3><p className="text-sm">{spotlightCharacter.role}</p><p className="spotlight-desc">{spotlightCharacter.description?.slice(0, 180)}</p></div></div></ArchiveSection>}

      <ArchiveSection icon={Lightbulb} title="Latest Chronicles" actionLabel="Read all" onAction={() => onNavigate('insights')}><div className="cards-grid">{latestInsights.length ? latestInsights.map((item) => <InsightCard key={item.id} insight={item} />) : <EmptyState icon={Lightbulb} title="No chronicles yet" />}</div></ArchiveSection>

      {favoriteManhwa.length > 0 && <ArchiveSection icon={Heart} title="Saved to the Vault"><div className="cards-grid">{favoriteManhwa.map((item) => <ManhwaCard key={item.id} manhwa={item} characterCount={charactersOf(item.id).length} onClick={() => onNavigate('manhwa', item.id)} isFavorite onToggleFavorite={() => toggleFavorite('manhwa', item.id)} />)}</div></ArchiveSection>}
    </div>
  );
}

function ArchiveSection({ icon, title, actionLabel, onAction, children }) {
  return <section className="archive-section"><SectionHeader icon={icon} title={title} actionLabel={actionLabel} onAction={onAction} />{children}</section>;
}

function MetricCard({ label, value, text }) {
  return <div className={`metric-card ${text ? 'metric-card-text' : ''}`}><div className="metric-value">{value}</div><div className="metric-label">{label}</div></div>;
}
