import React from 'react';

export function EmptyState({ icon: Icon, title, subtitle, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={40} aria-hidden="true" />}
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      {actionLabel && onAction && (
        <button className="btn-primary" onClick={onAction} type="button">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
