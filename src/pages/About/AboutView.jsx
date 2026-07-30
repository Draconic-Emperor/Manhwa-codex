import React from 'react';
import { HelpCircle } from 'lucide-react';
import { SectionHeader } from '../../components/layout/SectionHeader';

export function AboutView() {
  return (
    <div className="view-container">
      <SectionHeader icon={HelpCircle} title="About Manhwa Codex" />
      <div className="detail-description">
        <h2>Manhwa Codex</h2>
        <p>A community-driven archive for manhwa, characters, lore, rankings and theories.</p>
        <p>Built using React and Supabase.</p>
      </div>
    </div>
  );
}
