export const RANKS = [
  { id: 'unparalleled', name: 'Unparalleled', emoji: 'SS', color: '#c084fc' },
  { id: 'apex', name: 'Apex', emoji: 'S', color: '#fbbf24' },
  { id: 'severe', name: 'Severe', emoji: 'A', color: '#ef4444' },
  { id: 'high', name: 'High', emoji: 'B', color: '#06b6d4' },
  { id: 'moderate', name: 'Moderate', emoji: 'C', color: '#10b981' },
  { id: 'unranked', name: 'Unranked', emoji: 'E', color: '#6b7280' },
];

export const RANK_ORDER = {
  unparalleled: 6,
  apex: 5,
  severe: 4,
  high: 3,
  moderate: 2,
  unranked: 1,
};

export const INSIGHT_TYPES = [
  { id: 'theory', name: 'Theory', icon: '💭' },
  { id: 'lore_fact', name: 'Lore Fact', icon: '❄️' },
  { id: 'analysis', name: 'Analysis', icon: '✨' },
  { id: 'question', name: 'Question', icon: '❓' },
];

export const STATUSES = ['ongoing', 'completed', 'hiatus'];

export const SORT_OPTIONS = [
  { id: 'newest', name: 'Newest' },
  { id: 'oldest', name: 'Oldest' },
  { id: 'alphabetical', name: 'Alphabetical' },
  { id: 'rank', name: 'Rank' },
];

// --- Feature flags -----------------------------------------------------
// These features need columns/tables that may not exist in your Supabase
// project yet. They are OFF by default so nothing breaks against your
// current schema. See supabase/OPTIONAL_SCHEMA_UPGRADE.sql for the SQL
// to add them, then flip the flag to `true`.
export const FEATURES = {
  // character.stats jsonb column (strength/speed/intelligence/endurance/mana/influence)
  CHARACTER_STATS: false,
  // manhwa.aliases / character.aliases + character.abilities text[] columns
  ALIASES_AND_ABILITIES: true, // the original detail views already read these, so we assume they exist
};

export const STAT_KEYS = ['strength', 'speed', 'intelligence', 'endurance', 'mana', 'influence'];
