export function Modal({ title, children, tone = 'neutral' }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className={`modal modal--${tone}`}>
        {title && <h2 className="modal__title">{title}</h2>}
        <div className="modal__body">{children}</div>
      </div>
    </div>
  );
}
