import { useEffect, useState, useLayoutEffect } from "react";
import {
  Map as MapLibreMap,
  Marker,
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
            // the pin art is a teardrop whose point is at the bottom, so the
            // point belongs on the coordinate. leaflet centred it, which put
            // the tip about 22px below the venue it was pointing at
            anchor="bottom"
            onClick={() => handleMarkerClick(venue)}
          >
            <div className="group relative">
              <img
                src={iconUrl}
                alt={venue.name}
                width={45}
                height={45}
                className={`cursor-pointer ${dimmed}`}
              />
              {/* a Popup here would flicker: it opens over the pin, so the
                  pointer leaves the pin, which closes it, which puts the
                  pointer back on the pin. this label lives inside the marker
                  and is pure css, so there is no state to race, and
                  pointer-events-none stops it ever taking the pointer from the
                  pin underneath. note tailwind gates group-hover behind
                  @media (hover: hover), so this is desktop only - on touch,
                  tapping a pin filters the list instead */}
              <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-white/95 px-2 py-1 text-xs font-medium text-gray-900 shadow-md group-hover:block">
                {venue.name}
              </span>
            </div>
          </Marker>
        );
      })}
    </>
  );
};

// the liberty style labels pubs, bars and restaurants itself, a few metres off
// from our own coordinates, so the same place shows up twice and reads as a data
// error. we own this style, so those layers can just be switched off - the same
// thing on google needs cloud styling attached to a billable map id.
//
// transit poi are deliberately kept: they help someone work out how to get to a
// gig, and they do not duplicate anything we draw.
const hideBasemapVenuePoi = (map) => {
  for (const layer of map.getStyle()?.layers ?? []) {
    if (layer["source-layer"] === "poi" && layer.id !== "poi_transit") {
      map.setLayoutProperty(layer.id, "visibility", "none");
    }
  }
};

const BasemapPoiSuppressor = () => {
  const { current: mapRef } = useMap();
  useEffect(() => {
    if (!mapRef) return;
    const map = mapRef.getMap();
    // the style may not have arrived yet, and can be swapped later on
    if (map.isStyleLoaded()) hideBasemapVenuePoi(map);
    const onStyleLoad = () => hideBasemapVenuePoi(map);
    map.on("style.load", onStyleLoad);
    return () => map.off("style.load", onStyleLoad);
  }, [mapRef]);
  return null;
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
        <BasemapPoiSuppressor />
        <MapPositioner />
      </MapLibreMap>
    </div>
  );
};

export default Map;
