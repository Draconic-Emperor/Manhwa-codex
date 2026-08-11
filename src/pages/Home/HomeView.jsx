import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Users, Lightbulb, Plus, Shuffle, Heart, Trophy } from 'lucide-react';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { ManhwaCard } from '../../components/cards/ManhwaCard';
import { CharacterCard } from '../../components/cards/CharacterCard';
import { InsightCard } from '../../components/cards/InsightCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { AnimatedCounter } from '../../components/ui/AnimatedCounter';
import { ScrollReveal } from '../../components/ui/Skeleton';
import { rankWeight, sortItems } from '../../utils/format';
import { useFavorites } from '../../hooks/useFavorites';

const HERO_ROTATE_MS = 10000;

export function HomeView({ manhwaList, characterList, insightList, charactersOf, onNavigate, onAddManhwa }) {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  const heroSlides = useMemo(
    () => sortItems(manhwaList, 'rank').slice(0, 5),
    [manhwaList]
  );
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (heroSlides.length < 2) return;
    const timer = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length);
    }, HERO_ROTATE_MS);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (heroIndex >= heroSlides.length) setHeroIndex(0);
  }, [heroSlides.length, heroIndex]);

  const hero = heroSlides[heroIndex];

  const recentlyAdded = useMemo(() => sortItems(manhwaList, 'newest').slice(0, 4), [manhwaList]);
  const topCharacters = useMemo(() => sortItems(characterList, 'rank').slice(0, 4), [characterList]);
  const latestInsights = useMemo(() => insightList.slice(0, 4), [insightList]);

  const spotlightCharacter = useMemo(() => {
    if (characterList.length === 0) return null;
    return characterList[Math.floor(Math.random() * characterList.length)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // stable per page load - "random character every refresh"

  const newThisWeek = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return [...manhwaList, ...characterList].filter(
      (item) => item.created_at && new Date(item.created_at).getTime() >= weekAgo
    ).length;
  }, [manhwaList, characterList]);

  const topRankCharacter = useMemo(() => {
    if (characterList.length === 0) return null;
    return [...characterList].sort((a, b) => rankWeight(b.rank) - rankWeight(a.rank))[0];
  }, [characterList]);

  const favoriteManhwa = manhwaList.filter((m) => favorites.manhwa?.includes(m.id));

  return (
    <div className="view-container">
      {hero ? (
        <div className="hero-banner" key={hero.id}>
          <div className="hero-content fade-in-key" key={hero.id}>
            {hero.cover_image && (
              <div className="hero-cover">
                <img src={hero.cover_image} alt={hero.title || 'Featured series cover'} loading="lazy" />
              </div>
            )}
            <h1>{hero.title}</h1>
            <p className="hero-subtitle">
              {hero.description?.slice(0, 140) || 'A living archive of manhwa series, characters, and lore.'}
            </p>
            <div className="hero-meta">
              {hero.status && <span className="status-pill">{hero.status.toUpperCase()}</span>}
              <span className="genre-pill">{charactersOf(hero.id).length} characters</span>
            </div>
            <div className="hero-actions">
              <button className="action-btn" onClick={() => onNavigate('manhwa', hero.id)}>
                <BookOpen size={18} /> Read Lore
              </button>
              <button className="action-btn" onClick={() => onNavigate('manhwa', hero.id)}>
                <Users size={18} /> View Characters
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
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="Your codex is empty"
          subtitle="Add your first series to start building the archive."
          actionLabel="Add Series"
          onAction={onAddManhwa}
        />
      )}

      <div className="dashboard-metrics">
        <MetricCard label="Total Series" value={manhwaList.length} />
        <MetricCard label="Total Characters" value={characterList.length} />
        <MetricCard label="Total Insights" value={insightList.length} />
        <MetricCard label="New This Week" value={newThisWeek} />
        <div className="metric-card metric-card-text">
          <div className="metric-label">Top Ranked Character</div>
          <div className="metric-text-value">{topRankCharacter?.name || '—'}</div>
        </div>
      </div>

      <div className="action-bar">
        <button className="action-btn" onClick={onAddManhwa}>
          <Plus size={20} /> Add Series
        </button>
      </div>

      <ScrollReveal>
        <SectionHeader
          icon={BookOpen}
          title="Recently Added Series"
          actionLabel="View All"
          onAction={() => onNavigate('series')}
        />
        <div className="cards-grid">
          {recentlyAdded.length > 0 ? (
            recentlyAdded.map((m) => (
              <ManhwaCard
                key={m.id}
                manhwa={m}
                characterCount={charactersOf(m.id).length}
                onClick={() => onNavigate('manhwa', m.id)}
                isFavorite={isFavorite('manhwa', m.id)}
                onToggleFavorite={() => toggleFavorite('manhwa', m.id)}
              />
            ))
          ) : (
            <EmptyState icon={BookOpen} title="No series recorded yet." />
          )}
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <SectionHeader
          icon={Trophy}
          title="Highest Ranked Characters"
          actionLabel="View All"
          onAction={() => onNavigate('characters')}
        />
        <div className="cards-grid">
          {topCharacters.length > 0 ? (
            topCharacters.map((c) => (
              <CharacterCard
                key={c.id}
                character={c}
                onClick={() => onNavigate('character', c.id)}
                isFavorite={isFavorite('character', c.id)}
                onToggleFavorite={() => toggleFavorite('character', c.id)}
              />
            ))
          ) : (
            <EmptyState icon={Users} title="No characters recorded yet." />
          )}
        </div>
      </ScrollReveal>

      {spotlightCharacter && (
        <ScrollReveal>
          <SectionHeader icon={Shuffle} title="Character Spotlight" />
          <div className="spotlight-card" onClick={() => onNavigate('character', spotlightCharacter.id)}>
            <img
              src={spotlightCharacter.image_url || 'https://placehold.co/160x160'}
              alt={spotlightCharacter.name}
            />
            <div>
              <h3>{spotlightCharacter.name}</h3>
              <p className="text-sm">{spotlightCharacter.role}</p>
              {spotlightCharacter.description && (
                <p className="text-sm spotlight-desc">{spotlightCharacter.description.slice(0, 140)}</p>
              )}
            </div>
          </div>
        </ScrollReveal>
      )}

      <ScrollReveal>
        <SectionHeader
          icon={Lightbulb}
          title="Latest Insights"
          actionLabel="View All"
          onAction={() => onNavigate('insights')}
        />
        <div className="cards-grid">
          {latestInsights.length > 0 ? (
            latestInsights.map((insight) => <InsightCard key={insight.id} insight={insight} />)
          ) : (
            <EmptyState icon={Lightbulb} title="No insights shared yet." />
          )}
        </div>
      </ScrollReveal>

      {favoriteManhwa.length > 0 && (
        <ScrollReveal>
          <SectionHeader icon={Heart} title="Your Favorites" />
          <div className="cards-grid">
            {favoriteManhwa.map((m) => (
              <ManhwaCard
                key={m.id}
                manhwa={m}
                characterCount={charactersOf(m.id).length}
                onClick={() => onNavigate('manhwa', m.id)}
                isFavorite
                onToggleFavorite={() => toggleFavorite('manhwa', m.id)}
              />
            ))}
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}

function MetricCard({ label, value }) {
  return (
    <div className="metric-card">
      <div className="metric-value">
        <AnimatedCounter value={value} />
      </div>
      <div className="metric-label">{label}</div>
    </div>
  );
}
