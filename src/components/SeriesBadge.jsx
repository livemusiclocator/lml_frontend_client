// Gigs in a series - a festival like BIGSOUND, a residency, a regular night -
// carry the series name so a run of them reads as one thing rather than a
// hundred unrelated listings. The api sends "" as often as null for a gig in no
// series, so anything falsy renders nothing.
const SeriesBadge = ({ series, className = "" }) => {
  if (!series) {
    return null;
  }
  return (
    <span className={`series-badge ${className}`} aria-label="Gig series">
      {series}
    </span>
  );
};

export default SeriesBadge;
