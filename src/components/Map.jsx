import { useRef } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { useMap } from "react-leaflet/hooks";
import { Icon } from "leaflet";
import { getTheme } from "../getLocation";
import { useGigList } from "../hooks/api";
import "leaflet/dist/leaflet.css";
import { gigIsSaved } from "../savedGigs";
import { useActiveGigFilters } from "../hooks/filters";
import { stkTheme } from "../themes";
import { getLocationMapSettings } from "../locations";

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
const venueHasSeriesGig = (gigs) => gigs.some((gig) => gig.series);

// VenueMarkers component that handles all data access and venue logic
const VenueMarkers = () => {
  const {
    data: { pages = [] },
  } = useGigList();
  const gigs = pages.map((page) => page.gigs).flat();
  const venues = Object.values(groupGigsByVenues(gigs));
  const { defaultMapPin, savedMapPin } = getTheme();
  const [activeGigFilters, setActiveGigFilters] = useActiveGigFilters();

  const handleMarkerClick = (venue) => {
    const venues = [venue];
    setActiveGigFilters({ ...activeGigFilters, venues });
  };

  const customIcon = (gigs) => {
    if (venueHasSeriesGig(gigs)) {
      if (venueHasSavedGig(gigs)) {
        return new Icon({
          iconUrl: stkTheme.savedMapPin,
          iconSize: [40, 40],
        });
      }
      return new Icon({
        iconUrl: stkTheme.defaultMapPin,
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
      {venues.map((venue, index) => {
        const latitude = parseFloat(venue.latitude);
        const longitude = parseFloat(venue.longitude);
        let isVenueFiltered = true;

        if (activeGigFilters.venues && activeGigFilters.venues.length > 0) {
          isVenueFiltered = activeGigFilters.venues.includes(venue.id);
        }

        if (!isNaN(latitude) && !isNaN(longitude) && isVenueFiltered) {
          const position = [latitude, longitude];

          return (
            <Marker
              key={index}
              position={position}
              icon={customIcon(venue.gigs)}
              eventHandlers={{ click: () => handleMarkerClick(venue) }}
            >
              <Tooltip>{venue.name}</Tooltip>
            </Marker>
          );
        }
        return null;
      })}
    </>
  );
};

const MapPositioner = () => {
  const map = useMap();
  const [activeGigFilters] = useActiveGigFilters();
  const location = getLocationMapSettings(activeGigFilters.location);

  const defaultPosition = location.mapCenter;
  const defaultZoom = location.zoom;

  // todo: Make this do useEffect as it gets quite annoying
  if (map) {
    map.setView(defaultPosition, defaultZoom, { animate: true });
  }

  return null;
};

const Map = () => {
  const mapRef = useRef();
  const [activeGigFilters] = useActiveGigFilters();
  const location = getLocationMapSettings(activeGigFilters.location);

  if (!location) {
    return null;
  }

  const defaultPosition = location.mapCenter;
  const defaultZoom = location.zoom;
  // todo : avoid hardcoded styles ?
  return (
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
      <VenueMarkers />
      <MapPositioner />
    </MapContainer>
  );
};

export default Map;
