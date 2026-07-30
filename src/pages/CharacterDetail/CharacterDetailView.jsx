import React, { useState } from 'react';
import { Lightbulb, Users, Clock, Link2, Trash2 } from 'lucide-react';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { RankBadge, GenrePill, InsightTypeTag } from '../../components/ui/Badge';
import { CharacterCard } from '../../components/cards/CharacterCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { InsightForm } from '../../components/forms/InsightForm';
import { useFavorites } from '../../hooks/useFavorites';
import { formatDate } from '../../utils/format';
import { FEATURES, STAT_KEYS } from '../../constants';

export function CharacterDetailView({
  character, manhwa, insights, relatedCharacters, saving,
  onBack, onOpenCharacter, onEdit, onAddInsight, onDeleteInsight, onDelete,
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="view-container">
      <button className="btn-back" onClick={onBack} type="button">← Back</button>

      <div className="detail-header">
        {character.image_url ? (
          <img src={character.image_url} alt={character.name} className="character-detail-image" />
        ) : (
          <RankBadge rank={character.rank} size="lg" />
        )}
        <div className="detail-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <RankBadge rank={character.rank} size="sm" />
            <h1 style={{ margin: 0 }}>{character.name}</h1>
          </div>
          <p>{manhwa?.title}</p>
          {character.role && <p className="text-sm">{character.role}</p>}
        </div>
        <div className="detail-actions">
          <button
            className={`icon-btn ${isFavorite('character', character.id) ? 'active' : ''}`}
            onClick={() => toggleFavorite('character', character.id)}
            title="Toggle favorite"
            type="button"
          >
            ♥
          </button>
          <button className="btn-secondary" onClick={onEdit} type="button">Edit</button>
          <button className="icon-btn" onClick={() => setConfirmingDelete(true)} title="Delete character" type="button">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {character.aliases?.length > 0 && (
        <div className="aliases">
          {character.aliases.map((alias) => (
            <GenrePill key={alias}>{alias}</GenrePill>
          ))}
        </div>
      )}

      {character.description && <p className="detail-description">{character.description}</p>}

      {character.abilities?.length > 0 && (
        <>
          <h3>Abilities</h3>
          <div className="genres">
            {character.abilities.map((ability) => (
              <GenrePill key={ability}>{ability}</GenrePill>
            ))}
          </div>
        </>
      )}

      {FEATURES.CHARACTER_STATS && character.stats && (
        <>
          <SectionHeader title="Stats" />
          <div className="stats-block">
            {STAT_KEYS.map((key) => (
              <div key={key} className="stat-row">
                <span className="stat-row-label">{key}</span>
                <div className="power-bar-track">
                  <div className="power-bar-fill" style={{ width: `${character.stats[key] || 0}%` }} />
                </div>
                <span className="stat-row-value">{character.stats[key] || 0}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <SectionHeader icon={Link2} title="Relationships" />
      <EmptyState icon={Link2} title="Relationships coming soon" subtitle="Character connections will be mapped here." />

      <SectionHeader icon={Clock} title="Timeline" />
      <EmptyState icon={Clock} title="Timeline coming soon" subtitle="Key moments for this character will appear here." />

      <SectionHeader icon={Lightbulb} title={`Community Insights (${insights.length})`} />
      <div className="insights-list">
        {insights.length > 0 ? (
          insights.map((i) => (
            <div key={i.id} className="insight-item">
              <InsightTypeTag type={i.type} />
              <p>{i.text}</p>
              <div className="insight-item-footer">
                <small>{formatDate(i.created_at)}</small>
                {onDeleteInsight && (
                  <button className="link-btn" onClick={() => onDeleteInsight(i.id)} type="button">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <EmptyState icon={Lightbulb} title="No insights yet" subtitle="Be the first to share a theory." />
        )}
      </div>

      <div className="insight-form-container">
        <h3>Share an Insight</h3>
        <InsightForm onSubmit={onAddInsight} saving={saving} />
      </div>

      {relatedCharacters.length > 0 && (
        <>
          <SectionHeader icon={Users} title="Related Characters" />
          <div className="cards-grid">
            {relatedCharacters.map((c) => (
              <CharacterCard key={c.id} character={c} manhwaTitle={manhwa?.title} onClick={() => onOpenCharacter(c.id)} />
            ))}
          </div>
        </>
      )}

      {confirmingDelete && (
        <ConfirmDialog
          title="Delete this character?"
          message={`"${character.name}" and their insights history reference will be removed. This can't be undone.`}
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
