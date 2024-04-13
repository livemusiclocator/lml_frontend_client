import { useEffect, useState } from "react";
import Map from "../Map";
import { getLocation } from "../../getLocation";
import LoadingOverlay from "./LoadingOverlay";

const loadData = async (date) => {
  const response = await fetch(
    `https://lml.live/gigs/query?location=${getLocation()}&date_from=${date}&date_to=${date}`
  );
  return response.json();
};

export default function MapLoader({ date, gigs, setGigs }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadData(date).then((data) => {
      setGigs(data);
      setLoading(false);
    });
  }, [date]);

  return (
    <>
      {loading && <LoadingOverlay />}
      <Map gigs={gigs} />
    </>
  );
}
