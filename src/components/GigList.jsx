import React, { useRef, useEffect, useLayoutEffect } from "react";
import { Link, useLocation, createSearchParams } from "react-router-dom";
import tw from "tailwind-styled-components";
import { MapPinIcon, ClockIcon } from "@heroicons/react/24/solid";
import DateTimeDisplay from "./DateTimeDisplay";
import SaveGigButton from "./SaveGigButton";
import { useGigList, useGigFilters } from "../hooks/api";
import { generateTimePeriods } from "../timeStuff";
import GigFilter from "./explorer/GigFilter";

const TopNav = () => {
  const [currentParams] = useGigFilters();

  const timePeriods = generateTimePeriods();
  const dateFilters = timePeriods.map(
    ({ params, key, caption, dateFrom, dateTo }) => ({
      key,
      link: {
        search: createSearchParams({ ...params, magic: "yes" }).toString(),
      },
      display: caption,

      selected: currentParams.dateParsed.isBetween(
        dateFrom,
        dateTo,
        "day",
        "[]",
      ),
    }),
  );

  return (
    <nav className="flex flex-wrap flex-row gap-x-2 gap-y-4 p-4  text-nowrap border-b border-gray-300">
      {dateFilters.map(({ key, display, link, selected }) => (
        <Link
          key={key}
          to={link}
          className={`text-xs p-2 ${
            selected
              ? "bg-gray-800 text-white"
              : "bg-gray-300 text-gray-800 border"
          }`}
        >
          {display}
        </Link>
      ))}
      <GigFilter className="ml-auto" />
    </nav>
  );
};

const Aside = tw.aside`
  flex
  flex-col

`;

const GigHeader = ({ gig, showDate = true }) => {
  return (
    <header className={`flex justify-between flex-row pb-2`}>
      <hgroup className="break-words text-pretty leading-loose">
        {showDate && (
          <p className="text-sm">
            <DateTimeDisplay value={gig.start_time} type="time" />
          </p>
        )}
        <Link to={`gigs/${gig.id}`}>
          <h3 className="text-xl font-bold">{gig.name}</h3>
        </Link>
      </hgroup>
      <SaveGigButton />
    </header>
  );
};

const GigRow = ({ gig }) => {
  return (
    <article className="flex flex-col snap-start p-4">
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
        <div className="flex flex-wrap gap-2 mt-2">
          {gig.genres.map((genre, index) => (
            <span
              key={index}
              className="bg-red-600 text-white px-3 py-1 text-sm"
            >
              {genre}
            </span>
          ))}
        </div>
      )}
      {gig.tags && (
        <div className="flex flex-wrap gap-2 mt-2">
          {gig.tags.map((tag, index) => (
            <span
              key={index}
              className="text-grey-800 italic px-1 py-1 text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

const Content = () => {
  const { data: gigs = [] } = useGigList();
  const scroller = useRef();
  const { hash, search } = useLocation();

  useEffect(() => {
    if (hash) {
      // do something
    }
  }, [hash]);

  const byDate = Object.groupBy(gigs, ({ date }) => date);

  useLayoutEffect(() => {
    scroller.current.scrollTop = 0;
  }, [search]);

  return (
    <div
      ref={scroller}
      className="snap-y snap-proximity flex flex-col overflow-y-auto divide-y divide-gray-200 px-2 w-full"
    >
      {Object.entries(byDate).map(([d, currentGigs]) => (
        <React.Fragment key={d}>
          <h2 className="font-semibold p-4a snap-start">
            <DateTimeDisplay value={d} />
          </h2>
          {currentGigs.map((gig) => (
            <GigRow key={gig.id} gig={gig} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

const GigList = () => {
  return (
    <main className="flex-1 overflow-hidden flex flex-col w-full items-stretch ">
      <TopNav />
      <Content />
    </main>
  );
};

export default GigList;
