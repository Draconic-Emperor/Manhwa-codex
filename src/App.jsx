import React, { useEffect, useState } from 'react';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider, useData } from './contexts/DataContext';

import { AppShell } from './components/layout/AppShell';
import { Modal } from './components/modals/Modal';
import { AuthModal } from './components/modals/AuthModal';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { ManhwaForm } from './components/forms/ManhwaForm';
import { CharacterForm } from './components/forms/CharacterForm';

import { HomeView } from './pages/Home/HomeView';
import { SeriesView } from './pages/Series/SeriesView';
import { CharactersView } from './pages/Characters/CharactersView';
import { ManhwaDetailView } from './pages/ManhwaDetail/ManhwaDetailView';
import { CharacterDetailView } from './pages/CharacterDetail/CharacterDetailView';
import { InsightsView } from './pages/Insights/InsightsView';
import { RankingsView } from './pages/Rankings/RankingsView';
import { CollectionsView } from './pages/Collections/CollectionsView';
import { AboutView } from './pages/About/AboutView';
import { NotFoundView } from './pages/NotFound/NotFoundView';

const KNOWN_VIEWS = ['home', 'series', 'characters', 'manhwa', 'character', 'insights', 'rankings', 'collections', 'about'];

function ManhwaCodexApp() {
  const data = useData();
  const [view, setView] = useState('home');
  const [selectedManhwaId, setSelectedManhwaId] = useState(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);

  const [showManhwaForm, setShowManhwaForm] = useState(false);
  const [showCharacterForm, setShowCharacterForm] = useState(false);
  const [editingManhwa, setEditingManhwa] = useState(null);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  function navigate(target, id) {
    if (target === 'manhwa') setSelectedManhwaId(id);
    if (target === 'character') setSelectedCharacterId(id);
    setView(target);
    document.getElementById('main-content')?.scrollTo?.({ top: 0, behavior: 'smooth' });
  }

  async function handleSaveManhwa(formData) {
    setFormError('');
    const result = await data.saveManhwa(formData, editingManhwa?.id);
    if (result.ok) {
      setShowManhwaForm(false);
      setEditingManhwa(null);
    } else {
      setFormError(result.error);
    }
  }

  async function handleSaveCharacter(formData) {
    setFormError('');
    const result = await data.saveCharacter(formData, editingCharacter?.id);
    if (result.ok) {
      setShowCharacterForm(false);
      setEditingCharacter(null);
    } else {
      setFormError(result.error);
    }
  }

  if (data.loading) {
    return (
      <div className="loading-screen">
        <div className="loading-orbits" aria-hidden="true">
          <div className="orbit orbit-1" />
          <div className="orbit orbit-2" />
          <div className="orbit orbit-3" />
          <div className="loading-core" />
        </div>
        <h1 className="loading-title">MANHWA CODEX</h1>
        <p className="loading-sub">Awakening the archive…</p>
        <div className="loading-bar"><span /></div>
      </div>
    );
  }

  if (data.loadError) {
    return (
      <div className="loading-screen">
        <div className="loading-orbits" aria-hidden="true">
          <div className="orbit orbit-1" />
          <div className="loading-core error-core" />
        </div>
        <h1 className="loading-title">MANHWA CODEX</h1>
        <p className="loading-sub">{data.loadError}</p>
        <button className="btn-primary" onClick={data.reload} type="button">Retry Connection</button>
      </div>
    );
  }

  const selectedManhwa = data.getManhwa(selectedManhwaId);
  const selectedCharacter = data.getCharacter(selectedCharacterId);

  return (
    <AppShell view={view} onNavigate={navigate} onOpenSearch={() => setShowSearch(true)} onOpenAuth={() => setShowAuth(true)}>
      {view === 'home' && (
        <HomeView
          manhwaList={data.manhwaList}
          characterList={data.characterList}
          insightList={data.insightList}
          charactersOf={data.charactersOf}
          onNavigate={navigate}
          onAddManhwa={() => setShowManhwaForm(true)}
        />
      )}

      {view === 'series' && (
        <SeriesView
          manhwaList={data.manhwaList}
          charactersOf={data.charactersOf}
          loading={data.loading}
          onOpenManhwa={(id) => navigate('manhwa', id)}
          onAddManhwa={() => setShowManhwaForm(true)}
        />
      )}

      {view === 'characters' && (
        <CharactersView
          characterList={data.characterList}
          getManhwa={data.getManhwa}
          loading={data.loading}
          onOpenCharacter={(id) => navigate('character', id)}
          onAddCharacter={() => setShowCharacterForm(true)}
        />
      )}

      {view === 'manhwa' && selectedManhwa && (
        <ManhwaDetailView
          manhwa={selectedManhwa}
          characters={data.charactersOf(selectedManhwaId)}
          allManhwa={data.manhwaList}
          insightsForManhwa={data.insightList.filter((i) =>
            data.charactersOf(selectedManhwaId).some((c) => c.id === i.character_id)
          )}
          onBack={() => navigate('series')}
          onOpenCharacter={(id) => navigate('character', id)}
          onOpenManhwa={(id) => navigate('manhwa', id)}
          onEdit={() => {
            setEditingManhwa(selectedManhwa);
            setShowManhwaForm(true);
          }}
          onAddCharacter={() => setShowCharacterForm(true)}
          onDelete={async () => {
            const ok = await data.deleteManhwa(selectedManhwaId);
            if (ok) navigate('series');
          }}
        />
      )}
      {view === 'manhwa' && !selectedManhwa && <NotFoundView onGoHome={() => navigate('home')} />}

      {view === 'character' && selectedCharacter && (
        <CharacterDetailView
          character={selectedCharacter}
          manhwa={data.getManhwa(selectedCharacter.manhwa_id)}
          insights={data.insightsOf(selectedCharacterId)}
          relatedCharacters={data.charactersOf(selectedCharacter.manhwa_id).filter((c) => c.id !== selectedCharacterId)}
          saving={data.saving}
          onBack={() => navigate('characters')}
          onOpenCharacter={(id) => navigate('character', id)}
          onEdit={() => {
            setEditingCharacter(selectedCharacter);
            setShowCharacterForm(true);
          }}
          onAddInsight={(payload) => data.addInsight(selectedCharacterId, payload)}
          onDeleteInsight={data.deleteInsight}
          onDelete={async () => {
            const ok = await data.deleteCharacter(selectedCharacterId);
            if (ok) navigate('characters');
          }}
        />
      )}
      {view === 'character' && !selectedCharacter && <NotFoundView onGoHome={() => navigate('home')} />}

      {view === 'insights' && (
        <InsightsView
          insightList={data.insightList}
          getCharacter={data.getCharacter}
          onOpenCharacter={(id) => navigate('character', id)}
        />
      )}

      {view === 'rankings' && (
        <RankingsView
          characterList={data.characterList}
          getManhwa={data.getManhwa}
          onOpenCharacter={(id) => navigate('character', id)}
        />
      )}

      {view === 'collections' && (
        <CollectionsView
          manhwaList={data.manhwaList}
          characterList={data.characterList}
          getManhwa={data.getManhwa}
          onOpenManhwa={(id) => navigate('manhwa', id)}
          onOpenCharacter={(id) => navigate('character', id)}
        />
      )}

      {view === 'about' && <AboutView />}

      {!KNOWN_VIEWS.includes(view) && <NotFoundView onGoHome={() => navigate('home')} />}

      {showManhwaForm && (
        <Modal
          title={editingManhwa ? 'Edit Manhwa' : 'Add New Manhwa'}
          onClose={() => { setShowManhwaForm(false); setEditingManhwa(null); setFormError(''); }}
        >
          <ManhwaForm
            initial={editingManhwa}
            onSubmit={handleSaveManhwa}
            onCancel={() => { setShowManhwaForm(false); setEditingManhwa(null); setFormError(''); }}
            saving={data.saving}
            error={formError}
          />
        </Modal>
      )}

      {showCharacterForm && (
        <Modal
          title={editingCharacter ? 'Edit Character' : 'Add New Character'}
          onClose={() => { setShowCharacterForm(false); setEditingCharacter(null); setFormError(''); }}
        >
          <CharacterForm
            initial={editingCharacter}
            manhwaList={data.manhwaList}
            defaultManhwaId={selectedManhwaId}
            onSubmit={handleSaveCharacter}
            onCancel={() => { setShowCharacterForm(false); setEditingCharacter(null); setFormError(''); }}
            saving={data.saving}
            error={formError}
          />
        </Modal>
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
      {showSearch && (
        <GlobalSearchModal
          onClose={() => setShowSearch(false)}
          onNavigate={(target, id) => { navigate(target, id); setShowSearch(false); }}
        />
      )}
    </AppShell>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <ManhwaCodexApp />
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
