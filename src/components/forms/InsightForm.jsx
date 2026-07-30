import React, { useState } from 'react';
import { Field } from '../ui/Field';
import { INSIGHT_TYPES } from '../../constants';

export function InsightForm({ onSubmit, saving }) {
  const [data, setData] = useState({ type: 'theory', text: '' });

  function submit(e) {
    e.preventDefault();
    if (!data.text.trim()) return;
    onSubmit(data);
    setData({ type: 'theory', text: '' });
  }

  return (
    <form onSubmit={submit} className="form">
      <Field label="Type">
        <select
          className="codex-input w-full"
          value={data.type}
          onChange={(e) => setData({ ...data, type: e.target.value })}
        >
          {INSIGHT_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Content">
        <textarea
          className="codex-input w-full"
          rows="4"
          value={data.text}
          onChange={(e) => setData({ ...data, text: e.target.value })}
          placeholder="Share your insight..."
          required
        />
      </Field>
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Share'}
        </button>
      </div>
    </form>
  );
}
