import { useState, useEffect } from "react";

const FetchData = ({ render, date, searchParams }) => {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const dateString = date.toISOString().slice(0, 10);
    fetch(
      `https://lml.live/gigs/query?date_from=${dateString}&date_to=${dateString}`
    )
      .then((response) => response.json())
      .then((data) => {
        let filteredGigs = data;
        if (searchParams.tags && searchParams.tags.length > 0) {
          filteredGigs = filteredGigs.filter((gig) =>
            searchParams.tags.some((tag) => gig.venue.address.includes(tag))
          );
        }

        if (
          searchParams.postcode &&
          (!searchParams.tags ||
            !searchParams.tags.includes(searchParams.postcode))
        ) {
          filteredGigs = filteredGigs.filter((gig) =>
            gig.venue.address.includes(searchParams.postcode)
          );
        }
        setGigs(filteredGigs);
      })
      .catch((error) => console.error("Error fetching gigs:", error));
  }, [date, searchParams]);

  return render({
    gigs,
  });
};

export default FetchData;
