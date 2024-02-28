import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/gigs")
      .then((response) => response.json())
      .then((data) => setGigs(data.gigs))
      .catch((error) => console.error("Error fetching gigs:", error));
  }, []);

  const defaultPosition = [-37.840935, 144.946457]; // Melbourne

  const customIcon = new Icon({
    iconUrl: "marker.png",
    iconSize: [38, 38],
  });

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
        const position = gig["Venue Latlong"]
          ? [gig["Venue Latlong"].lat, gig["Venue Latlong"].lng]
          : defaultPosition;

        return (
          <Marker key={index} position={position} icon={customIcon}>
            <Popup>
              {gig["Gig Name"]} <br />
              {gig["Venue Name"]}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default Map;
