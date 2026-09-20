import React, { useEffect, useState } from 'react';
import { Menu, X, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function AppShell({ view, onNavigate, onOpenSearch, onOpenAuth, children }) {
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine);
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
    const onResize = () => {
      if (window.innerWidth > 768) setMobileOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = mobileOpen ? 'hidden' : previousOverflow;
    return () => { document.body.style.overflow = previousOverflow; };
  }, [mobileOpen]);

  function handleNavigate(target, id) {
    setMobileOpen(false);
    onNavigate(target, id);
  }

  return (
    <div className={`app ${desktopCollapsed ? 'sidebar-collapsed' : ''} ${mobileOpen ? 'sidebar-mobile-open' : ''}`}>
      <header className="mobile-topbar">
        <button type="button" className="icon-btn mobile-menu-btn" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileOpen}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="mobile-topbar-brand">MANHWA CONSOLE</div>
        <button type="button" className="icon-btn" onClick={onOpenSearch} aria-label="Query the archive"><Search size={18} /></button>
      </header>

      {mobileOpen && <button type="button" className="sidebar-backdrop" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}

      <Sidebar
        view={view}
        onNavigate={handleNavigate}
        onOpenSearch={() => { setMobileOpen(false); onOpenSearch(); }}
        onOpenAuth={() => { setMobileOpen(false); onOpenAuth(); }}
        collapsed={desktopCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className="main-content" id="main-content" tabIndex={-1}>
        <button type="button" className="desktop-collapse-btn icon-btn" onClick={() => setDesktopCollapsed((collapsed) => !collapsed)} title={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-label={desktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {desktopCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
        </button>
        {isOffline && <div className="offline-banner" role="status">You are offline. Changes may not save until your connection returns.</div>}
        {children}
      </main>
    </div>
  );
}
