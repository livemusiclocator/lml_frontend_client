const GigDetailsTile = ({ gig, onClose }) => {
  if (!gig) return null;
  const startTime = new Date(gig.start_time).toLocaleTimeString("en-AU", {
    hour: "numeric",
    hour12: true,
  });

  return (
    <div className="gig-details-tile-overlay">
      <div className="gig-details-tile">
        <button onClick={onClose} className="close-btn">
          &times;
        </button>
        <h2>{gig.name}</h2>
        <p>{gig.venue.name}</p>
        <p>Starts at {startTime}</p>
        <p>{gig.venue.address}</p>
      </div>
    </div>
  );
};

export default GigDetailsTile;
