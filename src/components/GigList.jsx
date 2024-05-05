import React, { useRef, useEffect, useLayoutEffect } from "react";
import { Link, useLocation, createSearchParams } from "react-router-dom";
import tw from "tailwind-styled-components";
import { MapPinIcon, ClockIcon } from "@heroicons/react/24/solid";
import DateTimeDisplay from "./DateTimeDisplay";
import SaveGigButton from "./SaveGigButton";
import { useGigList, useGigFilters } from "../hooks/api";

const TopNav = () => {
  const [{ to: selectedTo, from: selectedFrom }] = useGigFilters();

  const days = ["Today", "Saturday", "Sunday", "Next Week"];
  const dates = [
    ["2024-05-03", "2024-05-04"],
    ["2024-05-04", "2024-05-05"],
    ["2024-05-05", "2024-05-06"],
    ["2024-05-06", "2024-05-13"],
  ];
  const dateFilters = dates.map(([from, to], i) => ({
    key: days[i],
    link: { search: createSearchParams({ to, from }).toString() },
    display: days[i],
    selected: from === selectedFrom && to === selectedTo,
  }));

  return (
    <nav className="px-2 w-full">
      <ul className="flex justify-between gap-2">
        {dateFilters.map(({ key, display, link, selected }) => (
          <li key={key} className="flex-1">
            <Link
              to={link}
              className={`leading-none text-nowrap block p-3 rounded-sm text-center ${
                selected
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {display}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const Aside = tw.aside`
  flex
  flex-col

`;

const GigHeader = ({ gig, showDate = true }) => {
  return (
    <header className={`flex justify-between flex-row pb-4`}>
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
        <div className="flex gap-x-1 items-start text-sm">
          <MapPinIcon className="text-gray-500 size-4 shrink-0 m-1" />
          <ul>
            <li className="font-semibold" aria-label="Venue">
              {gig.venue.name}
            </li>
            <li className="text-gray-500" aria-label="Venue address">
              {gig.venue.address}
            </li>
          </ul>
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
      className="overflow-scroll snap-y snap-proximity flex flex-col overflow-y-auto divide-y divide-gray-200 px-2"
    >
      {Object.entries(byDate).map(([d, currentGigs]) => (
        <React.Fragment key={d}>
          <h2 className="font-semibold p-4 snap-start">
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
    <main className="flex-1 overflow-hidden flex flex-col w-full m-auto max-w-2xl items-stretch my-1">
      <TopNav />
      <Content />
    </main>
  );
};

export default GigList;
