import React from 'react';
import { Compass } from 'lucide-react';
import { EmptyState } from '../../components/ui/EmptyState';

export function NotFoundView({ onGoHome }) {
  return <div className="view-container"><EmptyState icon={Compass} title="Record not found" subtitle="The entry you requested is missing from the archive." actionLabel="Return to Archive" onAction={onGoHome} /></div>;
}
