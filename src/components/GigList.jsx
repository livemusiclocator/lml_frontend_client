import React, { useRef } from "react";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import tw from "tailwind-styled-components";
import { MapPinIcon, ClockIcon, ArrowTopRightOnSquareIcon as ExternalLinkIcon } from "@heroicons/react/24/solid";
import DateTimeDisplay from "./DateTimeDisplay";
import SaveGigButton from "./SaveGigButton";
import { useGigList } from "../hooks/api";
import { useGigFilterOptions } from "../hooks/filters";
import GigFilter from "./GigFilter";
import GigFilterForDatesActually from "./explorer/GigFilter";
import { LoadingSpinner } from "./loading/LoadingOverlay";
import lbmfLogo from '../assets/lbmf2024logo.png';
import skLogo from '../assets/skf_blacklogo.svg';

const ExternalLink = tw.a`text-blue-600 hover:underline visited:text-purple-600 inline-flex items-baseline`;
const Aside = tw.aside`flex flex-col`;
const TicketStatus = tw.div`
text-xs
font-medium
rounded-full
bg-red-200
p-2
m-2
`;

const GigHeader = ({ gig, showDate = true }) => {
  const lbmf = gig.series === "lbmf";
  const sk = gig.series === "stkildafestival2025";

  return (
    <header className={`flex justify-between flex-row pb-2`}>
      <hgroup className="break-words text-pretty leading-loose">
        { showDate && (
           <p className="text-sm">
             <DateTimeDisplay value={gig.start_timestamp} type="time" />
           </p>
        )}
        <h3
          className="flex text-xl font-bold items-center"
        >
          { lbmf && <img src={lbmfLogo} className="m-2 flex-shrink w-10" /> }
          { sk && <img src={skLogo} className="m-2 flex-shrink w-10" /> }
          { gig.name }
          { gig.status === "cancelled" && "(CANCELLED)" }
          { gig.ticket_status === "selling_fast" && <TicketStatus>SELLING FAST</TicketStatus> }
          { gig.ticket_status === "sold_out" && <TicketStatus>SOLD OUT</TicketStatus> }
        </h3>
      </hgroup>
      <SaveGigButton gig={gig} />
    </header>
  );
};

const GigRow = ({ gig }) => {
  const navigate = useNavigate();
  return (
    <article
      className="flex flex-col snap-start p-4"
    >
      <GigHeader
        gig={gig}
        showDate={false}
      />
      <Aside>
        <div className="flex gap-x-1 pb-2 items-start text-sm">
          <MapPinIcon className="text-gray-500 size-4 shrink-0 m-1" />
          <div aria-label="Venue">
            <p className="font-semibold leading-6">{gig.venue.name}</p>
            <p className="text-gray-500" aria-label="Venue address">
              {gig.venue.address}
            </p>
            {gig.venue.location_url && (
              <p>
                <ExternalLink href={gig.venue.location_url}>
                  Get directions <ExternalLinkIcon className="size-4 self-center" />
                </ExternalLink>
              </p>
             )}
          </div>
        </div>
        {gig.start_timestamp && (
          <div className="flex gap-x-1 items-start text-sm">
            <ClockIcon className="size-4 shrink-0 m-1 text-gray-500" />
            <ul className="font-semibold">
              <li aria-label="Time">
                <DateTimeDisplay value={gig.start_timestamp} type="dateAndTime" />
              </li>
            </ul>
          </div>
        )}
      </Aside>

      {gig.genres && (
        <div className="flex gap-2 flex-wrap p-4">
          {gig.genres.map(({ id, value }) => (
            <span
              key={id}
              className="bg-lmlpink text-white text-xs font-medium p-2"
            >
              {value}
            </span>
          ))}
        </div>
      )}
      <ExternalLink
          className="p-1 items-start text-sm"
          href="/"
          onClick={
            (e) => {
              e.preventDefault();
              navigate(`gigs/${gig.id}`);
            }
          }
        >
          ... more information
        </ExternalLink>
    </article>
  );
};

const NoGigsMessage = () => {
  return <p className="italic">No gigs found</p>;
};
const Content = () => {
  const {
    data: { pages = [] },
    isLoading,
    allPagesLoaded,
    gigCount,
  } = useGigList({ applyFilters: true });

  const scroller = useRef();

  const pagesWithGigs = pages.filter((page) => page?.gigs?.length > 0);

  return (
    <div
      ref={scroller}
      className="flex flex-col overflow-y-auto divide-y divide-gray-200 px-2 w-full"
    >
      {pagesWithGigs.map(({ filters: { date }, gigs }) => (
        <React.Fragment key={date}>
          <h2 className="font-semibold p-4a">
            <DateTimeDisplay value={date} />
          </h2>
          {gigs.map((gig) => (
            <GigRow key={gig.id} gig={gig} />
          ))}
        </React.Fragment>
      ))}
      {isLoading && <LoadingSpinner />}
      {allPagesLoaded && gigCount == 0 && <NoGigsMessage />}
    </div>
  );
};

const GigList = ({ newGigFilter }) => {
  return (
    <main className="flex-1 overflow-hidden flex flex-col w-full items-stretch max-w-3xl mx-auto">
      <GigFilter />
      <Content />
    </main>
  );
};

export default GigList;
