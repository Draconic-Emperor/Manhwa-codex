import React from 'react';
import { Compass } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export function NotFoundView({ onGoHome }) {
  return (
    <div className="view-container">
      <EmptyState
        icon={Compass}
        title="This page doesn't exist in the codex"
        subtitle="The entry you were looking for may have been removed or never existed."
        actionLabel="Back to Home"
        onAction={onGoHome}
      />
    </div>
  );
}
