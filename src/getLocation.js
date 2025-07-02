import { lmlTheme } from "./themes";
import getConfig from "./config";

// these should be deprecated once we move front end to rails
const edition_locations = {
  adelaide: {
    mapCenter: [-34.9256018, 138.5801261],
    zoom: 15,
    theme: lmlTheme,
  },
  brisbane: {
    mapCenter: [-27.4704072, 153.012729],
    zoom: 15,
    theme: lmlTheme,
  },
  castlemaine: {
    mapCenter: [-37.063670785361964, 144.21660007885495],
    zoom: 15,
    theme: lmlTheme,
  },
  goldfields: {
    mapCenter: [-37.063670785361964, 144.21660007885495],
    zoom: 10,
    theme: lmlTheme,
  },
  melbourne: {
    mapCenter: [-37.798375850534065, 144.97863448586907],
    zoom: 15,
    theme: lmlTheme,
  },
  perth: {
    mapCenter: [-31.95211262081573, 115.85813946429992],
    zoom: 15,
    theme: lmlTheme,
  },
  sydney: {
    mapCenter: [-33.8695692, 151.1307609],
    zoom: 15,
    theme: lmlTheme,
  },
  stkilda: {
    mapCenter: [-37.8642383, 144.9613908],
    zoom: 15,
    theme: lmlTheme,
    heading: `Live Music Locator is a pilot service that helps you discover all live music events in the St Kilda Live Music Precinct.`,
    partners: `Live Music Locator is a not-for-profit charity, partnering with the
      City of Port Phillip, as well as the Acland Street Village Business
      Association and the Fitzroy St Business Association to support local
      music and local venues.`,
  },
};

// Old way of doing it - using the first part of the hostname
const getLocationKeyFromHost = () => window.location.host.split(".")[0];

// New way of doing it - vite env var
const getLocationKeyFromViteEnv = () => import.meta.env.VITE_LML_LOCATION;

// New new way of doing it - app config
const getLocationKeyFromAppConfig = () => getConfig().default_location;

const getLocationKeyWithFallback = () =>
  getLocationKeyFromAppConfig() ??
  getLocationKeyFromViteEnv() ??
  getLocationKeyFromHost();

//  deprecatd: use locations in combo with config
export const getLocation = () => {
  const location = getLocationKeyWithFallback();
  return edition_locations[location] ? location : "melbourne";
};
export const getHeading = () => {
  return (
    edition_locations[getLocation()].heading ||
    "Live Music Locator is a free service that helps you discover live music events."
  );
};

export const getPartners = () => {
  return (
    edition_locations[getLocation()].partners ||
    "Live Music Locator is a not-for-profit registered charity, formed to support local music and local venues."
  );
};

//  deprecatd: use locations.js
export const getMapCenter = () => {
  return edition_locations[getLocation()].mapCenter;
};

export const getZoom = () => {
  return edition_locations[getLocation()].zoom;
};

//  deprecatd - everyone appears to be using the same theme !
export const getTheme = () => {
  return edition_locations[getLocation()].theme;
};
