import dayjs from "dayjs";
import { createSearchParams } from "react-router";
import getConfig from "./config";
import { datesForDateRange, todaysDate } from "./timeStuff";

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
  const { allow_select_location } = getConfig();

  if (!allow_select_location || !locationId) {
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
  const { allow_select_location, default_location } = getConfig();
  if (!allow_select_location) {
    return { locationId: default_location };
  }
  return {
    locationId: params.get("location") || default_location,
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
export const parseSearchParams = (params) => {
  return {
    ...searchParamsToTagFilters(params),
    ...searchParamsToDateFilters(params),
    ...searchParamsToVenuesFilters(params),
    ...searchParamsToLocationFilter(params),
  };
};
