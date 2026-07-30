import React from 'react';
import { ChevronRight } from 'lucide-react';

export function SectionHeader({ icon: Icon, title, actionLabel, onAction }) {
  return (
    <div className="section-header">
      <div className="header-left">
        {Icon && <Icon size={24} aria-hidden="true" />}
        <h2>{title}</h2>
      </div>
      {actionLabel && onAction && (
        <button type="button" className="view-all" onClick={onAction}>
          {actionLabel} <ChevronRight size={16} />
        </button>
      )}
    </div>
  );
}
