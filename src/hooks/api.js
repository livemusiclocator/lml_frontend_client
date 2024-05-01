import useSWR from "swr";
import { getLocation } from "../getLocation";

import { useSearchParams } from "react-router-dom";
// tODO: Tidy up all of the uses of date and strings here
const getQuerySafeDate = (date) => {
  //const dateStr = date.toISOString();
  // todo: make backend read our timezone formatted string somehow. for now do this hack
  const year = date.toLocaleString("default", { year: "numeric" });
  var month = date.toLocaleString("default", { month: "2-digit" });
  var day = date.toLocaleString("default", { day: "2-digit" });
  return [year, month, day].join("-");
};

// date library needed perhaps?
const addDays = (from, days) => {
  var date = new Date(from.valueOf());
  date.setDate(date.getDate() + days);
  return getQuerySafeDate(date);
};

export const useGigFilters = () => {
  let [params, setSearchParams] = useSearchParams();
  const setGigFilters = ({ date }) => {
    setSearchParams({ date: getQuerySafeDate(date) });
  };
  const date = params.get("date") || getQuerySafeDate(new Date());

  return [
    { date, dateParsed: new Date(date), location: getLocation() },
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
  const result = await response.json();
  result.sort(dateComparison);
  return result;
};

export const useGigList = () => {
  const [{ date, location }] = useGigFilters();
  // TEMP: add a longer window to date
  return useSWR(
    `https://api.lml.live/gigs/query?location=${location}&date_from=${date}&date_to=${addDays(date, 7)}`,
    loadData,
  );
};

// temp while we get a specific single-gig loading with fallback going (see useGigWIP)
export const useGig = (id) => {
  const { data: gigs, isLoading } = useGigList();
  return { isLoading, data: (gigs || []).find((g) => g.id === id) };
};
export const useGigWIP = (id) => {
  // todo: don't assume that the gig is on today or at least do soemthing with caching
  const { data: gigList, isLoading, isValidating } = useGigList();
  return useSWR(`https://lml.live/gigs/all/${id}`, async (key) => {
    // favour the response we already got from the gig list
    let result = null;
    if (!isLoading && !isValidating) {
      result = gigList.find((g) => g.id === id);
    }
    result = result || (await loadData(key));
    console.log(result);
    return result;
  });
};
