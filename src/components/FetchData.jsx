import { useState, useEffect } from "react";
import { useDate } from "../contexts/DateContext";
import { useSearch } from "../contexts/SearchContext";

const FetchData = ({ render }) => {
  const { searchParams } = useSearch();
  const [gigs, setGigs] = useState([]);
  const { date: selectedDate } = useDate();

  useEffect(() => {
    const date = selectedDate.toISOString().slice(0, 10);
    fetch(`https://lml.live/gigs/query?date_from=${date}&date_to=${date}`)
      .then((response) => response.json())
      .then((data) => {
        setGigs(data);
      })
      .catch((error) => console.error("Error fetching gigs:", error));
  }, [selectedDate, searchParams.postcode]);

  return render({
    gigs,
  });
};

export default FetchData;
