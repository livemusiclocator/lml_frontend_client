import { Link, useNavigationType, useSearchParams } from "react-router-dom";
import { gigIsSaved, saveGig, unsaveGig } from "../../savedGigs";
import { LoadingSpinner } from "../loading/LoadingOverlay";
import { useState } from "react";
import styled from "styled-components";
import tw from "tailwind-styled-components";
import Markdown from "react-markdown";
import {
  ChevronLeftIcon,
  StarIcon as StarIconSolid,
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
} from "@heroicons/react/24/solid";
import { StarIcon as StarIconOutline } from "@heroicons/react/24/outline";

const Aside = tw.aside`
mx-4
p-4
flex
flex-wrap
gap-4
justify-start

*:shrink
 `;

const GigHeroImageBanner = () => {
  // probably a case for some actual css here .
  return (
    <div className="relative max-h-[40svh] overflow-hidden aspect-[2/1] w-full">
      <div className="absolute left-0 top-0 w-full h-full">
        <picture>
          <img
            src="/placeholder-gig-image.png"
            alt="Event Hero Image background"
            className="blur-lg object-fill w-full h-full object-center"
          />
        </picture>
      </div>
      <div className="relative w-full h-full">
        <picture>
          {/* todo: add some other sources and a fallback image  */}
          <img
            src="/placeholder-gig-image.png"
            alt="Event Hero Image"
            className=" h-full w-full object-contain object-center"
          />
        </picture>
      </div>
    </div>
  );
};

const NavMaybe = ({ gig }) => {
  const [gigSaved, setGigSaved] = useState(gigIsSaved(gig));

  const navType = useNavigationType();
  const to = navType === "POP" ? "/" : -1;
  const toggleGigSaved = () => {
    if (gigSaved) {
      unsaveGig(gig);
      setGigSaved(false);
    } else {
      saveGig(gig);
      setGigSaved(true);
    }
  };
  return (
    <nav className="flex justify-between p-2">
      <Link to={to}>
        <ChevronLeftIcon className="size-6" />
      </Link>
      <button onClick={toggleGigSaved} className="text-yellow-200">
        <span className="sr-only">
          {gigSaved ? "Remove from favourites" : "Add to favourites"}
        </span>
        {gigSaved ? (
          <StarIconSolid className="size-6" />
        ) : (
          <StarIconOutline className="size-6" />
        )}
      </button>
    </nav>
  );
};
const GigHeader = ({ gig, className }) => {
  const [gigSaved, setGigSaved] = useState(gigIsSaved(gig));
  const navType = useNavigationType();
  const to = navType === "POP" ? "/" : -1;
  const toggleGigSaved = () => {
    if (gigSaved) {
      unsaveGig(gig);
      setGigSaved(false);
    } else {
      saveGig(gig);
      setGigSaved(true);
    }
  };
  return (
    <header className={`flex flex-col ${className || ""}`}>
      <hgroup className="break-words text-pretty px-4">
        <p className="font-semibold">
          <DatetimeDisplay value={gig.date} type="briefDate" />
        </p>
        <h2 className="text-4xl font-bold">{gig.name}</h2>
      </hgroup>
    </header>
  );
};

const ExternalLink = tw.a`text-blue-600 hover:underline visited:text-purple-600 inline-flex items-baseline`;

// todo: Make a nice current-time aware version of this perhaps?
//
const DatetimeDisplay = ({ value, start, end, type = "date" }) => {
  // just a bit of mistakeproofin. probably a bit silly
  value = value || start;
  // does undefined use the browser default ?
  const formatters = {
    date: new Intl.DateTimeFormat(undefined, {
      dateStyle: "full",
    }),
    briefDate: new Intl.DateTimeFormat(undefined, {
      month: "long",
      day: "numeric",
    }),
    time: new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "numeric",
    }),
  };

  if (!value) {
    return null;
  }
  const formatter = formatters[type];
  const display =
    end && start
      ? formatter.formatRange(new Date(start), new Date(end))
      : formatter.format(new Date(value));
  return <time dateTime={value}>{display}</time>;
};
export default function SingleGigDetails({ gig, className, isLoading }) {
  const [searchParams] = useSearchParams();
  const showImagePlaceholder = searchParams.get("showImagePlaceholder");
  if (isLoading || !gig) {
    // todo: make skeleton load page type thing here to stop the page from jumping about
    return <LoadingSpinner />;
  }

  return (
    <article className={`min-w-sm max-w-xl ${className || ""} pb-4 space-y-4`}>
      {!showImagePlaceholder && <NavMaybe gig={gig} />}
      {showImagePlaceholder && <GigHeroImageBanner />}
      <GigHeader gig={gig} className="grow shrink-0" />
      {/* todo: light contrasting colour here or just stick with a grey perhaps? */}
      <Aside className="bg-gray-200">
        <div className="flex gap-x-2">
          <CalendarIcon className="size-6 shrink-0" />
          <ul className="font-semibold text-lg">
            <li aria-label="Date">
              <DatetimeDisplay value={gig.date} />
            </li>
            <li aria-label="Time">
              <DatetimeDisplay
                start={gig.start_time}
                end={gig.finish_time}
                type="time"
              />
            </li>
          </ul>
        </div>

        <div className="flex gap-x-2">
          <MapPinIcon className="size-6 shrink-0" />
          <ul>
            <li aria-label="Venue" className="font-semibold text-lg">
              {gig.venue.name}
            </li>
            <li aria-label="Venue address">{gig.venue.address}</li>
            <li aria-label="Directions link">
              <ExternalLink href="about:blank">
                Get directions
                <ExternalLinkIcon className="size-4 self-center mx-1" />
              </ExternalLink>
            </li>
          </ul>
        </div>
        <div className="flex gap-x-2">
          <TicketIcon className="size-6 shrink-0" />

          <ul>
            <li className="font-semibold text-lg">Ticket Information</li>
            <li aria-label="Ticket link">
              <ExternalLink href={gig.ticketing_url}>
                Gig information
                <ExternalLinkIcon className="size-4 self-center mx-1" />
              </ExternalLink>
            </li>
          </ul>
        </div>
      </Aside>
      <section className="px-4 prose">
        {/*
         * todo: use prose-invert when we have darkmode working
         * using prose tailwind plugin here to style the content blocks
         * Starting off by being restrictive of what elements to show.
         * total set is :
         * a, blockquote, br, code, em, h1, h2, h3, h4, h5, h6, hr, img, li, ol, p, pre, strong, and ul
         *
         * Also remap heading levels to fit in with our use of h2 for gig name.
         * */}
        <Markdown
          unwrapDisallowed={true}
          skipHtml={true}
          allowedElements={[
            "a",
            "blockquote",
            "br",
            "em",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "hr",
            "li",
            "ol",
            "p",
            "strong",
            "ul",
          ]}
          components={{
            h1: "h3",
            h2: "h4",
            h3: "h5",
            h4: "h6",
            h5: "h6",
            h6: "h6",
          }}
        >
          {gig.description}
        </Markdown>
      </section>
      <section className="flex gap-1 flex-wrap">
        {(gig.tags || []).map((t) => (
          <span
            key={t}
            className="bg-gray-100 text-gray-800 text-sm font-medium p-2 m-2 dark:bg-gray-700 dark:text-gray-300"
          >
            {t}
          </span>
        ))}
      </section>
      <section className="p-4">
        <button className="flex content-center transition items-center justify-center text-center px-8 py-4 text-xl font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 mx-auto px-8">
          <div className="flex items-center justify-start space-x-1.5">
            <span>Get Tickets</span>
          </div>
        </button>
      </section>
    </article>
  );
}
