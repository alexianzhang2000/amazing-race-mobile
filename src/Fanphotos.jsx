// Two photo prints held up together: the first date (left) and her new photo at the gallery (right),
// overlapping like a fanned pair, both fully visible.
export default function FanPhotos({
  then,
  now,
  thenLabel = 'first date',
  nowLabel = 'today',
  thenAlt = 'Our first date',
  nowAlt = 'Your photo at the gallery',
  className = '',
  ariaLabel = 'Then and now',
}) {
  return (
    <div className={`fan ${className}`.trim()} role="group" aria-label={ariaLabel}>
      <figure className="fan-then">
        <img src={then} alt={thenAlt} />
        <figcaption>{thenLabel}</figcaption>
      </figure>
      <figure className="fan-now" key={now}>
        <img src={now} alt={nowAlt} />
        <figcaption>{nowLabel}</figcaption>
      </figure>
    </div>
  );
}