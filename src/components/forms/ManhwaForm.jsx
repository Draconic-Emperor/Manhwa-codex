import React, { useState } from 'react';
import { Field } from '../ui/Field';
import { ImageUploader } from '../ui/ImageUploader';
import { RANKS, STATUSES } from '../../constants';

export function ManhwaForm({ initial, onSubmit, onCancel, saving, error }) {
  const [data, setData] = useState(
    initial
      ? {
          title: initial.title || '',
          author: initial.author || '',
          cover_image: initial.cover_image || '',
          description: initial.description || '',
          genres: initial.genres || '',
          status: initial.status || 'ongoing',
          rank: initial.rank || 'moderate',
        }
      : {
          title: '',
          author: '',
          cover_image: '',
          description: '',
          genres: '',
          status: 'ongoing',
          rank: 'moderate',
        }
  );

  function submit(e) {
    e.preventDefault();
    onSubmit({
      title: data.title,
      author: data.author || null,
      cover_image: data.cover_image || null,
      description: data.description || null,
      genres: data.genres || null,
      status: data.status,
      rank: data.rank,
    });
  }

  return (
    <form onSubmit={submit} className="form">
      {error && (
        <div className="error-msg" role="alert">
          {error}
        </div>
      )}
      <Field label="Title">
        <input
          type="text"
          className="codex-input w-full"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          required
        />
      </Field>
      <Field label="Author">
        <input
          type="text"
          className="codex-input w-full"
          value={data.author}
          onChange={(e) => setData({ ...data, author: e.target.value })}
        />
      </Field>
      <ImageUploader
        label="Cover Image"
        value={data.cover_image}
        onChange={(url) => setData({ ...data, cover_image: url })}
        folder="manhwa"
      />
      <Field label="Description">
        <textarea
          className="codex-input w-full"
          rows="4"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
      </Field>
      <Field label="Genres" hint="comma-separated">
        <input
          type="text"
          className="codex-input w-full"
          value={data.genres}
          onChange={(e) => setData({ ...data, genres: e.target.value })}
          placeholder="Action, Fantasy, Adventure"
        />
      </Field>
      <Field label="Status">
        <select
          className="codex-input w-full"
          value={data.status}
          onChange={(e) => setData({ ...data, status: e.target.value })}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s[0].toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </Field>
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
