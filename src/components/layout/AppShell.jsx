import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';

export function AppShell({ view, onNavigate, onOpenSearch, onOpenAuth, children }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

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

  return (
    <div className="app">
      <Sidebar view={view} onNavigate={onNavigate} onOpenSearch={onOpenSearch} onOpenAuth={onOpenAuth} />
      <main className="main-content" id="main-content">
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
