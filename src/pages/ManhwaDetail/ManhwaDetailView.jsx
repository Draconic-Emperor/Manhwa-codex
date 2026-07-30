import React, { useState } from 'react';
import { Users, Clock, MessageSquare, Layers, Trash2 } from 'lucide-react';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { RankBadge, StatusPill, GenrePill } from '../../components/ui/Badge';
import { CharacterCard } from '../../components/cards/CharacterCard';
import { ManhwaCard } from '../../components/cards/ManhwaCard';
import { InsightCard } from '../../components/cards/InsightCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useFavorites } from '../../hooks/useFavorites';
import { csvToArray, rankWeight } from '../../utils/format';

export function ManhwaDetailView({
  manhwa, characters, allManhwa, insightsForManhwa,
  onBack, onOpenCharacter, onOpenManhwa, onEdit, onAddCharacter, onDelete,
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const genres = csvToArray(manhwa.genres);

  const similar = allManhwa
    .filter((m) => m.id !== manhwa.id && csvToArray(m.genres).some((g) => genres.includes(g)))
    .slice(0, 4);

  const powerScaling = [...characters].sort((a, b) => rankWeight(b.rank) - rankWeight(a.rank));

  return (
    <div className="view-container">
      <button className="btn-back" onClick={onBack} type="button">← Back</button>

      {manhwa.cover_image && (
        <div className="detail-cover-banner">
          <img src={manhwa.cover_image} alt={manhwa.title} className="detail-cover-banner-image" />
        </div>
      )}

      <div className="detail-header">
        <RankBadge rank={manhwa.rank} size="lg" />
        <div className="detail-info">
          <h1>{manhwa.title}</h1>
          <p>{manhwa.author}</p>
          {manhwa.status && <StatusPill status={manhwa.status} />}
        </div>
        <div className="detail-actions">
          <button
            className={`icon-btn ${isFavorite('manhwa', manhwa.id) ? 'active' : ''}`}
            onClick={() => toggleFavorite('manhwa', manhwa.id)}
            title="Toggle favorite"
            type="button"
          >
            ♥
          </button>
          <button className="btn-secondary" onClick={onEdit} type="button">Edit</button>
          <button className="icon-btn" onClick={() => setConfirmingDelete(true)} title="Delete series" type="button">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {manhwa.description && <p className="detail-description">{manhwa.description}</p>}

      {genres.length > 0 && (
        <div className="genres">
          {genres.map((g) => (
            <GenrePill key={g}>{g}</GenrePill>
          ))}
        </div>
      )}

      <SectionHeader icon={Users} title={`Character Gallery (${characters.length})`} />
      {characters.length > 0 ? (
        <div className="cards-grid">
          {characters.map((c) => (
            <CharacterCard key={c.id} character={c} manhwaTitle={manhwa.title} onClick={() => onOpenCharacter(c.id)} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No characters yet"
          subtitle="Add characters to this series."
          actionLabel="Add Character"
          onAction={onAddCharacter}
        />
      )}
      <button className="btn-primary" onClick={onAddCharacter} type="button">+ Add Character</button>

      {powerScaling.length > 0 && (
        <>
          <SectionHeader icon={Layers} title="Power Scaling" />
          <div className="power-scaling-list">
            {powerScaling.map((c, i) => (
              <div key={c.id} className="power-scaling-row" onClick={() => onOpenCharacter(c.id)}>
                <span className="power-rank-num">#{i + 1}</span>
                <RankBadge rank={c.rank} size="sm" />
                <span className="power-name">{c.name}</span>
                <div className="power-bar-track">
                  <div
                    className="power-bar-fill"
                    style={{ width: `${(rankWeight(c.rank) / 6) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <SectionHeader icon={Clock} title="Timeline" />
      <EmptyState icon={Clock} title="Timeline coming soon" subtitle="Chronological story events will appear here." />

      <SectionHeader icon={MessageSquare} title={`Community Theories (${insightsForManhwa.length})`} />
      {insightsForManhwa.length > 0 ? (
        <div className="insights-list">
          {insightsForManhwa.map((i) => (
            <InsightCard key={i.id} insight={i} />
          ))}
        </div>
      ) : (
        <EmptyState icon={MessageSquare} title="No theories yet" subtitle="Insights shared about this series' characters will show up here." />
      )}

      {similar.length > 0 && (
        <>
          <SectionHeader icon={Layers} title="Similar Series" />
          <div className="cards-grid">
            {similar.map((m) => (
              <ManhwaCard key={m.id} manhwa={m} onClick={() => onOpenManhwa(m.id)} />
            ))}
          </div>
        </>
      )}

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete this series?"
          message={`"${manhwa.title}" and its association with existing characters will be removed. This can't be undone.`}
          confirmLabel="Delete"
          onConfirm={() => {
            setConfirmingDelete(false);
            onDelete();
          }}
          onCancel={() => setConfirmingDelete(false)}
        />
      )}
    </div>
  );
}
