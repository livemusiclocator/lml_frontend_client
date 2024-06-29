import { useEffect } from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { getLocation } from "../getLocation";
import { useActiveGigFilters } from "./filters";

import {
  pageFromApiResponse,
  gigFromApiResponse,
  filterPagesByTags,
  allTagsForPages,
  allVenuesForPages,
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

export const useAvailableTagsAndVenues = () => {
  const {
    data: { allTags, allVenues },
    isLoading,
    isValidating,
    allPagesLoaded,
  } = useGigList({ applyFilters: false });

  return {
    allTags,
    allVenues,
    isLoading,
    isValidating,
    allPagesLoaded,
  };
};
export const useGigList = ({ applyFilters } = {}) => {
  const location = getLocation();
  const [{ dateRange, customDate, tags, venueId }] = useActiveGigFilters();

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

  const allTags = allTagsForPages(pagesUnfiltered);
  const allVenues = allVenuesForPages(pagesUnfiltered);
  let pages = pagesUnfiltered;

  pages = applyFilters
    ? filterPagesByTags(pagesUnfiltered, allTags, tags)
    : pagesUnfiltered;
  const gigCount = pages?.flatMap((page) => page?.gigs).length;

  if (applyFilters && venueId) {
    pages = pages?.map((page) => ({
      ...page,
      gigs: page.gigs.filter((gig) => gig.venue.id === venueId),
    }));
  }

  return {
    data: { pages, allTags, allVenues },
    isLoading,
    isValidating,
    allPagesLoaded,
    gigCount,
    dateRange,
    customDate,
  };
};

export const useGig = (id) => {
  return useSWR(`https://api.lml.live/gigs/${id}`, async (key) => {
    return gigFromApiResponse(await loadData(key));
  });
};
