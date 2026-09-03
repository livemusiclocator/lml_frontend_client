import { Link } from "react-router";
import {
  ClockIcon,
  MapPinIcon,
  MicrophoneIcon,
  TicketIcon,
  ChevronRightIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { useGig, useGigSearchParams } from "@/hooks/api";
import { useFlaggedPath } from "@/hooks/useNewLayout";
import { filteredGigListPath } from "@/searchParams";
import DateTimeDisplay from "@/components/shared/DateTimeDisplay";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import SaveGigButton from "@/components/shared/SaveGigButton";
import SeriesBadge from "@/components/shared/SeriesBadge";
import Chip from "@/components/new/Chip";
import BackLink from "@/layouts/ExplorerNew/BackLink";

// the map behind this page is the hero image, so the top of the page is a hole
// you can see it through
const HERO_HEIGHT = "h-[170px]";

const Row = ({ icon: Icon, children }) => (
  <div className="flex items-start gap-3 border-b border-night-line p-3.5 last:border-b-0">
    <Icon className="mt-px size-4.5 shrink-0 text-ink-muted" />
    <div className="flex min-w-0 grow flex-col gap-1">{children}</div>
  </div>
);

const TicketsCallToAction = ({ gig }) => {
  const cheapest = gig.prices?.[0];
  if (!gig.ticketing_url) {
    return null;
  }
  return (
    <div className="px-4 pb-4">
      <a
        href={gig.ticketing_url}
        className="flex h-13 items-center justify-center gap-2 rounded-xl bg-lmlpink text-item font-bold text-white"
      >
        <TicketIcon className="size-4.5" />
        {cheapest ? `Tickets from ${cheapest.amount}` : "Tickets"}
      </a>
    </div>
  );
};

const GigError = ({ error }) => (
  <div className="flex flex-col items-center gap-4 p-8 text-center">
    <h2 className="text-title font-bold">Gig not found</h2>
    <p className="text-meta text-ink-muted">
      {error.status === 404
        ? "We don't seem to know about this gig."
        : "Gig details are unavailable right now - please try again later."}
    </p>
  </div>
);

const GigDetailsNew = () => {
  const { data: gig, isLoading, error } = useGig();
  const flaggedPath = useFlaggedPath();
  const { locationId, dateRangeId, customDate } = useGigSearchParams();

  // filteredGigListPath builds the query string from scratch, so anything not
  // handed to it is silently rebuilt from defaults. Going back to the list from
  // here should keep where and when you were looking - only what you tapped
  // replaces the rest of the filters.
  const scopedListPath = (filters) =>
    flaggedPath(
      filteredGigListPath({ locationId, dateRangeId, customDate, ...filters }),
    );

  const venue = gig?.venue;
  const sets = gig?.sets ?? [];
  const prices = gig?.prices ?? [];

  return (
    <article className="min-h-full">
      {/* see-through window onto the map, holding the page controls */}
      <div className={`relative ${HERO_HEIGHT}`}>
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <BackLink className="bg-night/70 text-ink" />
          {gig && (
            <SaveGigButton
              gig={gig}
              className="flex size-11 items-center justify-center rounded-full bg-night/70 text-lmlpink-light"
              iconClassName="size-5"
            />
          )}
        </div>
      </div>

      <div className="min-h-[calc(100%-170px)] bg-night pb-6">
        {isLoading && !gig && <LoadingSpinner />}
        {error && <GigError error={error} />}

        {gig && (
          <>
            <header className="flex flex-col gap-2 p-4">
              <p className="font-mono text-micro font-medium tracking-[0.12em] text-lmlpink-light uppercase">
                <DateTimeDisplay value={gig.date} type="weekdayDate" />
                {gig.start_time && ` · ${gig.start_time}`}
              </p>
              {gig.series && (
                <p>
                  <SeriesBadge series={gig.series} />
                </p>
              )}
              <h1 className="text-title leading-tight font-bold -tracking-[0.02em] text-pretty">
                {gig.name}
                {gig.status === "cancelled" && (
                  <span className="text-ink-muted"> (cancelled)</span>
                )}
              </h1>
              {venue && (
                <p className="flex items-center gap-1.5 text-meta font-medium text-ink-muted">
                  <MapPinIcon className="size-4 shrink-0" />
                  {venue.name}
                </p>
              )}
            </header>

            <TicketsCallToAction gig={gig} />

            <div className="mx-4 flex flex-col rounded-xl border border-night-line bg-night-raised">
              <Row icon={ClockIcon}>
                <p className="text-meta font-semibold">
                  <DateTimeDisplay value={gig.date} />
                </p>
                <p className="text-mini text-ink-muted">
                  {gig.start_timestamp ? (
                    <DateTimeDisplay
                      start={gig.start_timestamp}
                      end={gig.finish_timestamp}
                      type="time"
                    />
                  ) : (
                    "Start time not listed"
                  )}
                </p>
              </Row>

              {venue && (
                <Row icon={MapPinIcon}>
                  <p className="text-meta font-semibold">
                    <Link to={scopedListPath({ venueIds: venue.id })}>
                      {venue.name}
                    </Link>
                  </p>
                  <p className="text-mini text-ink-muted">
                    {venue.address}
                    {venue.capacity ? ` · holds ${venue.capacity}` : ""}
                  </p>
                  {venue.location_url && (
                    <a
                      href={venue.location_url}
                      className="flex items-center gap-1.5 pt-1 text-mini font-semibold text-lmlpink-light"
                    >
                      Get directions
                      <ArrowTopRightOnSquareIcon className="size-3.5" />
                    </a>
                  )}
                </Row>
              )}

              {sets.length > 0 && (
                <Row icon={MicrophoneIcon}>
                  <p className="text-micro font-semibold tracking-[0.12em] text-ink-muted uppercase">
                    Lineup
                  </p>
                  <ul className="flex flex-col">
                    {sets.map((set, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between gap-3 py-1"
                      >
                        <span className="truncate text-meta font-semibold">
                          {set.act?.id ? (
                            <Link to={flaggedPath(`/acts/${set.act.id}`)}>
                              {set.act.name}
                            </Link>
                          ) : (
                            set.act?.name
                          )}
                          {set.start_time && (
                            <span className="font-mono font-normal text-ink-muted">
                              {" "}
                              {set.start_time}
                            </span>
                          )}
                        </span>
                        {set.act?.id && (
                          <ChevronRightIcon className="size-4 shrink-0 text-ink-dim" />
                        )}
                      </li>
                    ))}
                  </ul>
                </Row>
              )}

              {prices.length > 0 && (
                <Row icon={TicketIcon}>
                  <ul className="flex flex-col gap-1">
                    {prices.map((price, index) => (
                      <li
                        key={index}
                        className="flex items-baseline justify-between gap-3"
                      >
                        <span className="text-meta font-semibold">
                          {price.description || "Admission"}
                        </span>
                        <span className="font-mono text-meta font-semibold">
                          {price.amount}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Row>
              )}
            </div>

            {(gig.informationTags?.length > 0 || gig.genreTags?.length > 0) && (
              <div className="flex flex-col gap-2 p-4">
                {gig.informationTags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {gig.informationTags.map(({ id, caption }) => (
                      <Chip key={id} variant="neutral">
                        {caption}
                      </Chip>
                    ))}
                  </div>
                )}
                {gig.genreTags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {gig.genreTags.map(({ id, value, caption }) => (
                      <Link
                        key={id}
                        to={scopedListPath({ genreTagIds: [value] })}
                      >
                        <Chip variant="accent">{caption}</Chip>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {venue && (
              <div className="px-4">
                <Link
                  to={scopedListPath({ venueIds: venue.id })}
                  className="flex items-center justify-between gap-3 rounded-xl border border-night-line bg-night-raised p-3.5"
                >
                  <span className="truncate text-meta font-semibold">
                    All gigs at {venue.name}
                  </span>
                  <ChevronRightIcon className="size-4 shrink-0 text-ink-dim" />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
};

export default GigDetailsNew;
