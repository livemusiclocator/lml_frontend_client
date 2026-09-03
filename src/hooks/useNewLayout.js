import { useSearchParams, createSearchParams } from "react-router";

// The redesigned explorer lives behind this flag. Explorer.jsx already forked on
// it before there was anything on the other side of the fork.
export const NEW_LAYOUT_PARAM = "newLayout";

export const useNewLayout = () => {
  const [searchParams] = useSearchParams();
  return searchParams.get(NEW_LAYOUT_PARAM) === "true";
};

const withFlag = (search) => {
  const params = createSearchParams(search || "");
  params.set(NEW_LAYOUT_PARAM, "true");
  return `?${params.toString()}`;
};

/**
 * Every internal link has to carry the flag with it, or the first tap out of the
 * list drops you back into the legacy explorer. Takes what <Link to> takes - a
 * string, a {pathname, search} object, or a delta like -1 for going back - and
 * returns it unchanged when the flag is off.
 */
export const useFlaggedPath = () => {
  const enabled = useNewLayout();

  return (to) => {
    if (!enabled || to == null) {
      return to;
    }
    if (typeof to === "string") {
      const [pathname, search] = to.split("?");
      return { pathname, search: withFlag(search) };
    }
    // a navigation delta, not a path
    if (typeof to !== "object") {
      return to;
    }
    return { ...to, search: withFlag(to.search) };
  };
};
