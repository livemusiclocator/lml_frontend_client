import { mapValues, filter, groupBy, values, flatMap } from "lodash-es";
import dayjs from "dayjs";
import { useSearchParams } from "react-router";
import { DATE_RANGES, todaysDate } from "../timeStuff";
import { useAvailableTagsAndVenues } from "./api";

const dateParamsToSearchParams = ({ customDate, dateRange }) => {
  if (customDate) {
    return {
      dateRange: "customDate",
      customDate: customDate.format("YYYY-MM-DD"),
    };
  }
  return { dateRange };
};

const venuesToSearchParams = ({ venues }) => {
  if (venues && venues.length > 0) {
    return { venues: venues.map(({ id }) => id) };
  }
};

/**
 * Simple kind of wrapper around the search/query string params to supply the active gig filters (dates and tags)
 * */
export const useActiveGigFilters = () => {
  let [params, setSearchParams] = useSearchParams();
  const activeGigFilters = {
    ...searchParamsToTagFilters(params),
    ...searchParamsToDateFilters(params),
    ...searchParamsToVenuesFilters(params),
  };

  const setActiveGigFilters = (gigFilters) => {
    const newParams = {
      ...tagsToSearchParams(gigFilters),
      ...dateParamsToSearchParams(gigFilters),
      ...venuesToSearchParams(gigFilters),
    };
    setSearchParams(newParams);
  };
  return [
    activeGigFilters,
    setActiveGigFilters,
  ];
};
// todo: gross - clean this up jen
const tagsToSearchParams = ({ tags }) =>
  tags &&
  tags.length > 0 && {
    tags: tags.map(({ id }) => id),
  };

const searchParamsToTagFilters = (params) => {
  return { tags: params.getAll("tags") };
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
    dateRange: dateRange || "today",
  };
};

const searchParamsToVenuesFilters = (params) => {
  return {
    venues: params.getAll("venues"),
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
      venues: selectedVenues = [],
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
  // todo: this is a circular dep on api.js - not actually but in terms of the files
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
    return { ...category, values: (allTagsByCategory[category.id] || []).sort((a, b) => b.count - a.count) };
  }).filter((category) => category.values.length > 0);

  return {
    dateRanges,
    tagCategories,
    allVenues: allVenues.sort((a, b) => b.count - a.count).map(({ id, ...venue }) => ({
      ...venue,
      id,
      selected: selectedVenues.includes(id),
    })),
    customDate,
  };
};

export const useActiveGigFilterOptions = () => {
  const { dateRanges, tagCategories, allVenues } = useGigFilterOptions();

  return [
    ...filter(values(dateRanges), "selected"),
    ...filter(flatMap(tagCategories, "values"), "selected"),
    ...filter(allVenues, "selected"),
  ];
};
