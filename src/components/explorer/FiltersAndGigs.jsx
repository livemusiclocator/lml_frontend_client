import GigFilter from "./GigFilter";
import GigsList from "./GigsList";
import { LoadingSpinner } from "../loading/LoadingOverlay";
import { useGigList } from "../../hooks/api";

export default function FiltersAndGigs() {
  const { data: gigs = [], isLoading } = useGigList();
  return (
    <>
      <div className="gig-explorer revert-tailwind" data-bs-theme="light">
        <div className="p-3 w-100 border-bottom">
          <GigFilter />
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="gig-explorer revert-tailwind" data-bs-theme="light">
          <GigsList gigs={gigs} />
        </div>
      )}
    </>
  );
}
