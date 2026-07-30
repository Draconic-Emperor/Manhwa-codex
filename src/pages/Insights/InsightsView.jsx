import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { SectionHeader } from '../../components/layout/SectionHeader';
import { InsightTypeTag } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate } from '../../utils/format';
import { INSIGHT_TYPES } from '../../constants';

export function InsightsView({ insightList, getCharacter, onOpenCharacter }) {
  const [typeFilter, setTypeFilter] = useState('');
  const filtered = typeFilter ? insightList.filter((i) => i.type === typeFilter) : insightList;

  return (
    <div className="view-container">
      <SectionHeader icon={Lightbulb} title="Community Insights" />

      <div className="search-filter-bar">
        <select
          className="codex-input"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          aria-label="Filter by insight type"
        >
          <option value="">All Types</option>
          {INSIGHT_TYPES.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      {filtered.length > 0 ? (
        <div className="insights-list">
          {filtered.map((insight) => {
            const character = getCharacter(insight.character_id);
            return (
              <div
                key={insight.id}
                className="insight-item"
                onClick={character ? () => onOpenCharacter(character.id) : undefined}
                role={character ? 'button' : undefined}
                tabIndex={character ? 0 : undefined}
              >
                <InsightTypeTag type={insight.type} />
                <p>{insight.text}</p>
                <small>
                  {character && <>{character.name} · </>}
                  {formatDate(insight.created_at)}
                </small>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon={Lightbulb} title="No insights shared yet" subtitle="Insights added on character pages will appear here." />
      )}
    </div>
  );
}
