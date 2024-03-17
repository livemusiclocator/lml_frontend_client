import { useState, useEffect } from "react";
import { useDate } from "../contexts/DateContext";
import { useSearch } from "../contexts/SearchContext";

const FetchData = ({ render }) => {
  const { searchParams } = useSearch();
  const [gigs, setGigs] = useState([]);
  const { date: selectedDate } = useDate();

  useEffect(() => {
    fetch("https://lml.live/gigs/query")
      .then((response) => response.json())
      .then((data) => {
        const filteredGigs = data.filter((gig) => {
          const gigDate = new Date(gig.start_time);
          const isSameDay =
            gigDate.getDate() === selectedDate.getDate() && // returns day of the month, 1 to 31
            gigDate.getMonth() === selectedDate.getMonth() && // returns month, 0 to 11. January gives 0
            gigDate.getFullYear() === selectedDate.getFullYear();
          const matchesPostcode = searchParams.postcode
            ? gig.venue.address.endsWith(searchParams.postcode)
            : true;
          return isSameDay && matchesPostcode;
        });
        setGigs(filteredGigs);
      })
      .catch((error) => console.error("Error fetching gigs:", error));
  }, [selectedDate, searchParams.postcode]);

  return render({
    gigs,
  });
};

export default FetchData;
