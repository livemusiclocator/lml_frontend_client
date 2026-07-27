import { Link, useParams } from "react-router";
import { filteredGigListPath } from "@/searchParams";
import LoadingSpinner from "@/components/shared/LoadingSpinner.jsx";
import Genres from "@/pages/GigDetails/Genres.jsx";
import { useAct } from "@/hooks/api";
import ActLinks from "@/pages/ActDetails/ActLinks.jsx";
import UpcomingGigs from "@/pages/ActDetails/UpcomingGigs.jsx";

const ActError = ({ error }) => {
  return (
    <div className="p-8 m-8 flex flex-col items-center gap-8">
      <h2 className="text-4xl font-bold">Act not found</h2>
      {error.status == 404 && (
        <>
          <div>
            <p>We don&apos;t seem to know about this act.</p>
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
            Act details currently unavailable - please try again later or{" "}
            <a href="/contact" className="internal-link">
              contact us
            </a>
          </p>
        </>
      )}
    </div>
  );
};

export default function ActDetails({ className }) {
  const { id } = useParams();
  const { data: act, isLoading, error } = useAct(id);

  if (isLoading || (!act && !error)) {
    return <LoadingSpinner />;
  }

  return (
    <article
      className={`overflow-scroll min-w-sm max-w-2xl mx-auto ${className || ""} pb-4 h-full`}
    >
      {error && <ActError error={error} />}
      {act && (
        <>
          <header
            className={`flex items-start justify-between flex-row ${className || ""} p-4`}
          >
            <hgroup className="break-words text-pretty">
              <h2 className="flex text-4xl font-bold items-center">
                {act.name}
              </h2>
              <h3 className="font-bold items-center">{act.country}</h3>
              {act.genres && act.genres.length > 0 && (
                <Genres genres={act.genreTags} />
              )}
            </hgroup>
          </header>
          <UpcomingGigs gigs={act.upcoming_gigs} />
          <ActLinks act={act} />
        </>
      )}
    </article>
  );
}
