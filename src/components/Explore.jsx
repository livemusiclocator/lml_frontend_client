import { useState, useEffect } from "react";
import DateSlider from "./DateSlider";
import { useDate } from "../contexts/DateContext";
import { useSearch } from "../contexts/SearchContext";

function Explore() {
  const { date: selectedDate, setDate: setSelectedDate } = useDate();
  const { searchParams } = useSearch();
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/gigs")
      .then((response) => response.json())
      .then((data) => {
        const filteredGigs = data.gigs.filter((gig) => {
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

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  return (
    <div className="pageContainer">
      <h1>Explore Melbourne and find cool gigs!</h1>
      <DateSlider initialDate={selectedDate} onChange={handleDateChange} />
      <div>
        {gigs.length > 0 ? (
          gigs.map((gig, index) => (
            <div
              key={index}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                margin: "10px 0",
              }}
            >
              <h2>{gig.name}</h2>
              <p>{gig.venue.name}</p>
              <p>{new Date(gig.start_time).toLocaleString()}</p>
              <p>{gig.venue.address}</p>
            </div>
          ))
        ) : (
          <p>No gigs found for this date.</p>
        )}
      </div>
    </div>
  );
}

export default Explore;
