// Two photo prints held up together: the first date (left) and her new photo at the gallery (right),
// overlapping like a fanned pair, both fully visible.
export default function FanPhotos({ then, now, thenLabel = 'first date', nowLabel = 'today' }) {
  return (
    <div className="fan" role="group" aria-label="Then and now">
      <figure className="fan-then">
        <img src={then} alt="Our first date" />
        <figcaption>{thenLabel}</figcaption>
      </figure>
      <figure className="fan-now" key={now}>
        <img src={now} alt="Your photo at the gallery" />
        <figcaption>{nowLabel}</figcaption>
      </figure>
    </div>
  );
}