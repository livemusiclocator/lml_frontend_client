import { useState } from "react";
import MapFilter from "./MapFilter";
import MapLoader from "../loader/MapLoader";

export default function MapExplorer({ date, setDate, gigs, setGigs }) {
  const dateString = date.toISOString().split("T")[0];

  return (
    <>
      <MapLoader date={dateString} gigs={gigs} setGigs={setGigs} />
      <MapFilter date={date} setDate={setDate} gigs={gigs} />
    </>
  );
}
