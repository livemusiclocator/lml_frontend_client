import useSWR from "swr";
import { useActiveGigFilters } from "./filters";
import getConfig from "../config";

import {
  pageFromApiResponse,
  gigFromApiResponse,
  filterGigsByTags,
  filterGigsByVenues,
  allTagsForPage,
  allVenuesForPage,
} from "../model";
import { datesForDateRange } from "../timeStuff";

const GIGS_ENDPOINT = getConfig().gigs_endpoint;

const loadData = async (url) => {
  const response = await fetch(url);
  return await response.json();
};

const buildGigsEndpoint = ({ dates: [from, to], location }) => {
  to = to ?? from;
  return `${GIGS_ENDPOINT}/query?location=${location}&date_from=${from}&date_to=${to}`;
};

const loadGigs = async ({ dates, location }) => {
  const url = buildGigsEndpoint({ dates, location });
  const response = await loadData(url);
  return pageFromApiResponse(response, { dates, location });
};

/**
 * Hook to get all available tags and venues
 */
export const useAvailableTagsAndVenues = () => {
  const {
    data: { allTags, allVenues },
    isLoading,
    isValidating,
    dataLoaded,
  } = useGigListUnfiltered();

  return {
    allTags,
    allVenues,
    isLoading,
    isValidating,
    dataLoaded,
  };
};

const useGigListUnfiltered = () => {
  const [{ dateRange, customDate, location }] = useActiveGigFilters();

  const dates = datesForDateRange(dateRange, customDate);

  const {
    data: gigPage,
    isLoading,
    isValidating,
  } = useSWR({ location, dates }, loadGigs);

  // Early return if no data
  if (!gigPage) {
    return {
      data: {
        gigs: [],
        allTags: [],
        allVenues: [],
      },
      isLoading,
      isValidating,
      dataLoaded: false,
    };
  }

  // Calculate aggregated data from the single page
  const allTags = allTagsForPage(gigPage);
  const allVenues = allVenuesForPage(gigPage);
  return {
    data: { allTags, allVenues, gigs: gigPage.gigs },
    isLoading,
    isValidating,
    dataLoaded: true,
  };
};

export const useGigList = () => {
  const [{ tags, venueIds }] = useActiveGigFilters();

  const {
    data: { gigs, allTags, allVenues },
    isLoading,
    isValidating,
    dataLoaded,
  } = useGigListUnfiltered();
  let allGigs = gigs;
  let filteredGigs = gigs;

  // todo: make the filtering thing just set isVisible rather
  // than actually filtering list
  if (dataLoaded) {
    // Apply tag filters
    filteredGigs = filterGigsByTags(filteredGigs, allTags, tags);
    // Apply venue filters
    filteredGigs = filterGigsByVenues(filteredGigs, allVenues, venueIds);
  }
  const filteredGigIds = filteredGigs.map((gig) => gig.id);
  allGigs = allGigs.map((gig) => {
    return { ...gig, visible: filteredGigIds.includes(gig.id) };
  });

  return {
    data: {
      gigs: filteredGigs,
      allGigs,
    },
    isLoading,
    isValidating,
    dataLoaded,
    gigCount: filteredGigs.length,
  };
};

export const useGig = (id) => {
  return useSWR(`${GIGS_ENDPOINT}/${id}`, async (key) => {
    return gigFromApiResponse(await loadData(key));
  });
};
