const STANDALONE_CONFIG = {
  root_path: import.meta.env.VITE_LML_ROOT_PATH || "/",
  gaProject: "GT-WRFXTBL7",
};

export default () => {
  return { ...STANDALONE_CONFIG, ...window.APP_CONFIG };
};
