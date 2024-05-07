import useSWR from "swr";
import { getLocation } from "../getLocation";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";
// tODO: Tidy up all of the uses of date and strings here
const getQuerySafeDate = (date) => {
  // assume a string is already ok. this may backfire.
  if (typeof date === "string") {
    return date;
  }
  return date?.format("YYYY-MM-DD");
  //const dateStr = date.toISOString();
  // todo: make backend read our timezone formatted string somehow. for now do this hack
};

export const useGigFilters = () => {
  let [params, setSearchParams] = useSearchParams();
  const setGigFilters = ({ date }) => {
    if (date) {
      setSearchParams({ date: getQuerySafeDate(date) });
    }
  };
  const date = params.get("date") || getQuerySafeDate(dayjs());

  return [
    {
      date,
      from: date,
      to: date,
      dateParsed: dayjs(date),
      location: getLocation(),
      magic: params.get("magic"),
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
  const result = await response.json();
  result.sort(dateComparison);
  return result;
};

export const useGigList = () => {
  const [{ date, to, from, location }] = useGigFilters();
  const apiFromDate = date ? date : from;

  // TEMP: add a longer window to date
  return useSWR(
    `https://api.lml.live/gigs/query?location=${location}&date_from=${apiFromDate}&date_to=${apiFromDate}`,
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
    return result;
  });
};
