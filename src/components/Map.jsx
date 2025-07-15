import { useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { useMap } from "react-leaflet/hooks";
import { Icon } from "leaflet";
import { getTheme } from "../getLocation";
import { useGigList } from "../hooks/api";
import "leaflet/dist/leaflet.css";
import { gigIsSaved } from "../savedGigs";
import {
  useNavigateToGigList,
  useGigFilterOptions,
  useActiveGigFilters,
} from "../hooks/filters";
import { stkTheme } from "../themes";
import { groupBy } from "lodash-es";
import { getLocationMapSettings } from "../locations";

const addGigsToVenues = (venues, allGigs) => {
  const gigsByVenue = groupBy(allGigs, "venue.id");
  return venues.map((venue) => {
    const gigs = gigsByVenue[venue.id] ?? [];

    return {
      ...venue,
      gigs,
      hasVisibleGigs: gigs.some((gig) => gig.visible),
      hasSavedGigs: gigs.some(gigIsSaved),
      hasSeriesGigs: gigs.some((gig) => gig.series),
    };
  });
};

// VenueMarkers component that handles all data access and venue logic
const VenueMarkers = () => {
  const {
    data: { allGigs = [] },
  } = useGigList();
  const { allVenues } = useGigFilterOptions();
  const venues = addGigsToVenues(allVenues, allGigs);
  const theme = getTheme() ?? {};

  const navigateToGigList = useNavigateToGigList();
  const [activeGigFilters] = useActiveGigFilters();

  const handleMarkerClick = async (venue) => {
    activeGigFilters;
    const newVenueFilters = venue.selected ? [] : [venue.id];
    await navigateToGigList({ ...activeGigFilters, venueIds: newVenueFilters });
  };

  const customIcon = ({ hasSeriesGigs, hasSavedGigs, hasVisibleGigs }) => {
    const { savedMapPin, defaultMapPin } = hasSeriesGigs ? stkTheme : theme;
    const iconUrl = hasSavedGigs ? savedMapPin : defaultMapPin;
    const className = hasVisibleGigs ? "" : "grayscale opacity-60";
    return new Icon({
      iconUrl,
      className,
      iconSize: [45, 45],
    });
  };
  return (
    <>
      {venues.map((venue, index) => {
        const latitude = parseFloat(venue.latitude);
        const longitude = parseFloat(venue.longitude);

        //if (activeGigFilters.venues && activeGigFilters.venues.length > 0) {
        //  isVenueFiltered = activeGigFilters.venues.includes(venue.id);
        //}

        if (!isNaN(latitude) && !isNaN(longitude)) {
          const position = [latitude, longitude];

          return (
            <Marker
              key={index}
              position={position}
              icon={customIcon(venue)}
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

  useEffect(() => {
    const location = getLocationMapSettings(activeGigFilters.location);
    if (map && location) {
      const defaultPosition = location.mapCenter;
      const defaultZoom = location.zoom;
      map.setView(defaultPosition, defaultZoom, { animate: true });
    }
  }, [map, activeGigFilters.location]); // Only run when location changes

  return null;
};

const Map = () => {
  const mapRef = useRef();

  // todo : avoid hardcoded styles ?
  return (
    <MapContainer
      ref={mapRef}
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
