import React, { useRef, useLayoutEffect } from "react";
import { groupBy } from "lodash-es";
import {
  Link,
  useLocation,
  createSearchParams,
  useNavigate,
} from "react-router-dom";
import tw from "tailwind-styled-components";
import { MapPinIcon, ClockIcon } from "@heroicons/react/24/solid";
import DateTimeDisplay from "./DateTimeDisplay";
import SaveGigButton from "./SaveGigButton";
import { useGigList, useGigDateParams } from "../hooks/api";
import { generateTimePeriods } from "../timeStuff";
import GigFilter from "./explorer/GigFilter";

const TopNav = () => {
  const { dateRange } = useGigDateParams();
  const timePeriods = generateTimePeriods();
  const dateFilters = Object.values(timePeriods).map(({ key, caption }) => ({
    key,
    link: {
      search: createSearchParams({ dateRange: key }).toString(),
    },
    display: caption,
    selected: dateRange === key,
  }));

  return (
    <nav className="p-4 gap-y-4 flex flex-wrap flex-row border-b border-gray-300 justify-center">
      <div className="flex flex-row gap-x-2 w-full justify-center">
        {dateFilters.map(({ key, display, link, selected }) => (
          <Link
            key={key}
            to={link}
            className={`text-nowrap align-middle text-center text-xs p-2 ${
              selected
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-gray-800 border"
            }`}
          >
            {display}
          </Link>
        ))}
      </div>
      <GigFilter />
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
        <Link to={`gigs/${gig.id}`} onClick={(e) => e.preventDefault()}>
          <h3 className="text-xl font-bold">{gig.name}</h3>
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

const Content = () => {
  const { data: gigs = [] } = useGigList();
  const scroller = useRef();
  const { search } = useLocation();
  const byDate = groupBy(gigs, ({ date }) => date);

  useLayoutEffect(() => {
    // todo: If we made date part of the path, we might not need to reset the scroll each time we switch views...
    scroller.current.scrollTop = 0;
  }, [search]);

  return (
    <div
      ref={scroller}
      className="flex flex-col overflow-y-auto divide-y divide-gray-200 px-2 w-full"
    >
      {Object.entries(byDate).map(([d, currentGigs]) => (
        <React.Fragment key={d}>
          <h2 className="font-semibold p-4a">
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
    <main className="flex-1 overflow-hidden flex flex-col w-full items-stretch max-w-3xl mx-auto">
      <TopNav />
      <Content />
    </main>
  );
};

export default GigList;
