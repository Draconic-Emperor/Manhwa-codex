import React, { useEffect, useState } from 'react';
import { Menu, X, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function AppShell({ view, onNavigate, onOpenSearch, onOpenAuth, children }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 768) setMobileOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  function handleNavigate(target, id) {
    setMobileOpen(false);
    onNavigate(target, id);
  }

  const appClass = [
    'app',
    desktopCollapsed ? 'sidebar-collapsed' : '',
    mobileOpen ? 'sidebar-mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={appClass}>
      <header className="mobile-topbar">
        <button
          type="button"
          className="icon-btn mobile-menu-btn"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="mobile-topbar-brand">
          <span>CODEX</span>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={onOpenSearch}
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </header>

      {mobileOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <Sidebar
        view={view}
        onNavigate={handleNavigate}
        onOpenSearch={() => {
          setMobileOpen(false);
          onOpenSearch();
        }}
        onOpenAuth={() => {
          setMobileOpen(false);
          onOpenAuth();
        }}
        collapsed={desktopCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className="main-content" id="main-content">
        <button
          type="button"
          className="desktop-collapse-btn icon-btn"
          onClick={() => setDesktopCollapsed((c) => !c)}
          title={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {desktopCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>

        {isOffline && (
          <div className="offline-banner" role="status">
            You're offline. Changes won't save until your connection returns.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}