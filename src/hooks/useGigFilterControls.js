import { useSearchParams } from "react-router";

// The query string is a contract with rails (see searchParams.js), so these are
// the names it uses, including the [] suffixes. Nothing here invents a param.
export const PARAM_FOR_FILTER_TYPE = {
  venues: "venues",
  genreTags: "genre[]",
  informationTags: "information[]",
};

/**
 * Reads and writes the gig filters as query params. Everything goes through
 * URLSearchParams built from the current search, so params this does not know
 * about - newLayout, anything rails adds later - survive every change.
 */
export const useGigFilterControls = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const update = (mutate) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next);
  };

  const setValues = (params, key, values) => {
    params.delete(key);
    values.forEach((value) => params.append(key, value));
  };

  return {
    setLocation: (id) =>
      update((params) => {
        params.set("location", id);
        // venues belong to the location you were looking at, so they cannot
        // survive a move to a different city
        params.delete("venues");
      }),

    setDateRange: (id, customDate) =>
      update((params) => {
        params.set("dateRange", id);
        if (id === "customDate" && customDate) {
          params.set("customDate", customDate);
        } else if (id !== "customDate") {
          params.delete("customDate");
        }
      }),

    toggle: (filterType, value) =>
      update((params) => {
        const key = PARAM_FOR_FILTER_TYPE[filterType];
        if (!key) return;
        const current = params.getAll(key);
        setValues(
          params,
          key,
          current.includes(value)
            ? current.filter((existing) => existing !== value)
            : [...current, value],
        );
      }),

    remove: (filterType, value) =>
      update((params) => {
        const key = PARAM_FOR_FILTER_TYPE[filterType];
        if (!key) return;
        setValues(
          params,
          key,
          params.getAll(key).filter((existing) => existing !== value),
        );
      }),

    clearAll: () =>
      update((params) => {
        Object.values(PARAM_FOR_FILTER_TYPE).forEach((key) =>
          params.delete(key),
        );
      }),
  };
};
