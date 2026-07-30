import { useMemo, useState } from 'react';
import { useDebounce } from './useDebounce';
import { csvToArray, sortItems } from '../utils/format';

// Generic instant-search + filter + sort for a list of manhwa or characters.
// `searchKeys` are the fields checked against the search term.
export function useFilteredList(items, { searchKeys = ['title', 'name'], titleKey = 'title' } = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [rank, setRank] = useState('');
  const [status, setStatus] = useState('');
  const [author, setAuthor] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const debouncedSearch = useDebounce(searchTerm, 150);

  const genres = useMemo(() => {
    const set = new Set();
    items.forEach((item) => csvToArray(item.genres).forEach((g) => set.add(g)));
    return Array.from(set).sort();
  }, [items]);

  const authors = useMemo(() => {
    const set = new Set();
    items.forEach((item) => item.author && set.add(item.author));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase();
    let list = items.filter((item) => {
      if (term) {
        const haystack = searchKeys.map((key) => (item[key] || '').toLowerCase()).join(' ');
        if (!haystack.includes(term)) return false;
      }
      if (genre && !csvToArray(item.genres).includes(genre)) return false;
      if (rank && item.rank !== rank) return false;
      if (status && item.status !== status) return false;
      if (author && item.author !== author) return false;
      return true;
    });
    return sortItems(list, sortBy, { titleKey });
  }, [items, debouncedSearch, genre, rank, status, author, sortBy, searchKeys, titleKey]);

  return {
    searchTerm,
    setSearchTerm,
    genre,
    setGenre,
    rank,
    setRank,
    status,
    setStatus,
    author,
    setAuthor,
    sortBy,
    setSortBy,
    genres,
    authors,
    filtered,
  };
}
