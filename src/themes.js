// resolves the image 'names' relative to the assets dir to cope with non root level deploys (e.g. /lml or /whatever)
const getImageUrl = (name) => {
  return new URL(`./assets/${name}`, import.meta.url);
};

const makeTheme = ({
  defaultMapPin,
  savedMapPin,
  brandMark,
  ...otherProps
}) => {
  return {
    defaultMapPin: getImageUrl(defaultMapPin),
    savedMapPin: getImageUrl(savedMapPin),
    brandmark: getImageUrl(brandMark),
    ...otherProps,
  };
};

export const lmlTheme = makeTheme({
  defaultMapPin: "lml-marker-pink-midnite-outline.png",
  savedMapPin: "lml-marker-pink-saved.png",
  brandmark: "lml-brandmark.svg",
  title: "Live Music Locator",
});

export const stkTheme = makeTheme({
  defaultMapPin: "stk.png",
  savedMapPin: "stk-fav.png",
  brandmark: "lml-brandmark.svg",
  title: "Live Music Locator",
});
