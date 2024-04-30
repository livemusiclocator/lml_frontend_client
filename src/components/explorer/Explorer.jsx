import { useEffect, useState } from "react";
import FiltersAndGigs from "./FiltersAndGigs";
import LoadingOverlay from "../loading/LoadingOverlay";
import { getLocation } from "../../getLocation";

import "./styles.scss";
import Map from "../Map";
import { useGigList } from "../../hooks/api";

export default function Explorer({ listMaximised, showSingleGig }) {
  const { data: gigs, isLoading } = useGigList();
  return (
    <>
      <Map gigs={gigs || []} />
      <FiltersAndGigs
        gigs={gigs || []}
        listMaximised={listMaximised}
        showSingleGig={showSingleGig}
        isLoading={isLoading}
      />
      {isLoading && <LoadingOverlay />}
    </>
  );
}
