import React from 'react';
import { InsightTypeTag } from '../ui/Badge';
import { formatDate } from '../../utils/format';

export function InsightCard({ insight, characterName, onClick }) {
  return (
    <div className="card insight-card" onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      <div className="card-body">
        <InsightTypeTag type={insight.type} />
        <p className="insight-card-text">{insight.text}</p>
        <div className="card-footer">
          {characterName && <small>{characterName} · </small>}
          <small>{formatDate(insight.created_at)}</small>
        </div>
      </div>
    </div>
  );
}
