import { lbmfTheme, lmlTheme } from "./themes";

const locations = {
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
    mapCenter: [-37.87047572959667, 144.9841046470599],
    zoom: 15,
    theme: lmlTheme,
  },
};

export const getLocation = () => {
  const location = window.location.host.split(".")[0];
  return locations[location] ? location : "melbourne";
};

export const getMapCenter = () => {
  return locations[getLocation()].mapCenter;
};

export const getZoom = () => {
  return locations[getLocation()].zoom;
};

export const getTheme = () => {
  return locations[getLocation()].theme;
};
