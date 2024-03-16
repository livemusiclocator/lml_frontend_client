import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useDate } from "../contexts/DateContext";
import DateSlider from "./DateSlider";
import FetchData from "./FetchData";

import "leaflet/dist/leaflet.css";

const Map = () => {
  const { date: selectedDate, setDate: setSelectedDate } = useDate();

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  const defaultPosition = [-37.840935, 144.946457]; // Melbourne

  const customIcon = new Icon({
    iconUrl: "marker.png",
    iconSize: [38, 38],
  });

  return (
    <>
      <DateSlider initialDate={selectedDate} onChange={handleDateChange} />
      <FetchData
        render={({ gigs }) => {
          return (
            <MapContainer
              center={defaultPosition}
              zoom={13}
              style={{ height: "calc(100vh - 85px)", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {gigs.map((gig, index) => {
                const position = [
                  parseFloat(gig.venue.latitude),
                  parseFloat(gig.venue.longitude),
                ];

                const startTime = new Date(gig.start_time);
                const formattedStartTime = startTime.toLocaleTimeString(
                  "en-AU",
                  {
                    hour: "numeric",
                    hour12: true,
                  }
                );

                return (
                  <Marker key={index} position={position} icon={customIcon}>
                    <Popup>
                      {gig.name} <br />
                      {gig.headline_act.genres.map((genre, genreIndex) => (
                        <span key={genreIndex} style={{ marginRight: "10px" }}>
                          {genre}
                        </span>
                      ))}{" "}
                      <br />
                      {gig.venue.name} <br />
                      {"Starts at " + formattedStartTime} <br />
                      {gig.venue.address}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          );
        }}
      />
    </>
  );
};

export default Map;
