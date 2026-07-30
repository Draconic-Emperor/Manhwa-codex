import React from 'react';
import { Heart } from 'lucide-react';
import { RankBadge } from '../ui/Badge';
import { rankInfo } from '../../utils/format';

export function CharacterCard({ character, manhwaTitle, onClick, isFavorite, onToggleFavorite }) {
  return (
    <div
      className="card character-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {onToggleFavorite && (
        <button
          className={`favorite-btn ${isFavorite ? 'is-active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite();
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          type="button"
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      )}

      <div className="card-cover">
        {character.image_url ? (
          <img
            src={character.image_url}
            alt={character.name}
            className="cover-image"
            loading="lazy"
          />
        ) : (
          <div className="card-header" style={{ backgroundColor: rankInfo(character.rank).color }}>
            <RankBadge rank={character.rank} size="lg" />
          </div>
        )}
      </div>
      <div className="card-body">
        <h3>{character.name}</h3>
        {manhwaTitle && <p className="text-sm">{manhwaTitle}</p>}
        {character.role && <p className="text-xs">{character.role}</p>}
      </div>
    </div>
  );
}
