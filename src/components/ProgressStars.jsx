export function ProgressStars({ count = 0, max = 3, size = 'md' }) {
  const stars = Array.from({ length: max }, (_, i) => i < count);
  return (
    <span className={`stars stars--${size}`} aria-label={`${count} of ${max} stars`}>
      {stars.map((filled, idx) => (
        <span key={idx} className={filled ? 'star star--filled' : 'star'} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}
