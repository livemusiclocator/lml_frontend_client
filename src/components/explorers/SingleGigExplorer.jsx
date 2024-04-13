import { Link, useParams } from "react-router-dom";
import { FilterWrapper } from "./MapFilter";

export default function SingleGigExplorer({ gigs }) {
  const { id } = useParams();

  return (
    <FilterWrapper expanded={true}>
      <Link
        to="/"
        className="btn btn-sm btn-light w-100 text-center border-bottom"
      >
        Close
      </Link>
      {JSON.stringify(gigs.find((gig) => gig.id === id))}
    </FilterWrapper>
  );
}
