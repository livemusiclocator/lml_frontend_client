const locations = {
  adelaide: [-34.9256018, 138.5801261],
  brisbane: [-27.4704072, 153.012729],
  melbourne: [-37.840935, 144.946457],
  perth: [-31.95211262081573, 115.85813946429992],
  sydney: [-33.8695692, 151.1307609],
};

export const getLocation = () => {
  const location = window.location.host.split(".")[0];
  return locations[location] ? location : "melbourne";
};

export const getPosition = () => {
  return locations[getLocation()];
};
