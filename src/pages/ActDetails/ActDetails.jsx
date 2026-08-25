import { Link } from "react-router";
import { compact } from "lodash-es";
import { useAct } from "@/hooks/api";
import getConfig from "@/config";
import { filteredGigListPath } from "@/searchParams";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Genres from "@/pages/GigDetails/Genres";
import ActLinks from "./ActLinks";
import UpcomingGigs from "./UpcomingGigs";

// Where the act is from, as far as we know it: an lml location id, which the
// config knows a nicer caption for, and/or a country.
const actOrigin = (act) => {
  const { allLocations } = getConfig();
  const location = allLocations.find(({ id }) => id === act.location);
  return compact([location?.caption || act.location, act.country]).join(", ");
};

const ActHeader = ({ act, className }) => {
  const origin = actOrigin(act);

  return (
    <header
      className={`flex items-start justify-between flex-row ${className || ""} p-4`}
    >
      <hgroup className="break-words text-pretty">
        <h2 className="flex text-4xl font-bold items-center">{act.name}</h2>
        {origin && <p className="font-semibold">{origin}</p>}
      </hgroup>
    </header>
  );
};

const ActError = ({ error }) => {
  return (
    <div className="p-8 m-8 flex flex-col items-center gap-8">
      <h2 className="text-4xl font-bold">Act not found</h2>
      {error.status == 404 ? (
        <div>
          <p>We don&apos;t seem to know about this act.</p>
          <p>
            Maybe you could try{" "}
            <Link to={filteredGigListPath()} className="internal-link">
              looking for them here
            </Link>
            .
          </p>
        </div>
      ) : (
        <p>
          Act details currently unavailable - please try again later or{" "}
          <a href="/contact" className="internal-link">
            contact us
          </a>
        </p>
      )}
    </div>
  );
};

export default function ActDetails({ className }) {
  const { data: act, isLoading, error } = useAct();

  if (isLoading || (!act && !error)) {
    // todo: as for a gig - a skeleton here would stop the page jumping about
    return <LoadingSpinner />;
  }

  return (
    <article
      className={`overflow-scroll min-w-sm max-w-2xl mx-auto ${className || ""} pb-4 h-full`}
    >
      {error && <ActError error={error} />}
      {act && (
        <>
          <ActHeader act={act} className="grow shrink-0" />
          {act.genreTags.length > 0 && <Genres genres={act.genreTags} />}
          <UpcomingGigs gigs={act.upcoming_gigs} />
          <ActLinks act={act} />
        </>
      )}
    </article>
  );
}
