import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import GigFilter from "./GigFilter";
import GigsList from "./GigsList";
import { LoadingSpinner } from "../loading/LoadingOverlay";
import SingleGigDetails from "./SingleGigDetails";

export const FilterWrapper = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 1000;
  background-color: white;
  width: 100vw;
  ${(props) => {
    if (!props.$expand) {
      return `
    border-top-right-radius: 1.5rem;
    border-top-left-radius: 1.5rem;
  `;
    }
  }};
  height: ${(props) => (props.$expand ? "100%" : "30vh")};
  overflow: hidden;
  transition: height 0.15s ease-in, border-radius 0.15s ease-in;
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
        className="btn btn-sm btn-light w-100 text-center border-bottom rounded-0"
      >
        {expandList ? "Close" : "Expand"}
      </Link>
      {renderer()}
    </FilterWrapper>
  );
}
