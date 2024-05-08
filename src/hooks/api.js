import useSWR, { preload } from "swr";
import { getLocation } from "../getLocation";
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";

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
  return await response.json();
};
const gigByDayEndpoint = ({ date, location }) => {
  return `https://api.lml.live/gigs/query?location=${location}&date_from=${date}&date_to=${date}`;
};

const loadAndSort = async (url) => {
  const result = await loadData(url);
  result.sort(dateComparison);
  return result;
};
export const useGigList = () => {
  const [{ date, from, location }] = useGigFilters();
  const apiFromDate = date ? date : from;

  return useSWR(gigByDayEndpoint({ location, date: apiFromDate }), loadAndSort);
};
// temp while we get a specific single-gig loading with fallback going (see useGigWIP)
export const useGig = (id) => {
  return useSWR(`https://api.lml.live/gigs/${id}`, (key) => {
    return loadData(key);
  });
};

export const preloadData = () => {
  // load the default 'today' page before anyone asks for it as it is likely to be asked for shortly.
  preload(
    gigByDayEndpoint({
      date: dayjs().format("YYYY-MM-DD"),
      location: getLocation(),
    }),
    loadAndSort,
  );
};
