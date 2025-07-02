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
  ga_project: "GT-WRFXTBL7",
  render_app_layout: true,
  default_location: getLocationKeyFromViteEnv() ?? getLocationKeyFromHost(),
};
export default () => {
  return { ...STANDALONE_CONFIG, ...window.APP_CONFIG };
};
