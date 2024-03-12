import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useState, useEffect } from "react";
import { useDate } from "../contexts/DateContext";
import { useSearch } from "../contexts/SearchContext";
import DateSlider from "./DateSlider";

import "leaflet/dist/leaflet.css";

const Map = () => {
  const [gigs, setGigs] = useState([]);
  const { date: selectedDate, setDate: setSelectedDate } = useDate();
  const { searchParams } = useSearch();

  useEffect(() => {
    fetch("http://localhost:8080/gigs")
      .then((response) => response.json())
      .then((data) => {
        const filteredGigs = data.gigs.filter((gig) => {
          const gigDate = new Date(gig.start_time);
          const isSameDay =
            gigDate.getDate() === selectedDate.getDate() &&
            gigDate.getMonth() === selectedDate.getMonth() &&
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

  const defaultPosition = [-37.840935, 144.946457]; // Melbourne

  const customIcon = new Icon({
    iconUrl: "marker.png",
    iconSize: [38, 38],
  });

  return (
    <>
      <DateSlider initialDate={selectedDate} onChange={handleDateChange} />
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
          const formattedStartTime = startTime.toLocaleTimeString("en-AU", {
            hour: "numeric",
            hour12: true,
          });

          return (
            <Marker key={index} position={position} icon={customIcon}>
              <Popup>
                {gig.name} <br />
                {gig.venue.name} <br />
                {"Starts at " + formattedStartTime} <br />
                {gig.venue.address}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </>
  );
};

export default Map;
