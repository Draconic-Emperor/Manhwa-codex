import React from 'react';
import { Users, Plus } from 'lucide-react';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { SearchFilterBar } from '../../components/search/SearchFilterBar';
import { CharacterCard } from '../../components/cards/CharacterCard';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useFilteredList } from '../../hooks/useFilteredList';
import { useFavorites } from '../../hooks/useFavorites';

export function CharactersView({ characterList, getManhwa, loading, onOpenCharacter, onAddCharacter }) {
  const {
    searchTerm, setSearchTerm,
    rank, setRank,
    sortBy, setSortBy,
    filtered,
  } = useFilteredList(characterList, { searchKeys: ['name', 'role'], titleKey: 'name' });
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="view-container">
      <SectionHeader
        icon={Users}
        title="All Characters"
        actionLabel="Add Character"
        onAction={onAddCharacter}
      />

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showGenre={false}
        showStatus={false}
        rank={rank}
        onRankChange={setRank}
        sortBy={sortBy}
        onSortChange={setSortBy}
        placeholder="Search characters by name or role..."
      />

      <div className="cards-grid">
        {loading ? (
          <CardSkeleton count={8} />
        ) : filtered.length > 0 ? (
          filtered.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              manhwaTitle={getManhwa(character.manhwa_id)?.title}
              onClick={() => onOpenCharacter(character.id)}
              isFavorite={isFavorite('character', character.id)}
              onToggleFavorite={() => toggleFavorite('character', character.id)}
            />
          ))
        ) : characterList.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No characters yet"
            subtitle="Add a character to a series to get started."
            actionLabel="Add Character"
            onAction={onAddCharacter}
          />
        ) : (
          <EmptyState icon={Plus} title="No matches" subtitle="Try a different search or filter." />
        )}
      </div>
    </div>
  );
}
