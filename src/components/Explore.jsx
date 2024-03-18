function Explore({ gigs }) {
  return (
    <div>
      {gigs.length > 0 ? (
        gigs.map((gig, index) => {
          const genres =
            gig.headline_act && gig.headline_act.genres
              ? gig.headline_act.genres
              : [];

          return (
            <div
              key={index}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                margin: "10px 0",
              }}
            >
              <h2>{gig.name}</h2>
              <p>
                {genres.map((genre, genreIndex) => (
                  <span key={genreIndex} style={{ marginRight: "10px" }}>
                    {genre}
                  </span>
                ))}
              </p>
              <p>{gig.venue.name}</p>
              <p>{new Date(gig.start_time).toLocaleString()}</p>
              <p>{gig.venue.address}</p>
            </div>
          );
        })
      ) : (
        <p>No gigs found for this date.</p>
      )}
    </div>
  );
}

export default Explore;
