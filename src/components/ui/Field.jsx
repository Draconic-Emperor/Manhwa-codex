import React, { useId } from 'react';

export function Field({ label, children, hint, htmlFor }) {
  const autoId = useId();
  const id = htmlFor || autoId;
  const child = React.isValidElement(children) ? React.cloneElement(children, { id }) : children;
  return (
    <div className="field">
      {label && <label htmlFor={id}>{label}</label>}
      {child}
      {hint && <small>{hint}</small>}
    </div>
  );
}
