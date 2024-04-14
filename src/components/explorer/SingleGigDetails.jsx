import { Link, useNavigate, useNavigationType } from "react-router-dom";
import { gigIsSaved, saveGig, unsaveGig } from "../../savedGigs";
import { useState } from "react";
import styled from "styled-components";

const StarButton = styled.button`
  font-size: 1.5em;
  color: gold !important;
  padding: 0;
  border: none;
  background: none;
`;

const BackButton = styled.button`
  font-size: 1.5em;
  padding: 0;
  border: none;
  background: none;
`;

export default function SingleGigDetails({ gig }) {
  const [gigSaved, setGigSaved] = useState(gigIsSaved(gig));

  const navType = useNavigationType();
  const to = navType === "POP" ? "/" : -1;

  const toggleGigSaved = () => {
    if (gigSaved) {
      unsaveGig(gig);
      setGigSaved(false);
    } else {
      saveGig(gig);
      setGigSaved(true);
    }
  };

  return (
    <>
      <div
        className="p-3 border-bottom d-flex justify-content-between"
        style={{ height: "71px" }}
      >
        <Link to={to}>
          <BackButton className="btn btn-light px-2">←</BackButton>
        </Link>
        <StarButton className="px-2 btn btn-light" onClick={toggleGigSaved}>
          {gigSaved ? "★" : "☆"}
        </StarButton>
      </div>
      <div className="px-3 mt-2">
        <div className="text-nowrap">
          {new Date(gig.start_time).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </div>
        <h4>{gig.name}</h4>
        <p className="mb-1">{gig.venue.name} </p>
        <p className="text-muted">{gig.venue.address}</p>
      </div>
    </>
  );
}
