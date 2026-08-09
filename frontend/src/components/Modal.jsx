import { useEffect } from 'react';

export default function Modal({
  show,
  title,
  subtitle,
  onClose,
  children,
  size = 'md',
  footer
}) {
  useEffect(() => {
    if (!show) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div
      className="app-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose?.();
      }}
    >
      <div className={`app-modal app-modal-${size}`} role="dialog" aria-modal="true">
        <div className="app-modal-header">
          <div>
            <h5 className="mb-0">{title}</h5>
            {subtitle && <p className="text-muted small mb-0 mt-1">{subtitle}</p>}
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="app-modal-body">{children}</div>
        {footer && <div className="app-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}
