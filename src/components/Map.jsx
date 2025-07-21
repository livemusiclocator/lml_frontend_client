import { useRef, useEffect, useState, useLayoutEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { useMap } from "react-leaflet/hooks";
import { Icon } from "leaflet";
import { getTheme } from "../getLocation";
import "leaflet/dist/leaflet.css";

import { useNavigateToGigList } from "../hooks/searchParams_v2";
import { stkTheme } from "../themes";
import { useCurrentLocationSettings, useMapVenues } from "../hooks/api_v2";

const VenueMarkers = () => {
  const { data: venues } = useMapVenues();

  const theme = getTheme() ?? {};
  const navigateToGigList = useNavigateToGigList();

  const handleMarkerClick = async (venue) => {
    // todo: Perhaps we should clear the tag filters here as more likely to get no results - maybe keep location and that's it
    const newVenueFilters = venue.selected ? [] : [venue.id];
    await navigateToGigList({ venueIds: newVenueFilters });
  };
  const customIcon = ({ hasSavedGigs, seriesGigCount, showAsActive }) => {
    const { savedMapPin, defaultMapPin } =
      seriesGigCount > 0 ? stkTheme : theme;
    const iconUrl = hasSavedGigs ? savedMapPin : defaultMapPin;
    const className = showAsActive > 0 ? "" : "grayscale opacity-60";
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

// todo: map positioner could be a bit more smart - it should update the position only if it really needs to - so if i move
// the map it does not randomly wiggle it back to where it was
const MapPositioner = () => {
  const map = useMap();
  const {
    data: mapSettings,
    dataLoaded,
    isLoading,
  } = useCurrentLocationSettings();
  const [currentMapSettings, setCurrentMapSettings] = useState(null);

  useEffect(() => {
    if (dataLoaded || currentMapSettings == null) {
      setCurrentMapSettings((previous) => {
        if (previous?.mapCenter.join() != mapSettings?.mapCenter.join()) {
          return mapSettings;
        }
        return previous;
      });
    }
  }, [mapSettings, dataLoaded, setCurrentMapSettings, currentMapSettings]); // Only run when location changes
  useLayoutEffect(() => {
    if (map && currentMapSettings) {
      const defaultPosition = currentMapSettings.mapCenter;
      const defaultZoom = currentMapSettings.zoom;
      map.setView(defaultPosition, defaultZoom, { animate: true });
    }
  }, [currentMapSettings, map]);
  if (import.meta.env.MODE == "development") {
    return (
      <div className="absolute right-0 top-0 z-400">
        Map centering info Location set center
        <ul>
          <li>location: {currentMapSettings?.caption}</li>
          <li>center: {currentMapSettings?.mapCenter?.join(",")}</li>
          <li>default zoom: {currentMapSettings?.defaultZoom}</li>
          <li>has loaded {dataLoaded.toString()}</li>
          <li>is loading {isLoading.toString()}</li>
        </ul>
      </div>
    );
  }
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
