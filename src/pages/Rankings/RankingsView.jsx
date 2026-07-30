import React from 'react';
import { Trophy } from 'lucide-react';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { RankBadge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { rankWeight } from '../../utils/format';

export function RankingsView({ characterList, getManhwa, onOpenCharacter }) {
  const ranked = [...characterList].sort((a, b) => rankWeight(b.rank) - rankWeight(a.rank));

  return (
    <div className="view-container">
      <SectionHeader icon={Trophy} title="Character Rankings" />

      {ranked.length > 0 ? (
        <div className="power-scaling-list">
          {ranked.map((c, index) => (
            <div key={c.id} className="power-scaling-row" onClick={() => onOpenCharacter(c.id)}>
              <span className="power-rank-num">#{index + 1}</span>
              <RankBadge rank={c.rank} size="sm" />
              <div>
                <div className="power-name">{c.name}</div>
                <small>{c.role} {getManhwa(c.manhwa_id) ? `· ${getManhwa(c.manhwa_id).title}` : ''}</small>
              </div>
              <div className="power-bar-track">
                <div className="power-bar-fill" style={{ width: `${(rankWeight(c.rank) / 6) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={Trophy} title="No characters to rank yet" />
      )}
    </div>
  );
}
