import { useState } from "react";
import Navbar from "./NavBar";
import GigsLoader from "./GigsLoader";

export default function SearchHandler() {
  const [searchParams, setSearchParams] = useState({ postcode: "", tags: [] });

  return (
    <>
      <Navbar setSearchParams={setSearchParams} />
      <GigsLoader searchParams={searchParams} />
    </>
  );
}
