import { RANKS, INSIGHT_TYPES, RANK_ORDER } from '../constants';

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function timeAgo(ts) {
  if (!ts) return '';
  const seconds = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [name, secs] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${name}${value > 1 ? 's' : ''} ago`;
  }
  return 'just now';
}

export function csvToArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    return value.split(',').map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export function linesToArray(str) {
  return (str || '').split('\n').map((s) => s.trim()).filter(Boolean);
}

export const rankInfo = (id) => RANKS.find((r) => r.id === id) || RANKS[RANKS.length - 1];
export const insightTypeInfo = (id) => INSIGHT_TYPES.find((t) => t.id === id) || INSIGHT_TYPES[0];
export const rankWeight = (id) => RANK_ORDER[id] ?? 0;

export function sortItems(items, sortBy, { titleKey = 'title' } = {}) {
  const list = [...items];
  switch (sortBy) {
    case 'oldest':
      return list.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
    case 'alphabetical':
      return list.sort((a, b) => (a[titleKey] || '').localeCompare(b[titleKey] || ''));
    case 'rank':
      return list.sort((a, b) => rankWeight(b.rank) - rankWeight(a.rank));
    case 'newest':
    default:
      return list.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
  }
}
