import { useState,useEffect } from "react";
import Navbar from "./NavBar";
import GigsLoader from "./GigsLoader";

export default function SearchHandler() {
  const [searchParams, setSearchParams] = useState({ postcode: "", tags: [] });
  useEffect(() => {
    // just for temporary coexistance for now - not something we actually want to live
    import("../index.css");
    import("bootstrap/dist/css/bootstrap.min.css")
  }, []);

  return (
    <>
      <Navbar setSearchParams={setSearchParams} />
      <GigsLoader searchParams={searchParams} />
    </>
  );
}
