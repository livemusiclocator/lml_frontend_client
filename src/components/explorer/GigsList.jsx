import { Link } from "react-router-dom";

export default function GigsList({ gigs }) {
  return (
    <div className="h-100 overflow-scroll ">
      <div className="list-group list-group-flush">
        {gigs.map((gig) => (
          <Link to={`/gigs/${gig.id}`} key={gig.id} className="list-group-item">
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
          </Link>
        ))}
        <div className="list-group-item" style={{ height: "200px" }} />
      </div>
    </div>
  );
}
