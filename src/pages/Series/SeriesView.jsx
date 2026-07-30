import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { SearchFilterBar } from '../../components/search/SearchFilterBar';
import { ManhwaCard } from '../../components/cards/ManhwaCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useFilteredList } from '../../hooks/useFilteredList';
import { useFavorites } from '../../hooks/useFavorites';

export function SeriesView({ manhwaList, charactersOf, loading, onOpenManhwa, onAddManhwa }) {
  const {
    searchTerm, setSearchTerm,
    genre, setGenre, genres,
    rank, setRank,
    status, setStatus,
    sortBy, setSortBy,
    filtered,
  } = useFilteredList(manhwaList, { searchKeys: ['title', 'author'], titleKey: 'title' });
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="view-container">
      <SectionHeader
        icon={BookOpen}
        title="All Series"
        actionLabel="Add Series"
        onAction={onAddManhwa}
      />

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        genre={genre}
        onGenreChange={setGenre}
        genres={genres}
        rank={rank}
        onRankChange={setRank}
        status={status}
        onStatusChange={setStatus}
        sortBy={sortBy}
        onSortChange={setSortBy}
        placeholder="Search series by title or author..."
      />

      <div className="cards-grid">
        {loading ? (
          <CardSkeleton count={8} />
        ) : filtered.length > 0 ? (
          filtered.map((m) => (
            <ManhwaCard
              key={m.id}
              manhwa={m}
              characterCount={charactersOf(m.id).length}
              onClick={() => onOpenManhwa(m.id)}
              isFavorite={isFavorite('manhwa', m.id)}
              onToggleFavorite={() => toggleFavorite('manhwa', m.id)}
            />
          ))
        ) : manhwaList.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No series yet"
            subtitle="Start your codex by adding the first series."
            actionLabel="Add Series"
            onAction={onAddManhwa}
          />
        ) : (
          <EmptyState icon={Plus} title="No matches" subtitle="Try a different search or filter." />
        )}
      </div>
    </div>
  );
}
