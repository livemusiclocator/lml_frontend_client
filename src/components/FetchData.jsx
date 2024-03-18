import { useState, useEffect } from "react";
import { useSearch } from "../contexts/SearchContext";

const FetchData = ({ render, date }) => {
  const { searchParams } = useSearch();
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const dateString = date.toISOString().slice(0, 10);
    fetch(
      `https://lml.live/gigs/query?date_from=${dateString}&date_to=${dateString}`
    )
      .then((response) => response.json())
      .then((data) => {
        const filteredGigs = data.filter((gig) => {
          const matchesPostcode = searchParams.postcode
            ? gig.venue.address.endsWith(searchParams.postcode)
            : true;
          return matchesPostcode;
        });
        setGigs(filteredGigs);
      })
      .catch((error) => console.error("Error fetching gigs:", error));
  }, [date, searchParams.postcode]);

  return render({
    gigs,
  });
};

export default FetchData;
