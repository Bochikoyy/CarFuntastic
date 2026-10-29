export function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="toggle">
      <span className="toggle__text">
        <span className="toggle__label">{label}</span>
        {description && <span className="toggle__desc">{description}</span>}
      </span>
      <input
        type="checkbox"
        className="toggle__input"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__thumb" />
      </span>
    </label>
  );
}
