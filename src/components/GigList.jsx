import React, { useRef } from "react";
import { useNavigate, Link } from "react-router";
import tw from "tailwind-styled-components";
import {
  MapPinIcon,
  ClockIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
} from "@heroicons/react/24/solid";
import DateTimeDisplay from "./DateTimeDisplay";
import SaveGigButton from "./SaveGigButton";
import { useGigSearchResults } from "../hooks/api_v2";
import GigFilter from "./GigFilter";
import { LoadingSpinner } from "./loading/LoadingOverlay";
import lbmfLogo from "../assets/lbmf2024logo.png";
import skLogo from "../assets/skf_blacklogo.svg";
import { uniqBy } from "lodash-es";

const Aside = tw.aside`flex flex-col`;
import { filteredGigListPath } from "../searchParams";
const TicketStatus = tw.div`
text-xs
font-medium
rounded-full
bg-red-200
p-2
m-2
`;
import { groupBy } from "lodash-es";

const GigHeader = ({ gig, showDate = true }) => {
  const lbmf = gig.series === "lbmf";
  const sk = gig.series === "stkildafestival2025";

  return (
    <header className={`flex justify-between flex-row pb-2`}>
      <hgroup className="break-words text-pretty leading-loose">
        {showDate && (
          <p className="text-sm">
            <DateTimeDisplay value={gig.start_timestamp} type="time" />
          </p>
        )}
        <h3 className="flex text-xl font-bold items-center">
          {lbmf && <img src={lbmfLogo} className="m-2 shrink w-10" />}
          {sk && <img src={skLogo} className="m-2 shrink w-10" />}
          <Link to={`gigs/${gig.id}`}>{gig.name}</Link>
          {gig.status === "cancelled" && "(CANCELLED)"}
          {gig.ticket_status === "selling_fast" && (
            <TicketStatus>SELLING FAST</TicketStatus>
          )}
          {gig.ticket_status === "sold_out" && (
            <TicketStatus>SOLD OUT</TicketStatus>
          )}
        </h3>
      </hgroup>
      <SaveGigButton gig={gig} />
    </header>
  );
};

const GigRow = ({ gig }) => {
  const navigate = useNavigate();
  return (
    <article className="flex flex-col snap-start p-4 text-sm">
      <GigHeader gig={gig} showDate={false} />
      <Aside>
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
      </Aside>
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
  return <p className="italic">No gigs found</p>;
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
