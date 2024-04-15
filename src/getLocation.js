const locations = {
  adelaide: {
    mapCenter: [-34.9256018, 138.5801261],
  },
  brisbane: {
    mapCenter: [-27.4704072, 153.012729],
  },
  melbourne: {
    mapCenter: [-37.840935, 144.946457],
  },
  perth: {
    mapCenter: [-31.95211262081573, 115.85813946429992],
  },
  sydney: {
    mapCenter: [-33.8695692, 151.1307609],
  },
  lbmf: {
    mapCenter: [-37.798515, 144.9760145],
  },
};

export const getLocation = () => {
  const location = window.location.host.split(".")[0];
  return locations[location] ? location : "melbourne";
};

export const getMapCenter = () => {
  return locations[getLocation()].mapCenter;
};

export const getDefaultRoute = () => {
  return locations[getLocation()].defaultRoute;
};
