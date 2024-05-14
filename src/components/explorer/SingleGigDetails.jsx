import { useParams, useSearchParams } from "react-router-dom";
import SaveGigButton from "../SaveGigButton";
import { useGig } from "../../hooks/api";
import { LoadingSpinner } from "../loading/LoadingOverlay";
import DateTimeDisplay from "../DateTimeDisplay";
import tw from "tailwind-styled-components";
import Markdown from "react-markdown";

import DateTime from "./details/DateTime";
import Genres from "./details/Genres";
import Venue from "./details/Venue";
import Prices from "./details/Prices";
import InfoTags from "./details/InfoTags";
import Tickets from "./details/Tickets";
import Sets from "./details/Sets";

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
        <DateTime gig={gig} />
        <Venue venue={gig.venue} />
        <Sets sets={gig.sets || []} />
        <Prices prices={gig.prices || []} />
        <InfoTags infoTags={gig.infoTags || []}/>
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
      <Genres genres={gig.genres} />
      <Tickets url={gig.ticketing_url} />
    </article>
  );
}
