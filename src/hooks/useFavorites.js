import { useCallback, useEffect, useState } from 'react';

// Favorites/bookmarks are stored in the browser only for now. They don't
// require any Supabase schema changes, so they work immediately.
// To make them shared across devices/users, see
// supabase/OPTIONAL_SCHEMA_UPGRADE.sql for a `favorites` table and swap
// this hook's implementation for one backed by favoriteService.
const STORAGE_KEY = 'manhwa-codex:favorites';

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { manhwa: [], character: [] };
  } catch {
    return { manhwa: [], character: [] };
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(read);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // storage unavailable (private mode etc.) - fail silently
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (kind, id) => favorites[kind]?.includes(id),
    [favorites]
  );

  const toggleFavorite = useCallback((kind, id) => {
    setFavorites((prev) => {
      const set = new Set(prev[kind] || []);
      if (set.has(id)) set.delete(id);
      else set.add(id);
      return { ...prev, [kind]: Array.from(set) };
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
