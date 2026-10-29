export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
