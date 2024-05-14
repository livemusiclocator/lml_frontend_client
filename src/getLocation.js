import { lbmfTheme, lmlTheme } from "./themes";

const locations = {
  adelaide: {
    mapCenter: [-34.9256018, 138.5801261],
    theme: lmlTheme,
  },
  brisbane: {
    mapCenter: [-27.4704072, 153.012729],
    theme: lmlTheme,
  },
  melbourne: {
    mapCenter: [-37.798375850534065, 144.97863448586907],
    theme: lmlTheme,
  },
  perth: {
    mapCenter: [-31.95211262081573, 115.85813946429992],
    theme: lmlTheme,
  },
  sydney: {
    mapCenter: [-33.8695692, 151.1307609],
    theme: lmlTheme,
  },
  lbmf: {
    mapCenter: [-37.798375850534065, 144.97863448586907],
    theme: lbmfTheme,
  },
};

export const getLocation = () => {
  const location = window.location.host.split(".")[0];
  return locations[location] ? location : "melbourne";
};

export const getMapCenter = () => {
  return locations[getLocation()].mapCenter;
};

export const getTheme = () => {
  return locations[getLocation()].theme;
};
