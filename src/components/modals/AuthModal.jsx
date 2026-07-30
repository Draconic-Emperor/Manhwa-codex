import React, { useState } from 'react';
import { Modal } from './Modal';
import { Field } from '../ui/Field';
import { BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export function AuthModal({ onClose }) {
  const { signIn, signUp } = useAuth();
  const toast = useToast();
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      title={mode === 'signin' ? 'Enter the Codex' : 'Join the Archive'}
      onClose={onClose}
    >
      <div className="auth-hero">
        <div className="auth-hero-icon">
          {mode === 'signin' ? <BookOpen size={28} /> : <Sparkles size={28} />}
        </div>
        <p className="auth-hero-text">
          {mode === 'signin'
            ? 'Sign in to contribute lore, rank characters, and shape the archive.'
            : 'Create an account to upload series, characters, and share theories with the realm.'}
        </p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        {error && (
          <div className="error-msg" role="alert">
            {error}
          </div>
        )}
        <Field label="Email">
          <input
            type="email"
            className="codex-input w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@realm.mail"
          />
        </Field>
        <Field label="Password">
          <input
            type="password"
            className="codex-input w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            placeholder="••••••••"
          />
        </Field>
        <button type="submit" className="btn-primary w-full auth-submit" disabled={submitting}>
          {submitting
            ? 'Please wait…'
            : mode === 'signin'
              ? 'Sign In to Codex'
              : 'Create Account'}
        </button>
        <div className="auth-switch">
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError('');
            }}
          >
            {mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
