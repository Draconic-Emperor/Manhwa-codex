import React from 'react';
import { Heart } from 'lucide-react';
import { RankBadge, StatusPill } from '../ui/Badge';
import { rankInfo } from '../../utils/format';

export function ManhwaCard({ manhwa, characterCount, onClick, isFavorite, onToggleFavorite }) {
  const rank = rankInfo(manhwa.rank);
  return (
    <div
      className="card manhwa-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
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
        {manhwa.cover_image ? (
          <img src={manhwa.cover_image} alt={manhwa.title} className="cover-image" loading="lazy" />
        ) : (
          <div className="card-header" style={{ backgroundColor: rank.color }}>
            <RankBadge rank={manhwa.rank} size="lg" />
          </div>
        )}
      </div>
      <div className="card-body">
        <h3>{manhwa.title}</h3>
        <p className="text-sm">{manhwa.author}</p>
        {manhwa.status && <StatusPill status={manhwa.status} />}
        <div className="card-footer">
          <small>{characterCount ?? 0} characters</small>
        </div>
      </div>
    </div>
  );
}
