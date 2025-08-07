import useSWR from "swr";
import { parseSearchParams } from "../searchParams";
import getConfig from "../config";
import { useParams, useMatches, useSearchParams } from "react-router";
import {
  transformGigData,
  applyFilters,
  gigFromApiResponse,
  toFilterSummary,
} from "../model";
import { compact } from "lodash-es";

import { datesForDateRange } from "../timeStuff";

const GIGS_ENDPOINT = getConfig().gigs_endpoint;

const loadData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    error.info = await response.json();
    error.status = response.status;
    throw error;
  }
  return await response.json();
};

const buildGigsEndpoint = ({ dates: [from, to], locationId }) => {
  to = to ?? from;
  if (to && from && locationId) {
    return `${GIGS_ENDPOINT}/query?location=${locationId}&date_from=${from}&date_to=${to}`;
  }
  return null;
};

const buildSingleGigEndpoint = (id) => {
  return id ? `${GIGS_ENDPOINT}/${id}` : null;
};

const singleGigLoader = async ({ id }) => {
  const url = buildSingleGigEndpoint(id);
  return url && (await loadData(url));
};

const gigListLoader = async (requestKey) => {
  const url = buildGigsEndpoint(requestKey);
  return url && (await loadData(url));
};

// Gig list specific functions
const useGigListData = () => {
  const routeType = useCurrentRouteType();
  const [searchParams] = useSearchParams();

  const params = parseSearchParams(searchParams);
  const requestKey =
    routeType == "gigList"
      ? {
          locationId: params.locationId,
          dateRangeId: params.dateRangeId,
          dates: datesForDateRange(params.dateRangeId, params.customDate),
        }
      : null;

  const {
    data: rawResult,
    error,
    isLoading,
    isValidating,
  } = useSWR(requestKey, (requestKey) => gigListLoader(requestKey), {
    keepPreviousData: true,
    revalidateOnFocus: false, // dont refetch on focus (if you wait too long with tab open the dates will change anyway  I guess)
  });

  // could separate these two steps really (or mush them together )
  //
  const unfilteredResult =
    rawResult && !error && transformGigData(rawResult, requestKey);

  const result = unfilteredResult && applyFilters(unfilteredResult, params);

  return {
    data: result,
    isLoading,
    isValidating,
    dataLoaded: !!rawResult,
    error,
  };
};

// Single gig specific functions
const useSingleGigData = () => {
  const routeType = useCurrentRouteType();
  const routeParams = useParams();

  const requestKey = routeType == "singleGig" ? { id: routeParams.id } : null;

  const {
    data: rawResult,
    error,
    isLoading,
    isValidating,
  } = useSWR(requestKey, (requestKey) => singleGigLoader(requestKey), {
    keepPreviousData: true,
    revalidateOnFocus: false, // dont refetch on focus (will do so the next time the gig page is mounted or page refreshed)
  });

  const result = !error ? gigFromApiResponse(rawResult) : null;

  return {
    data: result,
    isLoading,
    isValidating,
    dataLoaded: !!rawResult,
    error,
  };
};

// Helper function to determine current route type
const useCurrentRouteType = () => {
  const matches = useMatches();
  const routeDatasourceType = compact(
    matches.map((match) => match.handle?.datasourceKey),
  )[0];
  return routeDatasourceType;
};

// Generic datasource hook that delegates to specific implementations
const useCurrentDatasource = (expectedType = null) => {
  const routeType = useCurrentRouteType();

  // Always call both hooks to avoid conditional hook calls
  const gigListResult = useGigListData();
  const singleGigResult = useSingleGigData();
  if (expectedType && routeType !== expectedType) {
    return {
      data: null,
      isLoading: false,
      isValidating: false,
      dataLoaded: false,
      error: null,
    };
  }

  if (routeType === "gigList") {
    return gigListResult;
  } else if (routeType === "singleGig") {
    return singleGigResult;
  }
  // return the first that is available - prioritise single gig results
  return singleGigResult || gigListResult;
};

export const useGig = () => {
  return useCurrentDatasource("singleGig");
};

export const useGigSearchResults = () => {
  return useCurrentDatasource("gigList");
};

export const useCurrentGigFilterSummary = () => {
  const { data, isLoading, dataLoaded, error } = useGigSearchResults();
  const filters = data?.filters;
  return {
    isLoading,
    dataLoaded,
    error,
    data: toFilterSummary(filters),
  };
};

export const useCurrentLocationSettings = () => {
  const { data, dataLoaded, isLoading } = useCurrentDatasource();
  // todo : should be able to deal with fallback earlier than this (or in the map itself)
  const mapSettings = data?.mapSettings || {
    mapCenter: [-37.80198943476701, 144.9594068527222],
    zoom: 14,
    caption: "Fallback",
  };
  return { data: mapSettings, isLoading, dataLoaded };
};

export const useMapVenues = () => {
  const { data, dataLoaded, isLoading } = useCurrentDatasource();
  const venues = data?.mapVenues || [];

  return { data: venues, isLoading, dataLoaded };
};
