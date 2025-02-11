import { useRef } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { Icon } from "leaflet";
import { getMapCenter, getZoom, getTheme } from "../getLocation";
import { useGigList } from "../hooks/api";
import "leaflet/dist/leaflet.css";
import { gigIsSaved } from "../savedGigs";
import { useActiveGigFilters } from "../hooks/filters";
import { lbmfTheme } from "../themes";

const groupGigsByVenues = (gigs) => {
  return gigs.reduce((venues, gig) => {
    const venueId = gig.venue.id;
    if (!venues[venueId]) {
      venues[venueId] = {
        ...gig.venue,
        gigs: [],
      };
    }
    venues[venueId].gigs.push(gig);
    return venues;
  }, {});
};

const venueHasSavedGig = (gigs) => gigs.some(gigIsSaved);
const venueHasLbmfGig = (gigs) => gigs.some(gig => gig.series);

const Map = () => {
  const {
    data: { pages = [] },
    dateRange,
    customDate
  } = useGigList();
  const gigs = pages.map((page) => page.gigs).flat();
  const venues = Object.values(groupGigsByVenues(gigs));
  const mapRef = useRef();
  const defaultPosition = getMapCenter();
  const defaultZoom = getZoom();
  const { defaultMapPin, savedMapPin } = getTheme();
  const [, setActiveGigFilters] = useActiveGigFilters();

  const handleMarkerClick = (venue) => {
    const venues = [venue];
    setActiveGigFilters({ dateRange, customDate, venues });
  };

  const customIcon = (gigs) => {
    if (venueHasLbmfGig(gigs)) {
      if (venueHasSavedGig(gigs)) {
        return new Icon({
          iconUrl: lbmfTheme.savedMapPin,
          iconSize: [40, 40],
        });
      }

      return new Icon({
        iconUrl: lbmfTheme.defaultMapPin,
        iconSize: [45, 45],
      });
    } else {
      if (venueHasSavedGig(gigs)) {
        return new Icon({
          iconUrl: savedMapPin,
          iconSize: [40, 40],
        });
      }

      return new Icon({
        iconUrl: defaultMapPin,
        iconSize: [45, 45],
      });
    }
  };

  return (
    <>
      <MapContainer
        ref={mapRef}
        center={defaultPosition}
        zoom={defaultZoom}
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
        {venues.map((venue, index) => {
          const latitude = parseFloat(venue.latitude);
          const longitude = parseFloat(venue.longitude);

          if (!isNaN(latitude) && !isNaN(longitude)) {
            const position = [latitude, longitude];

            return (
              <Marker
                key={index}
                position={position}
                icon={customIcon(venue.gigs)}
                eventHandlers={{ click: () => handleMarkerClick(venue) }}
              ><Tooltip>{venue.name}</Tooltip></Marker>
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
