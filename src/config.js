import { mapValues, merge } from "lodash-es";

// resolves the image 'names' relative to the assets dir to cope with non root level deploys (e.g. /lml or /whatever)
const getImageUrl = (name) => {
  if (!name) {
    return null;
  }
  return new URL(`./assets/${name}`, import.meta.url);
};

// Convert {"blah": "file.svg"} to {"blah": "/assets--whatever/file.svg"}
const resolveImageAssets = (imageNames) => {
  return mapValues(imageNames, getImageUrl);
};

const resolveThemeImages = ({
  default: defaults,
  series: seriesCustomised,
}) => {
  return {
    default: resolveImageAssets(defaults),
    series: mapValues(seriesCustomised, resolveImageAssets),
  };
};

// wind back some less than useful naming conventions to use js-friendly ones
const adaptLegacyConfigKeys = (obj) => {
  const result = {};

  for (const key in obj) {
    const newKey = key.includes("_")
      ? key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
      : key;

    result[newKey] = obj[key];
  }
  return result;
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
  {
    caption: "Geelong",
    id: "geelong",
    mapCenter: [-38.12908505319935, 144.25186157226565],
    zoom: 12,
    selectable: false,
  },
];
const BASE_CONFIG = {
  rootPath: import.meta.env.VITE_LML_ROOT_PATH || "/",
  gigsEndpoint: "https://api.lml.live/gigs",
  gaProject: "G-8TKSCK99CN",
  defaultLocation: "anywhere",
  allowSelectLocation: false,
  themes: {
    default: {
      defaultMapPin: "lml-marker-pink-midnite-outline.png",
      savedMapPin: "lml-marker-pink-saved.png",
    },
    series: {}, // no map pin customisations by default for series gigs
  },
  allLocations: ALL_LOCATIONS,
};

const createAppConfig = () => {
  // todo: pass in locations in settings ?
  const merged = merge(BASE_CONFIG, adaptLegacyConfigKeys(window.APP_CONFIG));
  merged.themes = resolveThemeImages(merged.themes);
  return merged;
};

// this config is loaded once - still global mutable tho so careful...
const APP_CONFIG = createAppConfig();
export default () => {
  return APP_CONFIG;
};
