export const ALL_LOCATIONS = [
  {
    id: "anywhere",
    caption: "Anywhere",
    hideMap: true,
    selectable: true,
  },
  //adelaide:
  {
    id: "adelaide",
    caption: "Adelaide",
    mapCenter: [-34.9256018, 138.5801261],
    zoom: 15,
  },
  //brisbane:
  {
    id: "brisbane",
    caption: "Brisbane",
    mapCenter: [-27.4704072, 153.012729],
    zoom: 15,
  },
  //castlemaine:
  {
    id: "castlemaine",
    caption: "Castlemaine",
    mapCenter: [-37.063670785361964, 144.21660007885495],
    zoom: 15,
  },
  //goldfields:
  {
    caption: "Goldfields",
    id: "goldfields",
    mapCenter: [-37.063670785361964, 144.21660007885495],
    zoom: 10,
  },
  //melbourne:
  {
    caption: "Melbourne",
    id: "melbourne",
    mapCenter: [-37.80198943476701, 144.9594068527222],
    zoom: 14,
    selectable: true,
  },
  //perth:
  {
    caption: "Perth",
    id: "perth",
    mapCenter: [-31.95211262081573, 115.85813946429992],
    zoom: 15,
  },
  //sydney:
  {
    caption: "Sydney",
    id: "sydney",
    mapCenter: [-33.8695692, 151.1307609],
    zoom: 15,
  },
  //stkilda:
  {
    caption: "St Kilda",
    id: "stkilda",
    mapCenter: [-37.8642383, 144.9613908],
    zoom: 15,
    selectable: true,
  },
];
// TODO : We could make this configurable perhaps
export const getSelectableLocations = () => {
  return ALL_LOCATIONS.filter(({ selectable }) => selectable);
};

export const getLocationMapSettings = (location) => {
  return ALL_LOCATIONS.find(({ id }) => location === id);
};
