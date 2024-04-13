export default function SingleGigDetails({ gig }) {
  return (
    <>
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
    </>
  );
}
