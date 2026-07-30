import React, { useState } from 'react';
import { Field } from '../ui/Field';
import { ImageUploader } from '../ui/ImageUploader';
import { RANKS, FEATURES } from '../../constants';

function toCsv(value) {
  if (!value) return '';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

export function CharacterForm({ initial, manhwaList, defaultManhwaId, onSubmit, onCancel, saving, error }) {
  const [data, setData] = useState(() => {
    if (initial) {
      return {
        ...initial,
        aliases: toCsv(initial.aliases),
        abilities: toCsv(initial.abilities),
        image_url: initial.image_url || '',
        manhwa_id: initial.manhwa_id || defaultManhwaId || '',
        rank: initial.rank || 'moderate',
      };
    }
    return {
      name: '',
      role: '',
      description: '',
      image_url: '',
      manhwa_id: defaultManhwaId || '',
      rank: 'moderate',
      aliases: '',
      abilities: '',
    };
  });

  function submit(e) {
    e.preventDefault();
    const payload = {
      name: data.name,
      role: data.role || null,
      description: data.description || null,
      image_url: data.image_url || null,
      manhwa_id: data.manhwa_id,
      rank: data.rank,
    };
    if (FEATURES.ALIASES_AND_ABILITIES) {
      payload.aliases = (data.aliases || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      payload.abilities = (data.abilities || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    onSubmit(payload);
  }

  return (
    <form onSubmit={submit} className="form">
      {error && (
        <div className="error-msg" role="alert">
          {error}
        </div>
      )}
      <Field label="Manhwa">
        <select
          className="codex-input w-full"
          value={data.manhwa_id}
          onChange={(e) => setData({ ...data, manhwa_id: e.target.value })}
          required
        >
          <option value="">Select a manhwa</option>
          {manhwaList.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Name">
        <input
          type="text"
          className="codex-input w-full"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
        />
      </Field>
      <Field label="Role">
        <input
          type="text"
          className="codex-input w-full"
          value={data.role || ''}
          onChange={(e) => setData({ ...data, role: e.target.value })}
          placeholder="Protagonist, Antagonist, Supporting…"
        />
      </Field>
      <ImageUploader
        label="Character Image"
        value={data.image_url}
        onChange={(url) => setData({ ...data, image_url: url })}
        folder="characters"
      />
      <Field label="Description">
        <textarea
          className="codex-input w-full"
          rows="4"
          value={data.description || ''}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
      </Field>
      {FEATURES.ALIASES_AND_ABILITIES && (
        <>
          <Field label="Aliases" hint="comma-separated">
            <input
              type="text"
              className="codex-input w-full"
              value={data.aliases}
              onChange={(e) => setData({ ...data, aliases: e.target.value })}
              placeholder="Shadow Monarch, Sung Jinwoo"
            />
          </Field>
          <Field label="Abilities" hint="comma-separated">
            <input
              type="text"
              className="codex-input w-full"
              value={data.abilities}
              onChange={(e) => setData({ ...data, abilities: e.target.value })}
              placeholder="Shadow Extraction, Ruler's Authority"
            />
          </Field>
        </>
      )}
      <Field label="Rank">
        <select
          className="codex-input w-full"
          value={data.rank}
          onChange={(e) => setData({ ...data, rank: e.target.value })}
        >
          {RANKS.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </Field>
      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}
