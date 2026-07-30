import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { manhwaService } from '../services/manhwaService';
import { characterService } from '../services/characterService';
import { insightService } from '../services/insightService';
import { useToast } from './ToastContext';

const DataContext = createContext(null);

function sanitizePayload(payload) {
  const next = { ...payload };
  for (const key of ['cover_image', 'image_url']) {
    if (typeof next[key] === 'string' && next[key].startsWith('blob:')) {
      next[key] = null;
    }
  }
  return next;
}

export function DataProvider({ children }) {
  const [manhwaList, setManhwaList] = useState([]);
  const [characterList, setCharacterList] = useState([]);
  const [insightList, setInsightList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const loadAll = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const [manhwa, characters, insights] = await Promise.all([
        manhwaService.list(),
        characterService.list(),
        insightService.list(),
      ]);
      setManhwaList(manhwa || []);
      setCharacterList(characters || []);
      setInsightList(insights || []);
    } catch (err) {
      console.error('Error loading archive data:', err);
      setLoadError(err.message || 'Failed to load the archive.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function saveManhwa(formData, editId) {
    setSaving(true);
    try {
      const clean = sanitizePayload(formData);
      if (editId) {
        const updated = await manhwaService.update(editId, clean);
        setManhwaList((list) => list.map((m) => (m.id === editId ? { ...m, ...updated } : m)));
        toast.success('Series updated.');
      } else {
        const created = await manhwaService.create(clean);
        if (created) setManhwaList((list) => [...list, created]);
        toast.success('Series added to the codex.');
      }
      return { ok: true };
    } catch (err) {
      toast.error(err.message);
      return { ok: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }

  async function deleteManhwa(id) {
    try {
      await manhwaService.remove(id);
      setManhwaList((list) => list.filter((m) => m.id !== id));
      toast.success('Series removed.');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  }

  async function saveCharacter(formData, editId) {
    setSaving(true);
    try {
      const clean = sanitizePayload(formData);
      if (editId) {
        const updated = await characterService.update(editId, clean);
        setCharacterList((list) => list.map((c) => (c.id === editId ? { ...c, ...updated } : c)));
        toast.success('Character updated.');
      } else {
        const created = await characterService.create(clean);
        if (created) setCharacterList((list) => [...list, created]);
        toast.success('Character added.');
      }
      return { ok: true };
    } catch (err) {
      toast.error(err.message);
      return { ok: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }

  async function deleteCharacter(id) {
    try {
      await characterService.remove(id);
      setCharacterList((list) => list.filter((c) => c.id !== id));
      toast.success('Character removed.');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  }

  async function addInsight(characterId, payload) {
    setSaving(true);
    try {
      const created = await insightService.create({ character_id: characterId, ...payload });
      if (created) setInsightList((list) => [created, ...list]);
      toast.success('Insight shared.');
      return { ok: true };
    } catch (err) {
      toast.error(err.message);
      return { ok: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }

  async function deleteInsight(id) {
    try {
      await insightService.remove(id);
      setInsightList((list) => list.filter((i) => i.id !== id));
      toast.success('Insight removed.');
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    }
  }

  const getManhwa = useCallback((id) => manhwaList.find((m) => m.id === id), [manhwaList]);
  const getCharacter = useCallback((id) => characterList.find((c) => c.id === id), [characterList]);
  const charactersOf = useCallback(
    (manhwaId) => characterList.filter((c) => c.manhwa_id === manhwaId),
    [characterList]
  );
  const insightsOf = useCallback(
    (characterId) => insightList.filter((i) => i.character_id === characterId),
    [insightList]
  );

  const value = useMemo(
    () => ({
      manhwaList,
      characterList,
      insightList,
      loading,
      loadError,
      saving,
      reload: loadAll,
      saveManhwa,
      deleteManhwa,
      saveCharacter,
      deleteCharacter,
      addInsight,
      deleteInsight,
      getManhwa,
      getCharacter,
      charactersOf,
      insightsOf,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [manhwaList, characterList, insightList, loading, loadError, saving]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within a DataProvider');
  return ctx;
}
