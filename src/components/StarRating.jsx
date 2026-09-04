// Renders colored stars given a numeric rating (0-5).
// size: px for each star. showNumber: show "4.9" next to stars.

export default function StarRating({ rating = 0, count = null, size = 16, showNumber = false }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    let fill = "none";
    if (i <= full) fill = "var(--gold)";
    else if (i === full + 1 && hasHalf) fill = "url(#half-star)";

    stars.push(
      <svg className="star-3d" key={i} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="var(--gold)" strokeWidth="1.5" style={{ flexShrink: 0 }}>
        <defs>
          <linearGradient id="half-star">
            <stop offset="50%" stopColor="var(--gold)" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }

  return (
    <span className="star-rating" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ display: "inline-flex", gap: 1 }}>{stars}</span>
      {showNumber && <span className="star-number">{rating.toFixed(1)}</span>}
      {count !== null && <span className="star-count">({count})</span>}
    </span>
  );
}
