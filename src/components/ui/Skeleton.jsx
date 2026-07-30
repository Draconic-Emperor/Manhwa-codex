import React from 'react';

export function CardSkeleton({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card skeleton-card" aria-hidden="true">
          <div className="skeleton-block skeleton-cover" />
          <div className="card-body">
            <div className="skeleton-block skeleton-line" style={{ width: '70%' }} />
            <div className="skeleton-block skeleton-line" style={{ width: '40%' }} />
          </div>
        </div>
      ))}
    </>
  );
}

export function ScrollReveal({ children, className = '' }) {
  const ref = React.useRef(null);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scroll-reveal ${visible ? 'is-visible' : ''} ${className}`}>
      {children}
    </div>
  );
}
