import GigFilter from "./GigFilter";
// Temporarily putting this in place to test it out
import GigsList from "./GigsList";
import GigsListMk2 from "../GigList";
import { LoadingSpinner } from "../loading/LoadingOverlay";
import { useGigList, useGigFilters } from "../../hooks/api";

export default function FiltersAndGigs() {
  const { data: gigs = [], isLoading } = useGigList();
  const [{ magic }] = useGigFilters();
  if (magic) {
    return isLoading ? <LoadingSpinner /> : <GigsListMk2 />;
  }
  return (
    <>
      <div className="gig-explorer revert-tailwind" data-bs-theme="light">
        <div className="p-3 w-100 border-bottom">
          <GigFilter />
        </div>
      </div>
      {isLoading ? <LoadingSpinner /> : <GigsList gigs={gigs} />}
    </>
  );
}
