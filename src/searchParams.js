import dayjs from "dayjs";
import { createSearchParams, useSearchParams } from "react-router";
import getConfig from "./config";
import { datesForDateRange, todaysDate } from "./timeStuff";
import { useFlaggedPath } from "./hooks/useNewLayout";

// todo: this file is very messy - it's basically just transform between the query string params on the filter page and
// the internal model of those params. plus a bonus hook for doinng navigation etc.

const dateParamsToSearchParams = ({ customDate, dateRangeId }) => {
  if (customDate) {
    return {
      dateRange: "customDate",
      customDate: customDate.format("YYYY-MM-DD"),
    };
  }
  if (dateRangeId) return { dateRange: dateRangeId };
  return {};
};

const venuesToSearchParams = ({ venueIds }) => {
  if (venueIds && venueIds.length > 0) {
    return { venues: venueIds };
  }
};

const locationToSearchParams = ({ locationId }) => {
  const { allowSelectLocation } = getConfig();

  if (!allowSelectLocation || !locationId) {
    return {};
  }

  return { location: locationId };
};

/**
 * Converts tag parameters to search params format
 */
const tagsToSearchParams = ({ informationTagIds = [], genreTagIds = [] }) => {
  // using this style because we have to agree with rails
  // and rails is harder to change (on this point anyway)
  return { "information[]": informationTagIds, "genre[]": genreTagIds };
};

const searchParamsToTagFilters = (params) => {
  return {
    informationTagIds: params.getAll("information[]"),
    genreTagIds: params.getAll("genre[]"),
  };
};

// todo: this bit adds in defaults - make this more obvious
const searchParamsToDateFilters = (params) => {
  let dateRangeId = params.get("dateRange") || "thisWeek";
  let customDate = null;
  if (dateRangeId == "customDate") {
    const parsedCustomDate = dayjs(params.get("customDate"));
    customDate = parsedCustomDate.isValid() ? parsedCustomDate : todaysDate();
  }

  const dates = datesForDateRange(dateRangeId, customDate);
  return {
    dateRangeId: dateRangeId,
    dates,
    customDate,
  };
};

const searchParamsToVenuesFilters = (params) => {
  return {
    venueIds: params.getAll("venues"),
  };
};

const searchParamsToLocationFilter = (params) => {
  const { allowSelectLocation, defaultLocation } = getConfig();
  if (!allowSelectLocation) {
    return { locationId: defaultLocation };
  }
  return {
    locationId: params.get("location") || defaultLocation,
  };
};

export const filteredGigListPath = (gigFilters = {}) => {
  const newParams = {
    ...tagsToSearchParams(gigFilters),
    ...dateParamsToSearchParams(gigFilters),
    ...venuesToSearchParams(gigFilters),
    ...locationToSearchParams(gigFilters),
  };
  const search = "?" + createSearchParams(newParams).toString();
  return { pathname: "/", search };
};
/**
 * The way to build a link to the filtered gig list from inside a component.
 *
 * filteredGigListPath builds the whole query string from what it is handed, so
 * calling it directly silently drops the city and the date range you are
 * looking at, and the new layout flag with them. This keeps all three and lets
 * the caller replace just the filter it means to.
 *
 * Content filters - venues, genres, information tags - deliberately do not
 * carry over: tapping a genre means "gigs of this genre", not "this genre on
 * top of everything else already on".
 */
export const useFilteredGigListPath = () => {
  const [searchParams] = useSearchParams();
  const flaggedPath = useFlaggedPath();
  const { locationId, dateRangeId, customDate } =
    parseSearchParams(searchParams);

  return (gigFilters = {}) => {
    // only carry forward what is actually in the url, so the links these build
    // stay as short as they are today rather than spelling out every default
    const scope = {};
    if (searchParams.get("location")) {
      scope.locationId = locationId;
    }
    if (searchParams.get("dateRange")) {
      scope.dateRangeId = dateRangeId;
      scope.customDate = customDate;
    }
    return flaggedPath(filteredGigListPath({ ...scope, ...gigFilters }));
  };
};

export const parseSearchParams = (params) => {
  return {
    ...searchParamsToTagFilters(params),
    ...searchParamsToDateFilters(params),
    ...searchParamsToVenuesFilters(params),
    ...searchParamsToLocationFilter(params),
  };
};
