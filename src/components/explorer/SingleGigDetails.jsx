import { useParams, useSearchParams } from "react-router-dom";
import SaveGigButton from "../SaveGigButton";
import { useGig } from "../../hooks/api";
import { LoadingSpinner } from "../loading/LoadingOverlay";
import DateTimeDisplay from "../DateTimeDisplay";
import tw from "tailwind-styled-components";
import Markdown from "react-markdown";
import {
  CalendarIcon,
  MapPinIcon,
  TicketIcon,
  InformationCircleIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
} from "@heroicons/react/24/solid";

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

const GigHeader = ({ gig, className }) => {
  return (
    <header
      className={`flex items-start justify-between flex-row ${className || ""} p-4`}
    >
      <hgroup className="break-words text-pretty">
        <p className="font-semibold">
          <DateTimeDisplay value={gig.date} type="briefDate" />
        </p>
        <h2 className="text-4xl font-bold">{gig.name}</h2>
      </hgroup>
      <SaveGigButton gig={gig} />
    </header>
  );
};

const ExternalLink = tw.a`text-blue-600 hover:underline visited:text-purple-600 inline-flex items-baseline`;

export default function SingleGigDetails({ className }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { data: gig, isLoading } = useGig(id);
  const showImagePlaceholder = searchParams.get("showImagePlaceholder");
  if (isLoading || !gig) {
    // todo: make skeleton load page type thing here to stop the page from jumping about
    return <LoadingSpinner />;
  }

  return (
    <article
      className={`overflow-scroll min-w-sm max-w-2xl mx-auto ${className || ""} pb-4 h-full`}
    >
      {showImagePlaceholder && <GigHeroImageBanner />}
      <GigHeader gig={gig} className="grow shrink-0" />
      {/* todo: light contrasting colour here or just stick with a grey perhaps? */}
      <Aside className="bg-gray-200">
        <div className="flex gap-x-2">
          <CalendarIcon className="size-6 shrink-0" />
          <ul className="font-semibold text-lg">
            <li aria-label="Date">
              <DateTimeDisplay value={gig.date} />
            </li>
            <li aria-label="Time">
              <DateTimeDisplay
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
            {gig.venue.location_url && (
              <li aria-label="Directions link">
                <ExternalLink href={gig.venue.location_url}>
                  Get directions
                  <ExternalLinkIcon className="size-4 self-center mx-1" />
                </ExternalLink>
              </li>
            )}
          </ul>
        </div>
        {gig.prices.length > 0 && (
          <div className="flex gap-x-2">
            <TicketIcon className="size-6 shrink-0" />

            <ul>
              <li className="font-semibold text-lg">Ticket Information</li>
              {gig.prices.map((price) => (
                <li key={price.id} aria-label="Ticket Price">
                  {price.amount} {price.description}
                </li>
              ))}
            </ul>
          </div>
        )}
        {(gig.infoTags || []).length > 0 && (
          <div className="flex gap-x-2">
            <InformationCircleIcon className="size-6 shrink-0" />

            <ul>
              <li className="font-semibold text-lg">Event Information</li>
              {gig.infoTags.map(({ id, value }) => (
                <li key={id} aria-label="Event information">
                  {value}
                </li>
              ))}
            </ul>
          </div>
        )}
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
      <section className="flex gap-2 flex-wrap p-4">
        {(gig.genres || []).map(({ value, id }) => (
          <span
            key={id}
            className="bg-lmlpink text-white text-xs font-medium p-2"
          >
            {value}
          </span>
        ))}
      </section>

      {gig.ticketing_url && (
        <section className="p-4">
          <a
            href={gig.ticketing_url}
            className="flex content-center transition items-center justify-center text-center px-8 py-4 text-xl font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200 mx-auto px-8"
          >
            <div className="flex items-center justify-start space-x-1.5">
              <span>Get Tickets</span>
            </div>
          </a>
        </section>
      )}
    </article>
  );
}
