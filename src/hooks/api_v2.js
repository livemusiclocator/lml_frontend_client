import useSWR from "swr";
import { parseSearchParams } from "./searchParams_v2";
import getConfig from "../config";
import { useParams, useMatches, useSearchParams } from "react-router";
import {
  transformGigData,
  applyFilters,
  gigFromApiResponse,
  toFilterSummary,
} from "../model_v2";
import { compact } from "lodash-es";

import { datesForDateRange } from "../timeStuff";

const GIGS_ENDPOINT = getConfig().gigs_endpoint;

const loadData = async (url) => {
  const response = await fetch(url);
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
  const rawResult = url && (await loadData(url));
  return transformGigData(rawResult, requestKey);
};

const DATASOURCES = [
  {
    datasourceType: "gigList",
    findParams: ({ searchParams }) => parseSearchParams(searchParams),
    loader: gigListLoader,
    transformer: applyFilters,
    makeRequestKey: ({ locationId, dateRangeId, customDate }) => ({
      locationId: locationId,
      dateRangeId: dateRangeId,
      dates: datesForDateRange(dateRangeId, customDate),
    }),
  },
  {
    datasourceType: "singleGig",
    paramKeyMappings: { id: "id" },
    findParams: ({ routeParams }) => ({ id: routeParams["id"] }),
    loader: singleGigLoader,
    transformer: gigFromApiResponse,
    makeRequestKey: ({ id }) => ({ id }),
  },
];

const useCurrentDatasourceType = (expectedType) => {
  // this might get a bit expensive ? - and could be cached based on the matches values
  const matches = useMatches();
  // assume that we just use first one we find
  const routeDatasourceType = compact(
    matches.map((match) => match.handle?.datasourceKey),
  )[0];
  if (!expectedType || routeDatasourceType === expectedType) {
    return DATASOURCES.find(
      ({ datasourceType }) => datasourceType == routeDatasourceType,
    );
  }
};

const useCurrentDatasource = (expectedType = null) => {
  const datasource = useCurrentDatasourceType(expectedType) || {};
  const {
    findParams,
    loader,
    transformer = () => null,
    makeRequestKey = () => null,
  } = datasource;
  const routeParams = useParams();
  const [searchParams] = useSearchParams();

  const params = findParams && findParams({ searchParams, routeParams });
  const requestKey = makeRequestKey(params);
  const {
    data: rawResult,
    error,
    isLoading,
    isValidating,
  } = useSWR(requestKey, (requestKey) => {
    return loader && loader(requestKey);
  });
  const result = !error ? transformer(rawResult, params) : null;
  return {
    data: result,
    isLoading,
    isValidating,
    dataLoaded: !!rawResult,
    error,
  };
};
export const useGig = () => {
  return useCurrentDatasource("singleGig");
};

export const useGigSearchResults = () => {
  return useCurrentDatasource("gigList");
};

export const useCurrentGigFilterSummary = () => {
  const {
    data: { filters },
    isLoading,
    dataLoaded,
  } = useGigSearchResults();

  return {
    isLoading,
    dataLoaded,

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
