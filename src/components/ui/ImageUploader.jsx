import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../supabase';

const MAX_SIZE_MB = 5;
const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif';

/**
 * Upload to Supabase Storage bucket "covers".
 * Falls back to pasting a URL if storage isn't set up yet.
 * Bucket should be public (or use signed URLs).
 */
export function ImageUploader({ label = 'Image', value, onChange, folder = 'covers' }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  async function uploadFile(file) {
    if (!file) return;
    setError('');
    if (!ACCEPT.split(',').includes(file.type)) {
      setError('Please use JPG, PNG, WebP, or GIF.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Image must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type });

      if (uploadError) {
        // Storage may not be configured — fall back to object URL for local preview
        // and tell the user to paste a public URL instead.
        console.warn('Storage upload failed, using local preview:', uploadError.message);
        const localUrl = URL.createObjectURL(file);
        onChange(localUrl);
        setError(
          'Cloud storage unavailable. Preview is local only — paste a public image URL below to save permanently.'
        );
        return;
      }

      const { data } = supabase.storage.from('covers').getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div className="image-uploader">
      <label>{label}</label>

      {value ? (
        <div className="image-uploader-preview">
          <img src={value} alt={`${label} preview`} loading="lazy" />
          <button
            type="button"
            className="image-uploader-remove"
            onClick={() => onChange('')}
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          className={`image-uploader-dropzone ${dragOver ? 'drag-over' : ''}`}
          onClick={() => !uploading && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2 size={28} className="spin" />
              <span>Uploading…</span>
            </>
          ) : (
            <>
              <Upload size={28} />
              <span>Drop an image or click to upload</span>
              <small>JPG · PNG · WebP · GIF · max {MAX_SIZE_MB}MB</small>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={onFileChange}
        hidden
        disabled={uploading}
      />

      {error && (
        <small className="image-uploader-error" role="alert">
          {error}
        </small>
      )}

      <details className="image-uploader-url-fallback">
        <summary>
          <ImageIcon size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> Or paste an
          image URL
        </summary>
        <input
          type="url"
          className="codex-input w-full"
          value={value?.startsWith('blob:') ? '' : value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://…"
        />
      </details>
    </div>
  );
}
