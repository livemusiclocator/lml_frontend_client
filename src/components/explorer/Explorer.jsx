import { useEffect, useState } from "react";
import FiltersAndGigs from "./FiltersAndGigs";
import LoadingOverlay from "../loading/LoadingOverlay";
import { getLocation } from "../../getLocation";
import Map from "../Map";

const loadData = async (date) => {
  const response = await fetch(
    `https://lml.live/gigs/query?location=${getLocation()}&date_from=${date}&date_to=${date}`
  );
  return response.json();
};

export default function Explorer({
  date,
  setDate,
  gigs,
  setGigs,
  listMaximised,
  showSingleGig,
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadData(date).then((data) => {
      setGigs(data);
      setLoading(false);
    });
  }, [date, setGigs]);

  return (
    <>
      {loading && <LoadingOverlay />}
      <Map gigs={gigs} />
      <FiltersAndGigs
        date={date}
        setDate={setDate}
        gigs={gigs}
        listMaximised={listMaximised}
        showSingleGig={showSingleGig}
        isLoading={loading}
      />
    </>
  );
}
