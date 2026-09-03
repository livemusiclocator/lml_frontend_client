import { Fragment } from "react";
import { groupBy } from "lodash-es";
import { useGigSearchResults } from "@/hooks/api";
import { useGigFilterControls } from "@/hooks/useGigFilterControls";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import GigRow from "@/components/new/GigRow";
import DateDivider from "@/components/new/DateDivider";

const NoGigs = ({ onClearFilters }) => (
  <div className="flex flex-col items-center gap-3 p-8 text-center">
    <h2 className="text-lead font-semibold">No gigs match those filters</h2>
    <p className="text-meta text-ink-muted">
      Try a wider date range, or drop a filter or two.
    </p>
    <button
      type="button"
      onClick={onClearFilters}
      className="mt-1 h-11 rounded-full bg-night-chip px-5 text-mini font-semibold text-ink"
    >
      Clear filters
    </button>
  </div>
);

const GigListNew = () => {
  const { data, isLoading, dataLoaded } = useGigSearchResults();
  const controls = useGigFilterControls();
  const gigs = data?.gigs ?? [];
  const gigsByDate = groupBy(gigs, "date");

  return (
    <div className="flex min-h-0 grow flex-col overflow-y-auto overscroll-contain">
      {Object.entries(gigsByDate).map(([date, gigsOnDate]) => (
        <Fragment key={date}>
          <DateDivider date={date} count={gigsOnDate.length} />
          {gigsOnDate.map((gig) => (
            <GigRow key={gig.id} gig={gig} />
          ))}
        </Fragment>
      ))}
      {isLoading && <LoadingSpinner />}
      {dataLoaded && gigs.length === 0 && (
        <NoGigs onClearFilters={controls.clearAll} />
      )}
    </div>
  );
};

export default GigListNew;
