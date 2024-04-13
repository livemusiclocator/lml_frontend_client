import styled from "styled-components";
import { Link } from "react-router-dom";
import GigFilter from "./GigFilter";
import GigsList from "./GigsList";

export const FilterWrapper = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 1000;
  background-color: white;
  width: 100vw;
  border-top-right-radius: 1.5rem;
  border-top-left-radius: 1.5rem;
  height: ${(props) => (props.expanded ? "100%" : "30vh")};
  overflow: hidden;
  transition: height 0.5s;
`;

export default function MapFilter({ date, setDate, gigs }) {
  return (
    <FilterWrapper>
      <Link
        to="/list"
        className="btn btn-sm btn-light w-100 text-center border-bottom"
      >
        Expand
      </Link>
      <div className="p-3 w-100 border-bottom">
        <GigFilter date={date} setDate={setDate} />
      </div>
      <GigsList gigs={gigs} />
    </FilterWrapper>
  );
}
