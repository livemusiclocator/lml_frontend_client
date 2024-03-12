import DateSlider from "./DateSlider";
import { useDate } from "../contexts/DateContext";
import FetchData from "./FetchData";

function Explore() {
  const { date: selectedDate, setDate: setSelectedDate } = useDate();

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  return (
    <div className="pageContainer">
      <h1>Explore Melbourne and find cool gigs!</h1>
      <DateSlider initialDate={selectedDate} onChange={handleDateChange} />
      <FetchData
        render={({ gigs }) => {
          return (
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
          );
        }}
      />
    </div>
  );
}

export default Explore;
