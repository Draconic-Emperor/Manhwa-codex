import React from 'react';
import { HelpCircle, BookOpen, Shield, Sparkles } from 'lucide-react';
import { SectionHeader } from '../../components/layout/SectionHeader';

export function AboutView() {
  return (
    <div className="view-container archive-page">
      <SectionHeader icon={HelpCircle} title="About the Console" />
      <section className="lore-panel about-panel">
        <p className="eyebrow">Access granted</p>
        <h1>MANHWA CONSOLE</h1>
        <p className="lead">Access the Archive. Discover Worlds. Uncover Legends.</p>
        <p>Manhwa Console is a community-driven knowledge archive for series, entities, lore, rankings, and theories. It is built for readers who do more than follow stories — they map the worlds inside them.</p>
        <div className="about-grid">
          <div><BookOpen size={22} /><h3>Living records</h3><p>Catalog series and preserve the details that make each world memorable.</p></div>
          <div><Shield size={22} /><h3>Classified entities</h3><p>Track characters, affiliations, abilities, and evolving power rankings.</p></div>
          <div><Sparkles size={22} /><h3>Shared knowledge</h3><p>Contribute theories and insights to uncover what lies beneath the surface.</p></div>
        </div>
      </section>
    </div>
  );
}
