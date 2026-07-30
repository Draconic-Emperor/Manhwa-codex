import React from 'react';
import { BookmarkIcon } from 'lucide-react';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { ManhwaCard } from '../../components/cards/ManhwaCard';
import { CharacterCard } from '../../components/cards/CharacterCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { useFavorites } from '../../hooks/useFavorites';

export function CollectionsView({ manhwaList, characterList, getManhwa, onOpenManhwa, onOpenCharacter }) {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const favoriteManhwa = manhwaList.filter((m) => favorites.manhwa?.includes(m.id));
  const favoriteCharacters = characterList.filter((c) => favorites.character?.includes(c.id));
  const isEmpty = favoriteManhwa.length === 0 && favoriteCharacters.length === 0;

  return (
    <div className="view-container">
      <SectionHeader icon={BookmarkIcon} title="Your Collections" />
      <p className="text-sm collections-note">
        Saved on this device. Tap the heart on any card to add or remove it.
      </p>

      {isEmpty ? (
        <EmptyState
          icon={BookmarkIcon}
          title="Nothing saved yet"
          subtitle="Tap the heart icon on a series or character card to bookmark it here."
        />
      ) : (
        <>
          {favoriteManhwa.length > 0 && (
            <>
              <SectionHeader title="Series" />
              <div className="cards-grid">
                {favoriteManhwa.map((m) => (
                  <ManhwaCard
                    key={m.id}
                    manhwa={m}
                    onClick={() => onOpenManhwa(m.id)}
                    isFavorite
                    onToggleFavorite={() => toggleFavorite('manhwa', m.id)}
                  />
                ))}
              </div>
            </>
          )}
          {favoriteCharacters.length > 0 && (
            <>
              <SectionHeader title="Characters" />
              <div className="cards-grid">
                {favoriteCharacters.map((c) => (
                  <CharacterCard
                    key={c.id}
                    character={c}
                    manhwaTitle={getManhwa(c.manhwa_id)?.title}
                    onClick={() => onOpenCharacter(c.id)}
                    isFavorite
                    onToggleFavorite={() => toggleFavorite('character', c.id)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
