import { useMemo } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";

import { getLocation } from "../getLocation";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
import { daysForTimePeriod, todaysDate } from "../timeStuff";

// todo: Tidy up all of the uses of date and strings here
// todo: separate out 'api' and 'client routing' concerns !

const getQuerySafeDate = (date) => {
  // assume a string is already ok. this may backfire.
  if (typeof date === "string") {
    return date;
  }
  return date?.format("YYYY-MM-DD");
};

export const useGigFilters = () => {
  let [params, setSearchParams] = useSearchParams();
  // todo: cannot set a dateRange this way.
  const setGigFilters = ({ date }) => {
    if (date) {
      setSearchParams({ date: getQuerySafeDate(date) });
    }
  };
  const date = dayjs(params.get("date"));
  const dateRange = params.get("dateRange");

  const dates = daysForTimePeriod(dateRange) || [
    date.isValid() ? date : todaysDate(),
  ];

  return [
    {
      dates,
      dateRange,
      location: getLocation(),
    },
    setGigFilters,
  ];
};

//todo: not this
const dateComparison = (
  { date: date1, start_time: start1 },
  { date: date2, start_time: start2 },
) => {
  return (start1 || date1 || "").localeCompare(start2 || date2 || "");
};
const loadData = async (url) => {
  const response = await fetch(url);
  return await response.json();
};
const gigByDayEndpoint = ({ date, location }) => {
  return `https://api.lml.live/gigs/query?location=${location}&date_from=${date}&date_to=${date}`;
};

const loadAndSort = async ({ date, location }) => {
  const url = gigByDayEndpoint({ date, location });
  const result = await loadData(url);
  result.sort(dateComparison);
  return result;
};
export const useGigList = () => {
  let [params] = useSearchParams();
  const dateRange = params.get("dateRange");

  const dates = useMemo(() => {
    const date = dayjs(params.get("date"));
    const dateRange = params.get("dateRange");
    return (
      daysForTimePeriod(dateRange) || [date.isValid() ? date : todaysDate()]
    );
  }, [params]);

  const location = getLocation();
  const pagedDates = dates.map((d) => d.format("YYYY-MM-DD"));
  // note: isValidating and the other returns from useSWR and friends useful?
  const { data: pages, isLoading } = useSWRInfinite(
    (index) => {
      if (index >= pagedDates.length) {
        return null;
      }
      return { location, date: pagedDates[index], dateRange };
    },
    loadAndSort,
    { initialSize: 7 },
  );
  return { data: pages?.flat(), isLoading };
};
export const useGig = (id) => {
  return useSWR(`https://api.lml.live/gigs/${id}`, (key) => {
    return loadData(key);
  });
};
