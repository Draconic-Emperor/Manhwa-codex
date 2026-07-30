import React from 'react';
import { rankInfo, insightTypeInfo } from '../../utils/format';

export function RankBadge({ rank, size = 'md' }) {
  const info = rankInfo(rank);
  const sizeMap = { sm: '24px', md: '32px', lg: '48px' };
  return (
    <div
      className="rank-badge"
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
        background: info.color,
        fontSize: size === 'sm' ? '12px' : size === 'md' ? '14px' : '20px',
      }}
      aria-label={`Rank: ${info.name}`}
      title={info.name}
    >
      {info.emoji}
    </div>
  );
}

export function StatusPill({ status }) {
  if (!status) return null;
  return (
    <span className={`status-pill status-${status}`}>
      {status.toUpperCase()}
    </span>
  );
}

export function InsightTypeTag({ type }) {
  const info = insightTypeInfo(type);
  return (
    <span className="insight-tag">
      <span aria-hidden="true">{info.icon}</span>
      <span>{info.name}</span>
    </span>
  );
}

export function GenrePill({ children }) {
  return <span className="genre-pill">{children}</span>;
}
