import { mapValues, filter, groupBy, values, flatMap } from "lodash-es";
import dayjs from "dayjs";
import { useSearchParams, useNavigate, createSearchParams } from "react-router";
import { DATE_RANGES, todaysDate } from "../timeStuff";
import { useAvailableTagsAndVenues } from "./api";
import getConfig from "../config";
import { getSelectableLocations } from "../locations";

const dateParamsToSearchParams = ({ customDate, dateRange }) => {
  if (customDate) {
    return {
      dateRange: "customDate",
      customDate: customDate.format("YYYY-MM-DD"),
    };
  }
  if (dateRange) return { dateRange };
  return {};
};

const venuesToSearchParams = ({ venueIds }) => {
  if (venueIds && venueIds.length > 0) {
    return { venues: venueIds };
  }
};

const locationToSearchParams = ({ location }) => {
  const { allow_select_location, default_location } = getConfig();

  if (!allow_select_location) {
    return { location: default_location };
  }
  if (location) {
    return { location: location };
  }
  return {};
};

/**
 * Simple kind of wrapper around the search/query string params to supply the active gig filters (dates and tags)
 */
export const useActiveGigFilters = () => {
  let [params] = useSearchParams();
  const activeGigFilters = {
    ...searchParamsToTagFilters(params),
    ...searchParamsToDateFilters(params),
    ...searchParamsToVenuesFilters(params),
    ...searchParamsToLocationFilter(params),
  };
  return [activeGigFilters];
};
export const useNavigateToGigList = () => {
  let navigate = useNavigate();
  let [existingParams] = useSearchParams();
  return (gigFilters) => {
    const newParams = {
      ...Object.fromEntries(existingParams),
      ...tagsToSearchParams(gigFilters),
      ...dateParamsToSearchParams(gigFilters),
      ...venuesToSearchParams(gigFilters),
      ...locationToSearchParams(gigFilters),
    };
    const search = "?" + createSearchParams(newParams).toString();
    return navigate({ pathname: "/", search });
  };
};

/**
 * Converts tag parameters to search params format
 */
const tagsToSearchParams = ({ tags }) => {
  if (!tags) {
    return {};
  }
  const informationTags = tags
    .filter(({ category }) => category === "information")
    .map(({ value }) => value);
  const genreTags = tags
    .filter(({ category }) => category === "genres")
    .map(({ value }) => value);

  // using this style because we have to agree with rails and rails is harder to change
  return { "information[]": informationTags, "genre[]": genreTags };
};

const searchParamsToTagFilters = (params) => {
  // tags come from two different query string params- disambiguate using 'category'

  const informationTags = params
    .getAll("information[]")
    .map((tag) => `information:${tag}`);
  const genreTags = params.getAll("genre[]").map((tag) => `genre:${tag}`);
  return { tags: [...informationTags, ...genreTags] };
};

const searchParamsToDateFilters = (params) => {
  let dateRange = params.get("dateRange");
  if (dateRange == "customDate") {
    let customDate = dayjs(params.get("customDate"));
    return {
      dateRange,
      customDate: customDate.isValid() ? customDate : todaysDate(),
    };
  }
  return {
    dateRange: dateRange || "thisWeek",
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
    return { location: default_location };
  }
  return {
    location: params.get("location") || default_location,
  };
};

const FILTER_TAG_CATEGORIES = [
  {
    id: "genre",
    caption: "Genre",
  },
  {
    id: "information",
    caption: "Other",
  },
];

export const useGigFilterOptions = () => {
  const [
    {
      dateRange: selectedDateRange,
      customDate,
      tags: selectedTags = [],
      venueIds: selectedVenueIds = [],
      location: selectedLocation,
    },
  ] = useActiveGigFilters();

  const dateRanges = mapValues(DATE_RANGES, (range) => ({
    ...range,
    selected: range.id === selectedDateRange,
  }));

  if (customDate) {
    dateRanges.customDate.caption = customDate.format("L");
    dateRanges.customDate.customDate = customDate;
  }

  // API dependency for getting available filter options
  const { allTags, allVenues } = useAvailableTagsAndVenues();

  const allTagsByCategory = groupBy(
    allTags.map((tag) => ({
      ...tag,
      caption: tag.value,
      selected: selectedTags.includes(tag.id),
    })),
    "category",
  );

  const tagCategories = FILTER_TAG_CATEGORIES.map((category) => {
    return {
      ...category,
      values: (allTagsByCategory[category.id] || []).sort(
        (a, b) => b.count - a.count,
      ),
    };
  }).filter((category) => category.values.length > 0);

  const { allow_select_location } = getConfig();
  const allLocations = allow_select_location
    ? getSelectableLocations()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(({ id, ...location }) => ({
          ...location,
          id,
          selected: selectedLocation === id,
        }))
    : [];

  return {
    dateRanges,
    tagCategories,
    allLocations,
    allVenues: allVenues
      .sort((a, b) => b.count - a.count)
      .map(({ id, ...venue }) => ({
        ...venue,
        id,
        selected: selectedVenueIds.includes(id),
      })),
    customDate,
  };
};

export const useActiveGigFilterOptions = () => {
  const { dateRanges, tagCategories, allVenues, allLocations } =
    useGigFilterOptions();

  return [
    ...filter(allLocations, "selected"),
    ...filter(values(dateRanges), "selected"),
    ...filter(flatMap(tagCategories, "values"), "selected"),
    ...filter(allVenues, "selected"),
  ];
};
