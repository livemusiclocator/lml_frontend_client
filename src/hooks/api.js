import { useEffect } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { getLocation } from "../getLocation";
import { useActiveGigFilters } from "./filters";

import {
  pageFromApiResponse,
  gigFromApiResponse,
  filterPagesByTags,
} from "../model";
import { datesForDateRange } from "../timeStuff";

const loadData = async (url) => {
  const response = await fetch(url);
  return await response.json();
};
const gigByDayEndpoint = ({ date, location }) => {
  return `https://api.lml.live/gigs/query?location=${location}&date_from=${date}&date_to=${date}`;
};

const loadGigsPage = async ({ date, location }) => {
  const url = gigByDayEndpoint({ date, location });
  const response = await loadData(url);
  return pageFromApiResponse(response, { date, location });
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
    loadGigsPage,
    { initialSize: 1, revalidateFirstPage: false },
  );
  const allPagesLoaded = pagesUnfiltered?.length >= dates.length;
  useEffect(() => {
    if (pagesUnfiltered?.length >= size && size < dates.length && !isLoading) {
      setSize(size + 1);
    }
  }, [dates, size, isLoading, setSize, pagesUnfiltered]);

  const pages = filterPagesByTags(pagesUnfiltered, tags);
  const gigCount = pages?.flatMap((page) => page?.gigs).length;

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
    return gigFromApiResponse(await loadData(key));
  });
};
