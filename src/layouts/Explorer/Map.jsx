import { useEffect, useState, useLayoutEffect } from "react";
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  CollisionBehavior,
  useMap,
} from "@vis.gl/react-google-maps";
import getConfig from "@/config";
import { useNavigate } from "react-router";

import { filteredGigListPath } from "@/searchParams";

import {
  useCurrentLocationSettings,
  useMapVenues,
  useGigSearchParams,
} from "@/hooks/api";

// our config stores coordinates as [lat, lng] arrays, the shape leaflet wanted.
// google wants {lat, lng} objects, so everything crossing that boundary goes
// through here rather than being converted by hand at each call site
const toLatLng = ([latitude, longitude]) => ({
  lat: latitude,
  lng: longitude,
});

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

  // google has no hover tooltip, and an InfoWindow is the wrong tool for one:
  // it opens on top of the pin, so the pointer leaves the pin, which closes it,
  // which puts the pointer back on the pin - a flicker loop. instead the label
  // lives inside the marker content and is driven entirely by css, so there is
  // no react state to race. pointer-events-none keeps it from ever taking the
  // pointer from the pin it sits above.
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
        const position = { lat: latitude, lng: longitude };

        return (
          <AdvancedMarker
            key={index}
            position={position}
            onClick={() => handleMarkerClick(venue)}
            // google draws its own poi for most of these venues, a few metres
            // off from our coordinates, so the same pub appears twice. this at
            // least suppresses google's label where it collides with our pin.
            // it does not move our pin onto google's - see the README
            collisionBehavior={CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL}
          >
            <div className="group relative">
              <img
                src={iconUrl}
                alt={venue.name}
                width={45}
                height={45}
                className={`cursor-pointer ${dimmed}`}
              />
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-white/95 px-2 py-1 text-xs font-medium text-gray-900 shadow-md group-hover:block">
                {venue.name}
              </span>
            </div>
          </AdvancedMarker>
        );
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
      map.moveCamera({
        center: toLatLng(currentMapSettings.mapCenter),
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
const INITIAL_CENTER = { lat: -37.80198943476701, lng: 144.9594068527222 };
const INITIAL_ZOOM = 14;

const Map = () => {
  const { googleMapsApiKey, googleMapsMapId } = getConfig();

  // google maps will not load at all without a key, and an unconfigured build
  // should say so rather than render an empty grey box
  if (!googleMapsApiKey) {
    return (
      <div className="map-container flex items-center justify-center bg-gray-100 p-6">
        <p className="max-w-prose text-center text-sm text-gray-700">
          No google maps api key configured. Set{" "}
          <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>.env.local</code> for
          local work, or have the hosting page pass{" "}
          <code>googleMapsApiKey</code> in <code>APP_CONFIG</code>. See the
          README.
        </p>
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={googleMapsApiKey}
      // google's default channel is "weekly", which put us on an api release
      // newer than @vis.gl/react-google-maps, and AdvancedMarker threw from
      // inside its own constructor. quarterly is the stable channel. a site
      // this small also does not want its map breaking whenever google ships a
      // weekly release, so pinning is the right default regardless.
      version="quarterly"
      // load the marker library up front, so constructing a marker cannot race
      // the library arriving
      libraries={["marker"]}
    >
      <GoogleMap
        className="map-container"
        // advanced markers only render on a map with a map id
        mapId={googleMapsMapId}
        defaultCenter={INITIAL_CENTER}
        defaultZoom={INITIAL_ZOOM}
        // greedy so a one finger drag pans, as it did under leaflet. the
        // default asks for two fingers whenever the page itself can scroll
        gestureHandling="greedy"
        // google draws its own poi for most of these venues. we cannot hide
        // them from here - the styles option is documented as unavailable
        // whenever a map id is set, and a map id is mandatory for
        // AdvancedMarker - so that needs poi styling on a real map id. this at
        // least stops a tap on google's pub opening google's own info window
        // instead of filtering the gig list
        clickableIcons={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
      >
        <VenueMarkers />
        <MapPositioner />
      </GoogleMap>
    </APIProvider>
  );
};

export default Map;
