import { mapValues, filter, groupBy, values, flatMap } from "lodash-es";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { DATE_RANGES, todaysDate } from "../timeStuff";
const dateParamsToSearchParams = ({ customDate, dateRange }) => {
  if (customDate) {
    return {
      dateRange: "customDate",
      customDate: customDate.format("YYYY-MM-DD"),
    };
  }
  return { dateRange };
};
/**
 * Simple kind of wrapper around the search/query string params to supply the active gig filters (dates and tags)
 * */
export const useActiveGigFilters = () => {
  let [params, setSearchParams] = useSearchParams();

  const setActiveGigFilters = (gigFilters) => {
    const newParams = {
      ...tagsToSearchParams(gigFilters),
      ...dateParamsToSearchParams(gigFilters),
    };
    setSearchParams(newParams);
  };
  return [
    {
      ...searchParamsToTagFilters(params),
      ...searchParamsToDateFilters(params),
    },
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

const tempTags = () => {
  return [
    { id: "genre:Speed Metal", value: "Speed Metal", category: "genre" },
    { id: "genre:Garage Rock", value: "Garage Rock", category: "genre" },
  ];
};
const FILTER_TAG_CATEGORIES = [
  {
    id: "genre",
    caption: "Genre",
  },
];
export const useGigFilterOptions = () => {
  const [
    { dateRange: selectedDateRange, customDate, tags: selectedTags = [] },
  ] = useActiveGigFilters();
  const dateRanges = mapValues(DATE_RANGES, (range) => ({
    ...range,
    selected: range.id === selectedDateRange,
  }));
  if (customDate) {
    dateRanges.customDate.caption = customDate.format("L");
    dateRanges.customDate.customDate = customDate;
  }
  const allTags = groupBy(
    tempTags().map((tag) => ({
      ...tag,
      caption: tag.value,
      selected: selectedTags.includes(tag.id),
    })),
    "category",
  );

  const tagCategories = FILTER_TAG_CATEGORIES.map((category) => {
    return { ...category, values: allTags[category.id] };
  });
  return {
    dateRanges,
    tagCategories,
    customDate,
  };
};

export const useActiveGigFilterOptions = () => {
  const { dateRanges, tagCategories } = useGigFilterOptions();

  // eek
  return [
    ...filter(values(dateRanges), "selected"),
    ...filter(flatMap(tagCategories, "values"), "selected"),
  ];
};
