import React from 'react';
import { Search } from 'lucide-react';
import { RANKS, STATUSES, SORT_OPTIONS } from '../../constants';

export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  genre,
  onGenreChange,
  genres,
  rank,
  onRankChange,
  status,
  onStatusChange,
  showStatus = true,
  showGenre = true,
  sortBy,
  onSortChange,
  placeholder = 'Search...',
}) {
  return (
    <div className="search-filter-bar" role="search">
      <div className="search-input-wrap">
        <Search size={16} aria-hidden="true" />
        <input
          type="text"
          className="codex-input"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          aria-label="Search"
        />
      </div>

      {showGenre && (
        <select
          className="codex-input"
          value={genre}
          onChange={(e) => onGenreChange(e.target.value)}
          aria-label="Filter by genre"
        >
          <option value="">All Genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      )}

      <select
        className="codex-input"
        value={rank}
        onChange={(e) => onRankChange(e.target.value)}
        aria-label="Filter by rank"
      >
        <option value="">All Ranks</option>
        {RANKS.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>

      {showStatus && (
        <select
          className="codex-input"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      )}

      <select
        className="codex-input"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort"
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.id} value={s.id}>
            Sort: {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}
