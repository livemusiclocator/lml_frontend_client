const STANDALONE_CONFIG = {
  root_path: import.meta.env.VITE_LML_ROOT_PATH || "/",
  gigs_endpoint: "https://api.lml.live/gigs",
  ga_project: "GT-WRFXTBL7",
  render_app_layout: true,
};

export default () => {
  return { ...STANDALONE_CONFIG, ...window.APP_CONFIG };
};
