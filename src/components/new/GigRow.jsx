import { Link } from "react-router";
import { uniqBy } from "lodash-es";
import SaveGigButton from "@/components/shared/SaveGigButton";
import SeriesBadge from "@/components/shared/SeriesBadge";
import { useFlaggedPath } from "@/hooks/useNewLayout";

const TICKET_STATUS_LABELS = {
  selling_fast: "Selling fast",
  sold_out: "Sold out",
};

const isFree = (gig) =>
  (gig.informationTags || []).some((tag) => tag.value === "free");

const Badge = ({ children, className = "" }) => (
  <span
    className={`rounded border px-1.5 py-0.5 text-[0.6rem] font-bold tracking-[0.09em] uppercase ${className}`}
  >
    {children}
  </span>
);

/**
 * One gig in a dense list. Used by the gig list and by the map sheet, so a row
 * looks the same wherever it turns up. showVenue is off inside a sheet that is
 * already headed by the venue.
 */
const GigRow = ({ gig, showVenue = true }) => {
  const flaggedPath = useFlaggedPath();
  const genres = uniqBy(gig.genreTags || [], "value")
    .slice(0, 3)
    .map((tag) => tag.caption);
  const secondary = [showVenue ? gig.venue?.name : null, ...genres]
    .filter(Boolean)
    .join(" · ");
  const ticketStatus = TICKET_STATUS_LABELS[gig.ticket_status];
  const cancelled = gig.status === "cancelled";

  return (
    <article className="relative flex items-start gap-3 border-b border-night-hairline px-4 py-3 last:border-b-0 hover:bg-night-raised">
      <div className="w-11 shrink-0 pt-px font-mono text-meta font-medium tabular-nums text-lmlpink-light">
        {gig.start_time || "—"}
      </div>

      <div className="flex min-w-0 grow flex-col gap-1">
        {gig.series && (
          <p>
            <SeriesBadge series={gig.series} />
          </p>
        )}
        <h3 className="truncate text-item leading-tight font-semibold">
          {/* the link covers the whole row; the save button below sits above it */}
          <Link
            to={flaggedPath(`gigs/${gig.id}`)}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {gig.name}
          </Link>
          {cancelled && (
            <span className="text-ink-muted"> &middot; cancelled</span>
          )}
        </h3>
        {secondary && (
          <p className="truncate text-mini text-ink-muted">{secondary}</p>
        )}
      </div>

      <div className="relative z-10 flex shrink-0 items-center gap-2 pt-px">
        {isFree(gig) && (
          <Badge className="border-lmlpink/40 text-lmlpink-light">Free</Badge>
        )}
        {ticketStatus && (
          <Badge className="border-transparent bg-lmlpink-light text-night">
            {ticketStatus}
          </Badge>
        )}
        <SaveGigButton
          gig={gig}
          className="-my-2 -mr-3 flex size-11 items-center justify-center text-ink-dim hover:text-lmlpink-light"
          iconClassName="size-[17px]"
        />
      </div>
    </article>
  );
};

export default GigRow;
