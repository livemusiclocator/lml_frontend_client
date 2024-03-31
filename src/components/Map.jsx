import { useRef, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { getPosition } from "../getLocation";

import "leaflet/dist/leaflet.css";

const Map = ({ gigs }) => {
  const mapRef = useRef();
  const defaultPosition = getPosition();
  const [userPosition, setUserPosition] = useState(null);

  const customIcon = new Icon({
    iconUrl: "marker.png",
    iconSize: [38, 38],
  });

  return (
    <MapContainer
      ref={mapRef}
      center={userPosition || defaultPosition}
      zoom={13}
      style={{ height: "calc(100vh - 85px)", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {gigs.map((gig, index) => {
        const latitude = parseFloat(gig.venue.latitude);
        const longitude = parseFloat(gig.venue.longitude);

        if (!isNaN(latitude) && !isNaN(longitude)) {
          const position = [latitude, longitude];

          const startTime = new Date(gig.start_time);
          const formattedStartTime = startTime.toLocaleTimeString("en-AU", {
            hour: "numeric",
            hour12: true,
          });
          const genres =
            gig.headline_act && gig.headline_act.genres
              ? gig.headline_act.genres
              : [];

          return (
            <Marker key={index} position={position} icon={customIcon}>
              <Popup>
                {gig.name} <br />
                {genres.map((genre, genreIndex) => (
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
        } else {
          return null;
        }
      })}
    </MapContainer>
  );
};

export default Map;
