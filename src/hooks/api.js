import { useEffect } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { sortBy, groupBy, intersectionBy } from "lodash-es";
import { getLocation } from "../getLocation";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { datesForDateRange, DATE_RANGES } from "../timeStuff";

/**
 * WARNING
 *
 * This file is the first of two epicentres of awful (the other being the new gig filters - but that is not yet live whereas this is)
 * The code in here is messy and untested... it seems to work but that is all it has going for it presently.
 * Hopefully some of this will be resovled.
 * */
const loadData = async (url) => {
  const response = await fetch(url);
  return await response.json();
};
const gigByDayEndpoint = ({ date, location }) => {
  return `https://api.lml.live/gigs/query?location=${location}&date_from=${date}&date_to=${date}`;
};

function parseTags(rawValues) {
  return rawValues?.map((str) => {
    const parts = str.split(/:\s*/);

    if (parts.length === 2) {
      const category = parts[0].trim();
      const value = parts[1].trim();
      return {
        category: parts[0].trim(),
        value: parts[1].trim(),
        id: [category, value].join(":"),
      };
    } else {
      return {
        category: "general",
        value: str.trim(),
        id: ["general", str.trim()].join(":"),
      };
    }
  });
}
const transformGigResponse = ({ tags, ...gig }) => {
  const tagsParsed = parseTags(tags);
  const allTags = groupBy(tagsParsed, "category");
  return {
    ...gig,
    tags: tagsParsed,
    genres: allTags["genre"],

    infoTags: allTags["information"],
  };
};

const loadAndSort = async ({ date, location }) => {
  const url = gigByDayEndpoint({ date, location });
  const result = (await loadData(url)).map(transformGigResponse);
  //console.log("GIGS FETCHED ", { date, location });
  return { gigs: sortBy(result, "start_time"), filters: { date, location } };
};

export const useActiveGigFilters = () => {
  let [params, setSearchParams] = useSearchParams();
  let customDate = dayjs(params.get("date"));
  const setActiveGigFilters = ({ customDate, dateRange, tags = [] }) => {
    const datePart = customDate
      ? { date: dayjs(customDate).format("YYYY-MM-DD") }
      : { dateRange };
    setSearchParams({
      ...datePart,
      tags: tags.map(({ value, category }) => [category, value].join(":")),
    });
  };

  let dateFilters;

  if (customDate.isValid()) {
    dateFilters = {
      customDate,
    };
  } else {
    dateFilters = {
      dateRange: params.get("dateRange") || "today",
    };
  }

  const tags = parseTags(params.getAll("tags"));
  return [{ ...dateFilters, tags }, setActiveGigFilters];
};

export const useGigFilterOptions = () => {
  return {
    dateRanges: DATE_RANGES,
    tags: [
      {
        category: "genre",
        caption: "Genre",
        order: 1,
        values: ["Speed Metal", "Garage Rock"],
      },
    ],
  };
};

const matchesTags = (tags, targetTags) => {
  return intersectionBy(tags, targetTags, "id").length > 0;
};
const filterPageByTags = ({ gigs, ...page }, tags) => {
  return { ...page, gigs: gigs.filter((gig) => matchesTags(gig.tags, tags)) };
};
const filterByTags = (gigPages, tags) => {
  if (tags?.length > 0) {
    return gigPages?.map((page) => filterPageByTags(page, tags));
  }
  return gigPages;
};

export const useGigList = () => {
  const location = getLocation();
  const [{ dateRange, customDate, tags }] = useActiveGigFilters();

  const dates = datesForDateRange(dateRange, customDate);
  const pagedDates = dates.map((d) => d.format("YYYY-MM-DD"));
  const {
    data: pagesUnfiltered,
    isLoading,
    isValidating,
    size,
    setSize,
  } = useSWRInfinite(
    (index) => {
      if (index >= pagedDates.length) {
        return null;
      }
      return { location, date: pagedDates[index] };
    },
    loadAndSort,
    { initialSize: 1, revalidateFirstPage: false },
  );
  const pages = filterByTags(pagesUnfiltered, tags);
  const allPagesLoaded = pages?.length >= dates.length;
  const gigCount = pages?.map((page) => page?.gigs).flat().length;
  useEffect(() => {
    if (pages?.length >= size && size < dates.length && !isLoading) {
      setSize(size + 1);
    }
    //loadMore();
  }, [dates, size, isLoading, setSize, pages]);

  return {
    data: pages,
    isLoading,
    isValidating,
    allPagesLoaded,
    gigCount,
  };
};

export const useGig = (id) => {
  return useSWR(`https://api.lml.live/gigs/${id}`, async (key) => {
    return transformGigResponse(await loadData(key));
  });
};
