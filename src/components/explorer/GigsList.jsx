import { Link } from "react-router-dom";
import SaveGigButton from "../SaveGigButton";
import styled from "styled-components";

export default function GigsList({ gigs }) {
  return (
    <div className="h-100 overflow-auto">
      <div className="list-group list-group-flush">
        {gigs.map((gig) => (
          <Link
            to={`gigs/${gig.id}`}
            key={gig.id}
            className="list-group-item p-3"
          >
            <div className="d-flex justify-content-between mb-2">
              {gig.start_time && (
                <div className="text-nowrap">
                  {new Date(gig.start_time).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </div>
              )}
              <SaveGigButton />
            </div>
            <h4>{gig.name}</h4>
            <div className="mb-1">{gig.venue.name} </div>
            <div className="text-muted">{gig.venue.address}</div>
          </Link>
        ))}
        <div className="list-group-item" style={{ height: "200px" }} />
      </div>
    </div>
  );
}
