import React, { useRef } from "react";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import tw from "tailwind-styled-components";
import { MapPinIcon, ClockIcon } from "@heroicons/react/24/solid";
import DateTimeDisplay from "./DateTimeDisplay";
import SaveGigButton from "./SaveGigButton";
import { useGigList } from "../hooks/api";
import { useGigFilterOptions } from "../hooks/filters";
import PlaygroundGigFilter from "../playground/GigFilter";
import GigFilterForDatesActually from "./explorer/GigFilter";
import { LoadingSpinner } from "./loading/LoadingOverlay";
import lbmfLogo from '../assets/lbmf2024logo.png';

export const OriginalGigFilter = () => {
  const { dateRanges } = useGigFilterOptions();
  // temp until move to new ui
  const dateFilters = Object.values(dateRanges)
    .filter((x) => x.id != "customDate")
    .map(({ id, caption, selected }) => ({
      id,
      link: {
        search: createSearchParams({ dateRange: id }).toString(),
      },
      selected,
      caption,
    }));

  return (
    <nav className="p-4 gap-y-4 flex flex-wrap flex-row border-b border-gray-300 justify-center">
      <div className="flex flex-row gap-x-2 w-full justify-center">
        {dateFilters.map(({ id, caption, link, selected }) => (
          <Link
            key={id}
            to={link}
            className={`text-nowrap align-middle text-center text-xs p-2 ${
              selected
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-gray-800 border"
            }`}
          >
            {caption}
          </Link>
        ))}
      </div>
      <GigFilterForDatesActually />
    </nav>
  );
};

const Aside = tw.aside`
  flex
  flex-col
`;

const GigHeader = ({ gig, showDate = true }) => {
  const lbmf = gig.series === "lbmf";
  return (
    <header className={`flex justify-between flex-row pb-2`}>
      <hgroup className="break-words text-pretty leading-loose">
        { showDate && (
           <p className="text-sm">
             <DateTimeDisplay value={gig.start_time} type="time" />
           </p>
        )}
      <Link to={`gigs/${gig.id}`} onClick={(e) => e.preventDefault()}>
        <h3 className="flex text-xl font-bold items-center">
          { lbmf && <img src={lbmfLogo} className="m-2 flex-shrink w-10" /> }
          { gig.name }
        </h3>
        </Link>
      </hgroup>
      <SaveGigButton gig={gig} />
    </header>
  );
};

const GigRow = ({ gig }) => {
  const navigate = useNavigate();
  return (
    <article
      className="flex flex-col snap-start  p-4 cursor-pointer"
      onClick={(e) => {
        e.preventDefault();
        navigate(`gigs/${gig.id}`);
      }}
    >
      <GigHeader gig={gig} showDate={false} />
      <Aside>
        <div className="flex gap-x-1 pb-2 items-start text-sm">
          <MapPinIcon className="text-gray-500 size-4 shrink-0 m-1" />
          <div aria-label="Venue">
            <p className="font-semibold leading-6">{gig.venue.name}</p>
            <p className="text-gray-500" aria-label="Venue address">
              {gig.venue.address}
            </p>
          </div>
        </div>
        {gig.start_time && (
          <div className="flex gap-x-1 items-start text-sm">
            <ClockIcon className="size-4 shrink-0 m-1 text-gray-500" />
            <ul className="font-semibold">
              <li aria-label="Time">
                <DateTimeDisplay value={gig.start_time} type="dateAndTime" />
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
  const GigFilter = newGigFilter ? PlaygroundGigFilter : OriginalGigFilter;
  return (
    <main className="flex-1 overflow-hidden flex flex-col w-full items-stretch max-w-3xl mx-auto">
      <GigFilter />
      <Content />
    </main>
  );
};

export default GigList;
