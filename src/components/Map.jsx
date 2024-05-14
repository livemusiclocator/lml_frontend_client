import { useRef } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";
import { getMapCenter, getTheme } from "../getLocation";
import { useNavigate } from "react-router-dom";
import { useGigList } from "../hooks/api";
import "leaflet/dist/leaflet.css";
import { gigIsSaved } from "../savedGigs";

const Map = () => {
  const { data: pages = [] } = useGigList();
  const gigs = pages.map((page) => page.gigs).flat();
  const mapRef = useRef();
  const defaultPosition = getMapCenter();
  const { defaultMapPin, savedMapPin } = getTheme();

  const customIcon = (gig) => {
    if (gigIsSaved(gig)) {
      return new Icon({
        iconUrl: savedMapPin,
        iconSize: [40, 40],
      });
    }

    return new Icon({
      iconUrl: defaultMapPin,
      iconSize: [45, 45],
    });
  };

  const navigate = useNavigate();
  return (
    <>
      <MapContainer
        ref={mapRef}
        center={defaultPosition}
        zoom={15}
        style={{
          height: "100%",
          width: "100%",
          zIndex: 0,
          top: 0,
          left: 0,
          position: "absolute",
        }}
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
