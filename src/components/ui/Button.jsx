import React from 'react';

export function IconBtn({ children, onClick, title, active, ...rest }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`icon-btn ${active ? 'active' : ''}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function PrimaryButton({ children, ...rest }) {
  return (
    <button className="btn-primary" {...rest}>
      {children}
    </button>
  );
}

export function SecondaryButton({ children, ...rest }) {
  return (
    <button className="btn-secondary" type="button" {...rest}>
      {children}
    </button>
  );
}

export function DangerButton({ children, ...rest }) {
  return (
    <button className="btn-danger" type="button" {...rest}>
      {children}
    </button>
  );
}
