import React from 'react';
import {
  Home, BookOpen, Users, Lightbulb, Clock, Trophy, BookmarkIcon,
  HelpCircle, LogOut, LogIn, Search, X,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'series', label: 'Series', icon: BookOpen },
  { id: 'characters', label: 'Characters', icon: Users },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'rankings', label: 'Rankings', icon: Trophy },
  { id: 'timeline', label: 'Timeline', icon: Clock, comingSoon: true },
  { id: 'collections', label: 'Collections', icon: BookmarkIcon },
  { id: 'about', label: 'About Codex', icon: HelpCircle },
];

export function Sidebar({
  view,
  onNavigate,
  onOpenSearch,
  onOpenAuth,
  collapsed = false,
  mobileOpen = false,
  onCloseMobile,
}) {
  const { user, signOut } = useAuth();

  return (
    <aside
      className={`sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}
    >
      <div className="logo">
        <div className="logo-row">
          <div>
            <h2>CODEX</h2>
            {!collapsed && <p>Of the Webtoon Realms</p>}
          </div>
          {onCloseMobile && (
            <button
              type="button"
              className="icon-btn sidebar-close-mobile"
              onClick={onCloseMobile}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      <button
        className="global-search-trigger"
        onClick={onOpenSearch}
        type="button"
        title="Search everything"
      >
        <Search size={16} />
        {!collapsed && (
          <>
            <span>Search everything</span>
            <kbd>⌘K</kbd>
          </>
        )}
      </button>

      <nav className="nav-menu" aria-label="Main navigation">
        {NAV_ITEMS.map(({ id, label, icon: Icon, comingSoon }) => (
          <button
            key={id}
            className={`nav-item ${view === id ? 'active' : ''} ${comingSoon ? 'nav-soon' : ''}`}
            onClick={() => {
              if (comingSoon) return;
              onNavigate(id);
            }}
            aria-current={view === id ? 'page' : undefined}
            aria-disabled={comingSoon || undefined}
            title={label}
            type="button"
          >
            <Icon size={20} aria-hidden="true" />
            {!collapsed && (
              <>
                {label.toUpperCase()}
                {comingSoon && <span className="badge">soon</span>}
              </>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {user ? (
          <>
            {!collapsed && (
              <div className="user-info">
                <small>{user.email}</small>
              </div>
            )}
            <button
              className="icon-btn"
              onClick={signOut}
              title="Sign Out"
              type="button"
            >
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <button
            className={`btn-secondary ${collapsed ? '' : 'w-full'}`}
            onClick={onOpenAuth}
            type="button"
            title="Sign In"
          >
            <LogIn size={16} />
            {!collapsed && ' Sign In'}
          </button>
        )}
      </div>
    </aside>
  );
}