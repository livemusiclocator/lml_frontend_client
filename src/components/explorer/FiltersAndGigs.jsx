import { Link, useNavigate, useParams } from "react-router-dom";
import GigFilter from "./GigFilter";
import GigsList from "./GigsList";
import { LoadingSpinner } from "../loading/LoadingOverlay";
import SingleGigDetails from "./SingleGigDetails";
import { FilterWrapper } from "./FilterOverlay";

export default function FiltersAndGigs({
  date,
  setDate,
  gigs,
  isLoading,
  showSingleGig,
  listMaximised,
}) {
  const { id } = useParams();
  const gig = gigs.find((gig) => gig.id === id);
  const navigate = useNavigate();
  if (showSingleGig) {
    // todo: just fetching first gig?
    if (!gig && !isLoading) navigate("/");
    return (
      <div className="flex z-20 absolute top-0 left-0 w-full">
        <SingleGigDetails
          gig={gig}
          isLoading={isLoading}
          className="bg-white w-full"
        />
      </div>
    );
  }

  const renderer = () => {
    return (
      <>
        <div className="gig-explorer revert-tailwind" data-bs-theme="light">
          <div className="p-3 w-100 border-bottom">
            <GigFilter date={date} setDate={setDate} />
          </div>
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="gig-explorer revert-tailwind" data-bs-theme="light">
            {" "}
            <GigsList gigs={gigs} />{" "}
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <FilterWrapper $listMaximised={listMaximised}>
        <div className="gig-explorer revert-tailwind" data-bs-theme="light">
          <Link
            to={listMaximised ? "/map" : "/"}
            id="overlay-expand-button"
            className="w-100 text-center rounded-0 btn btn-sm btn-light border-0 bg-white text-muted"
            style={{
              marginBottom: "-10px",
            }}
          >
            {listMaximised ? (
              <i className="bi bi-pin-map-fill"></i>
            ) : (
              <i className="bi bi-caret-up-fill"></i>
            )}
          </Link>
        </div>
        {renderer()}
      </FilterWrapper>
    </>
  );
}
