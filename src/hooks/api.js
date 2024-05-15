import { useMemo, useEffect } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { sortBy, groupBy } from "lodash-es";
import { getLocation } from "../getLocation";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { daysForTimePeriod, todaysDate } from "../timeStuff";

const loadData = async (url) => {
  const response = await fetch(url);
  return await response.json();
};
const gigByDayEndpoint = ({ date, location }) => {
  return `https://api.lml.live/gigs/query?location=${location}&date_from=${date}&date_to=${date}`;
};

function parseTags(rawValues) {
  return rawValues.map((str) => {
    const parts = str.split(/:\s*/);

    if (parts.length === 2) {
      return { category: parts[0].trim(), value: parts[1].trim(), id: str };
    } else {
      return { category: "general", value: str.trim(), id: str };
    }
  });
}

const transformGigResponse = ({ tags, ...gig }) => {
  const allTags = groupBy(parseTags(tags), "category");
  return {
    ...gig,
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

export const useGigDateParams = () => {
  let [params] = useSearchParams();
  const dateRange = params.get("dateRange");

  const dates = useMemo(() => {
    const date = dayjs(params.get("date"));
    const dateRange = params.get("dateRange");
    return (
      daysForTimePeriod(dateRange) || [date.isValid() ? date : todaysDate()]
    );
  }, [params]);
  return { dateRange, dates };
};

export const useGigList = () => {
  const location = getLocation();
  const { dates } = useGigDateParams();
  const pagedDates = dates.map((d) => d.format("YYYY-MM-DD"));
  const {
    data: pages,
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

  const allPagesLoaded = pages?.length >= dates.length;
  const gigCount = pages?.map((page) => page?.gigs).flat().length;
  useEffect(() => {
    if (pages?.length >= size && size < dates.length && !isLoading) {
      setSize(size + 1);
    }
    //loadMore();
  }, [dates, size, isLoading, setSize, pages]);

  return { data: pages, isLoading, isValidating, allPagesLoaded, gigCount };
};
export const useGig = (id) => {
  return useSWR(`https://api.lml.live/gigs/${id}`, async (key) => {
    return transformGigResponse(await loadData(key));
  });
};
