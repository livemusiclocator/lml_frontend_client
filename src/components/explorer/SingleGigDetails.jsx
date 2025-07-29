import { useParams, useSearchParams, Link } from "react-router";
import SaveGigButton from "../SaveGigButton";
import { useGig } from "../../hooks/api_v2";
import { LoadingSpinner } from "../loading/LoadingOverlay";
import DateTimeDisplay from "../DateTimeDisplay";
import tw from "tailwind-styled-components";
import DateTime from "./details/DateTime";
import Genres from "./details/Genres";
import Venue from "./details/Venue";
import Prices from "./details/Prices";
import InfoTags from "./details/InfoTags";
import Tickets from "./details/Tickets";
import Sets from "./details/Sets";
import lbmfLogo from "../../assets/lbmf2024logo.png";
import skLogo from "../../assets/skf_blacklogo.svg";
import { filteredGigListPath } from "../../searchParams";
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
    <div className="relative max-h-[40svh] overflow-hidden aspect-2/1 w-full">
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
  const lbmf = gig.series === "lbmf";
  const sk = gig.series === "stkildafestival2025";
  return (
    <header
      className={`flex items-start justify-between flex-row ${className || ""} p-4`}
    >
      <hgroup className="break-words text-pretty">
        <p className="font-semibold">
          <DateTimeDisplay value={gig.date} type="briefDate" />
        </p>
        <h2 className="flex text-4xl font-bold items-center">
          {lbmf && <img src={lbmfLogo} className="m-2 shrink w-10" />}
          {sk && <img src={skLogo} className="m-2 shrink w-10" />}
          {gig.name}
          {gig.status === "cancelled" && " (CANCELLED)"}
        </h2>
        <h3 className="font-bold items-center">
          {gig.ticket_status === "selling_fast" && "SELLING FAST!"}
          {gig.ticket_status === "sold_out" && "SOLD OUT!"}
        </h3>
      </hgroup>
      <SaveGigButton gig={gig} />
    </header>
  );
};
const GigError = ({ error }) => {
  return (
    <div className="p-8 m-8 flex flex-col items-center gap-8">
      <h2 className="text-4xl font-bold">Gig not found</h2>
      {error.status == 404 && (
        <>
          <div>
            <p>We don't seem to know about this gig.</p>
            <p>
              Maybe you could try{" "}
              <Link to={filteredGigListPath()} className="internal-link">
                looking for it here
              </Link>
              .
            </p>{" "}
          </div>
        </>
      )}
      {error.status != 404 && (
        <>
          <p>
            Gig details currently unavailable - please try again later or{" "}
            <a href="/contact" className="internal-link">
              contact us
            </a>
          </p>
        </>
      )}
    </div>
  );
};
export default function SingleGigDetails({ className }) {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { data: gig, isLoading, error } = useGig(id);
  const showImagePlaceholder = searchParams.get("showImagePlaceholder");

  if (isLoading || (!gig && !error)) {
    // todo: make skeleton load page type thing here to stop the page from jumping about
    return <LoadingSpinner />;
  }

  return (
    <article
      className={`overflow-scroll min-w-sm max-w-2xl mx-auto ${className || ""} pb-4 h-full`}
    >
      {showImagePlaceholder && <GigHeroImageBanner />}
      {error && <GigError error={error} />}
      {gig && (
        <>
          <GigHeader gig={gig} className="grow shrink-0" />
          <Aside className="bg-gray-200">
            <DateTime gig={gig} />
            <Venue venue={gig.venue} />
            <Sets sets={gig.sets || []} />
            <Prices prices={gig.prices || []} />
            <InfoTags infoTags={gig.informationTags || []} />
          </Aside>
          <Genres genres={gig.genreTags} />
          <Tickets url={gig.ticketing_url} />
        </>
      )}
    </article>
  );
}
