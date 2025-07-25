// Old way of doing it - using the first part of the hostname
const getLocationKeyFromHost = () => {
  const result = window.location.host.split(".")[0];
  if (result == "lml") {
    return "melbourne";
  }
};

// New way of doing it - vite env var (but really ultimately it should just be in the app_config on the page)
const getLocationKeyFromViteEnv = () => import.meta.env.VITE_LML_LOCATION;

const STANDALONE_CONFIG = {
  root_path: import.meta.env.VITE_LML_ROOT_PATH || "/",
  gigs_endpoint: "https://api.lml.live/gigs",
  ga_project: "G-8TKSCK99CN",
  render_app_layout: true,
  default_location: getLocationKeyFromViteEnv() ?? getLocationKeyFromHost(),
};
const ALL_LOCATIONS = [
  {
    id: "anywhere",
    caption: "Anywhere",
    selectable: true,
    // focus on the region we got gigs in right now by default
    mapCenter: [-37.40725549559874, 143.90167236328128],

    zoom: 9,
  },
  {
    id: "adelaide",
    caption: "Adelaide",
    mapCenter: [-34.9256018, 138.5801261],
    zoom: 15,
  },
  {
    id: "brisbane",
    caption: "Brisbane",
    mapCenter: [-27.4704072, 153.012729],
    zoom: 15,
  },
  {
    id: "castlemaine",
    caption: "Castlemaine",
    mapCenter: [-37.063670785361964, 144.21660007885495],
    zoom: 15,
  },
  {
    caption: "Goldfields",
    id: "goldfields",
    mapCenter: [-37.063670785361964, 144.21660007885495],
    zoom: 10,
  },
  {
    caption: "Melbourne",
    id: "melbourne",
    mapCenter: [-37.80198943476701, 144.9594068527222],
    zoom: 14,
    selectable: true,
  },
  {
    caption: "Perth",
    id: "perth",
    mapCenter: [-31.95211262081573, 115.85813946429992],
    zoom: 15,
  },
  {
    caption: "Sydney",
    id: "sydney",
    mapCenter: [-33.8695692, 151.1307609],
    zoom: 15,
  },
  {
    caption: "St Kilda",
    id: "stkilda",
    mapCenter: [-37.8642383, 144.9613908],
    zoom: 15,
    selectable: true,
  },
];

export default () => {
  // todo: pass in locations in settings ?
  // also use javascript upperCamel not ruby style
  return {
    ...STANDALONE_CONFIG,
    ...window.APP_CONFIG,
    allLocations: ALL_LOCATIONS,
  };
};
