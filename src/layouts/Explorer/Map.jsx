import { useEffect, useState, useLayoutEffect } from "react";
import {
  Map as MapLibreMap,
  Marker,
  Popup,
  NavigationControl,
  useMap,
} from "@vis.gl/react-maplibre";
import getConfig from "@/config";
// held at maplibre-gl 5.x deliberately - see the note in the README. 6.x moved
// the tile parsing worker into a separate module it resolves at runtime from
// import.meta.url, which no bundler can see, so the worker 404s and every
// vector layer silently fails to draw. 5.x inlines the worker as a blob.
import "maplibre-gl/dist/maplibre-gl.css";
import { useNavigate } from "react-router";

import { filteredGigListPath } from "@/searchParams";

import {
  useCurrentLocationSettings,
  useMapVenues,
  useGigSearchParams,
} from "@/hooks/api";

// our config stores coordinates the way leaflet wanted them, [lat, lng], but
// maplibre takes [lng, lat] - so everything crossing that boundary goes through
// here rather than being flipped by hand at each call site
const toLngLat = ([latitude, longitude]) => [longitude, latitude];

const mapPinThemeForVenue = (venue) => {
  const {
    themes: { default: defaultTheme, series: seriesThemes },
  } = getConfig();
  const themeableSeries = venue.gigSeries?.find(
    (series) => seriesThemes[series],
  );
  return seriesThemes[themeableSeries] ?? defaultTheme;
};

const VenueMarkers = () => {
  const { data: venues } = useMapVenues();
  const { locationId } = useGigSearchParams();
  const navigate = useNavigate();
  // maplibre has no equivalent of leaflet's hover Tooltip, so the marker
  // tracks its own hover state and we render a popup for whichever one is under
  // the pointer
  const [hoveredVenue, setHoveredVenue] = useState(null);

  const handleMarkerClick = async (venue) => {
    const newVenueFilters = venue.selected ? [] : [venue.id];
    // use the venue's location attribute to filter the venues too
    await navigate(
      filteredGigListPath({ venueIds: newVenueFilters, locationId }),
    );
  };

  return (
    <>
      {venues.map((venue, index) => {
        const latitude = parseFloat(venue.latitude);
        const longitude = parseFloat(venue.longitude);

        if (isNaN(latitude) || isNaN(longitude)) {
          return null;
        }

        const { savedMapPin, defaultMapPin } = mapPinThemeForVenue(venue);
        const iconUrl = venue.hasSavedGigs ? savedMapPin : defaultMapPin;
        const dimmed = venue.showAsActive > 0 ? "" : "grayscale opacity-60";

        return (
          <Marker
            key={index}
            longitude={longitude}
            latitude={latitude}
            onClick={() => handleMarkerClick(venue)}
          >
            <img
              src={iconUrl}
              alt={venue.name}
              width={45}
              height={45}
              className={`cursor-pointer ${dimmed}`}
              onMouseEnter={() =>
                setHoveredVenue({ name: venue.name, longitude, latitude })
              }
              onMouseLeave={() => setHoveredVenue(null)}
            />
          </Marker>
        );
      })}
      {hoveredVenue && (
        <Popup
          longitude={hoveredVenue.longitude}
          latitude={hoveredVenue.latitude}
          closeButton={false}
          closeOnClick={false}
          offset={26}
        >
          {hoveredVenue.name}
        </Popup>
      )}
    </>
  );
};

// todo: map positioner could be a bit more smart - it should update the position only if it really needs to - so if i move
// the map it does not randomly wiggle it back to where it was
const MapPositioner = () => {
  const { current: map } = useMap();
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
      map.easeTo({
        center: toLngLat(currentMapSettings.mapCenter),
        zoom: currentMapSettings.zoom,
      });
    }
  }, [currentMapSettings, map]);
  if (import.meta.env.MODE == "development") {
    return (
      <div className="absolute right-0 top-0 z-400 bg-white/80 p-1 text-black">
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

// the fallback in useCurrentLocationSettings, used until the real location
// settings arrive and MapPositioner moves us
const INITIAL_VIEW = {
  longitude: 144.9594068527222,
  latitude: -37.80198943476701,
  zoom: 14,
};

const Map = () => {
  // OpenFreeMap serves this style with no key and no account. Vector tiles are
  // the whole point of the switch from leaflet: zoom is continuous and labels
  // re-render sharp at every fractional level, which raster tiles cannot do.
  return (
    <div className="map-container">
      <MapLibreMap
        initialViewState={INITIAL_VIEW}
        mapStyle="https://tiles.openfreemap.org/styles/liberty"
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-left" />
        <VenueMarkers />
        <MapPositioner />
      </MapLibreMap>
    </div>
  );
};

export default Map;
