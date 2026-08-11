import React, { useEffect, useRef, useState } from 'react';

export function Modal({ title, onClose, children, wide }) {
  const modalRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Make sure onClose is callable
    const safeOnClose = typeof onClose === 'function' ? onClose : () => {};

    // Show animation (adds the CSS .show class)
    // Use a micro-tick so CSS transition runs reliably
    const t = setTimeout(() => setVisible(true), 10);

    // Lock background scrolling while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus first focusable element inside modal if any
    const focusFirst = () => {
      const el = modalRef.current?.querySelector(
        'input, textarea, select, button, [tabindex]:not([tabindex="-1"])'
      );
      if (el) el.focus();
      else modalRef.current?.focus();
    };

    focusFirst();

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        safeOnClose();
        return;
      }

      // Focus trap: keep Tab navigation inside the modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((n) => !n.hasAttribute('disabled') && n.offsetParent !== null);

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === modalRef.current) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose]);

  const handleOverlayClick = (e) => {
    // only close when clicking the overlay itself, not inner content
    if (e.target === e.currentTarget) {
      if (typeof onClose === 'function') onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} role="presentation">
      <div
        ref={modalRef}
        className={`modal ${wide ? 'wide' : ''} ${visible ? 'show' : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            className="close-btn"
            onClick={() => typeof onClose === 'function' && onClose()}
            aria-label="Close dialog"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}