import React, { useRef } from "react";
import { Link } from "react-router";
import {
  MapPinIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
} from "@heroicons/react/24/solid";
import DateTimeDisplay from "@/components/shared/DateTimeDisplay";
import SaveGigButton from "@/components/shared//SaveGigButton";
import { useGigSearchResults } from "@/hooks/api";
import GigFilter from "./GigFilter";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { uniqBy } from "lodash-es";
import getConfig from "@/config";

import { filteredGigListPath } from "@/searchParams";

import { groupBy } from "lodash-es";

const GigHeader = ({ gig, showDate = true }) => {
  // todo: Memoize or make it really ok to load this statically
  const {
    themes: {
      default: defaultGigImageTheme,
      series: seriesGigImageThemes = {},
    },
  } = getConfig();
  // todo: dupe with Map.jsx code right now  -
  // (will need change to change both if we want different selection logic for themes)
  const theme = seriesGigImageThemes[gig.series] ?? defaultGigImageTheme;

  return (
    <header className={`flex justify-between flex-row pb-2`}>
      <hgroup className="break-words text-pretty leading-loose">
        {showDate && (
          <p className="text-sm">
            <DateTimeDisplay value={gig.start_timestamp} type="time" />
          </p>
        )}
        <h3 className="flex text-xl font-bold items-center">
          {theme.searchResult && (
            <img src={theme.searchResult} className="m-2 shrink w-10" />
          )}
          <Link to={`gigs/${gig.id}`}>{gig.name}</Link>
          {gig.status === "cancelled" && "(CANCELLED)"}
          {gig.ticket_status === "selling_fast" && (
            <div className="ticket-status">SELLING FAST</div>
          )}
          {gig.ticket_status === "sold_out" && (
            <div className="ticket-status">SOLD OUT</div>
          )}
        </h3>
      </hgroup>
      <SaveGigButton gig={gig} />
    </header>
  );
};

const GigRow = ({ gig }) => {
  return (
    <article className="flex flex-col snap-start p-4 text-sm">
      <GigHeader gig={gig} showDate={false} />
      <aside className="flex flex-col">
        <div className="flex gap-x-1 pb-2 items-start text-sm">
          <MapPinIcon className="text-gray-500 size-4 shrink-0 m-1" />
          <div aria-label="Venue">
            <p className="font-semibold leading-6">
              <Link to={filteredGigListPath({ venueIds: [gig.venue.id] })}>
                {gig.venue.name}
              </Link>
            </p>
            <p className="text-gray-500" aria-label="Venue address">
              <Link to={filteredGigListPath({ venueIds: gig.venue.id })}>
                {gig.venue.address}
              </Link>
            </p>
            {gig.venue.location_url && (
              <p>
                <a href={gig.venue.location_url} className="external-link">
                  Get directions <ExternalLinkIcon />
                </a>
              </p>
            )}
          </div>
        </div>
        {gig.start_timestamp && (
          <div className="flex gap-x-1 items-start text-sm">
            <ClockIcon className="size-4 shrink-0 m-1 text-gray-500" />
            <ul className="font-semibold">
              <li aria-label="Time">
                <DateTimeDisplay
                  value={gig.start_timestamp}
                  type="dateAndTime"
                />
              </li>
            </ul>
          </div>
        )}
      </aside>
      {gig.genreTags && (
        <div className="">
          {uniqBy(gig.genreTags, "id").map(({ id, value }) => (
            <Link
              to={filteredGigListPath({ genreTagIds: value })}
              key={id}
              className="tag"
            >
              {value}
            </Link>
          ))}
        </div>
      )}
      <Link className="internal-link" to={`gigs/${gig.id}`}>
        more information ...
      </Link>
    </article>
  );
};

const NoGigsMessage = () => {
  return (
    <div className="p-4 self-center">
      <h2 className="font-semibold text-slate-600 text-xl">No gigs found</h2>
    </div>
  );
};
const Content = () => {
  const { data, isLoading, dataLoaded } = useGigSearchResults();
  const gigCount = data?.gigs?.length;
  const gigs = data?.gigs ?? [];
  const scroller = useRef();
  const groupedByDate = groupBy(gigs, "date");
  return (
    <div
      ref={scroller}
      className="flex flex-col overflow-y-auto divide-y divide-gray-200 px-2 w-full"
    >
      {Object.entries(groupedByDate).map(([date, gigs]) => (
        <React.Fragment key={date}>
          <h2 className="font-semibold">
            <DateTimeDisplay value={date} />
          </h2>
          {gigs.map((gig) => (
            <GigRow key={gig.id} gig={gig} />
          ))}
        </React.Fragment>
      ))}
      {isLoading && <LoadingSpinner />}
      {dataLoaded && gigCount == 0 && <NoGigsMessage />}
    </div>
  );
};

const GigList = () => {
  return (
    <main className="flex-1 overflow-hidden flex flex-col w-full items-stretch max-w-3xl mx-auto">
      <GigFilter />
      <Content />
    </main>
  );
};

export default GigList;
