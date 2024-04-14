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
  listSize,
}) {
  const { id } = useParams();
  const gig = gigs.find((gig) => gig.id === id);
  const navigate = useNavigate();

  const renderer = () => {
    if (showSingleGig) {
      if (!gig) navigate("/");
      return isLoading ? <LoadingSpinner /> : <SingleGigDetails gig={gig} />;
    }

    return (
      <>
        <div className="p-3 w-100 border-bottom">
          <GigFilter date={date} setDate={setDate} />
        </div>
        {isLoading ? <LoadingSpinner /> : <GigsList gigs={gigs} />}
      </>
    );
  };

  return (
    <>
      <Link
        to={listSize === "minimised" ? "/" : "/map"}
        className="btn btn-light shadow"
        style={{
          position: "absolute",
          zIndex: 1000,
          top: "0.5rem",
          right: "0.5rem",
        }}
      >
        {listSize === "minimised" ? (
          <i className="bi bi-fullscreen-exit"></i>
        ) : (
          <i className="bi bi-fullscreen"></i>
        )}
      </Link>
      <FilterWrapper $listSize={listSize}>
        <Link
          to={listSize === "maximised" ? "/" : "/list"}
          id="overlay-expand-button"
          className="w-100 text-center rounded-0 btn btn-sm btn-light border-0 bg-white text-muted"
          style={{
            marginBottom: "-10px",
            transform: listSize === "maximised" ? "rotate(180deg)" : "",
            transition: "transform 0.2s ease-in-out",
          }}
        >
          <i className="bi bi-caret-up-fill"></i>
        </Link>
        {renderer()}
      </FilterWrapper>
    </>
  );
}
