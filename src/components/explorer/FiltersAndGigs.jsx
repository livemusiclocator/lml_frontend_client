import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import GigFilter from "./GigFilter";
import GigsList from "./GigsList";
import { LoadingSpinner } from "../loading/LoadingOverlay";
import SingleGigDetails from "./SingleGigDetails";

export const FilterWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  background-color: white;
  ${(props) => {
    if (!props.$expand) {
      return `
      border-top-right-radius: 1.5rem;
      border-top-left-radius: 1.5rem;
      `;
    }
  }};
  overflow: hidden;
  transition: height 0.15s ease-in, border-radius 0.15s ease-in;
  width: 100vw;
  height: ${(props) => (props.$expand ? "100%" : "30vh")};
  bottom: 0;
  @media (min-width: 1024px) {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    bottom: 20px;
    left: 20px;
    min-width: 300px;
    max-width: 400px;
    height: calc(100vh - 20px - 20px);
    border-bottom-right-radius: 1.5rem;
    border-bottom-left-radius: 1.5rem;

    #overlay-expand-button {
      display: none;
    }
  }
`;

export default function FiltersAndGigs({
  date,
  setDate,
  gigs,
  expandList,
  isLoading,
  showSingleGig,
}) {
  const { id } = useParams();
  const gig = gigs.find((gig) => gig.id === id);

  if (showSingleGig && !gig) {
    throw "NOT IMPLEMENTED YET";
  }

  const renderer = () => {
    if (showSingleGig) {
      return (
        <div className="p-3">
          <SingleGigDetails gig={gig} />
        </div>
      );
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
    <FilterWrapper $expand={expandList}>
      <Link
        to={expandList ? "/" : "/list"}
        id="overlay-expand-button"
        className="btn btn-sm btn-light w-100 text-center border-bottom rounded-0"
      >
        {expandList ? "Close" : "Expand"}
      </Link>
      {renderer()}
    </FilterWrapper>
  );
}
