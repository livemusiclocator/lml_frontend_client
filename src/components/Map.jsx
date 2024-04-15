import { useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import { getMapCenter } from "../getLocation";
import { useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import { gigIsSaved } from "../savedGigs";

const Map = ({ gigs }) => {
  const mapRef = useRef();
  const defaultPosition = getMapCenter();

  const customIcon = (gig) => {
    if (gigIsSaved(gig)) {
      return new Icon({
        iconUrl: "/alt-marker-2-saved.png",
        iconSize: [40, 40],
      });
    }

    return new Icon({
      iconUrl: "/alt-marker-2.png",
      iconSize: [45, 45],
    });
  };

  const navigate = useNavigate();

  return (
    <>
      <MapContainer
        ref={mapRef}
        center={defaultPosition}
        zoom={13}
        style={{ height: "100dvh", width: "100%" }}
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

            return (
              <Marker
                key={index}
                position={position}
                icon={customIcon(gig)}
                eventHandlers={{
                  click: () => navigate(`/gigs/${gig.id}`),
                }}
              ></Marker>
            );
          } else {
            return null;
          }
        })}
      </MapContainer>
    </>
  );
};

export default Map;
