import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Users, Lightbulb } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export function GlobalSearchModal({ onClose, onNavigate }) {
  const { manhwaList, characterList, insightList } = useData();
  const [term, setTerm] = useState('');

  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const results = useMemo(() => {
    const t = term.trim().toLowerCase();
    if (!t) return { manhwa: [], characters: [], insights: [] };
    return {
      manhwa: manhwaList.filter((m) => m.title?.toLowerCase().includes(t)).slice(0, 5),
      characters: characterList.filter((c) => c.name?.toLowerCase().includes(t)).slice(0, 5),
      insights: insightList.filter((i) => i.text?.toLowerCase().includes(t)).slice(0, 5),
    };
  }, [term, manhwaList, characterList, insightList]);

  const hasResults = results.manhwa.length || results.characters.length || results.insights.length;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal wide global-search-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
      >
        <div className="modal-body">
          <input
            autoFocus
            type="text"
            className="codex-input w-full global-search-input"
            placeholder="Search series, characters, insights..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />

          {term && !hasResults && <p className="text-sm">No matches yet — keep typing.</p>}

          {results.manhwa.length > 0 && (
            <div className="global-search-group">
              <h4><BookOpen size={14} /> Series</h4>
              {results.manhwa.map((m) => (
                <button key={m.id} className="global-search-result" onClick={() => onNavigate('manhwa', m.id)}>
                  {m.title}
                </button>
              ))}
            </div>
          )}

          {results.characters.length > 0 && (
            <div className="global-search-group">
              <h4><Users size={14} /> Characters</h4>
              {results.characters.map((c) => (
                <button key={c.id} className="global-search-result" onClick={() => onNavigate('character', c.id)}>
                  {c.name}
                </button>
              ))}
            </div>
          )}

          {results.insights.length > 0 && (
            <div className="global-search-group">
              <h4><Lightbulb size={14} /> Insights</h4>
              {results.insights.map((i) => (
                <div key={i.id} className="global-search-result global-search-result-static">
                  {i.text?.slice(0, 90)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
