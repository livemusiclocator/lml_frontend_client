import { useState } from "react";
import GigFilter from "./GigFilter";
import { Link } from "react-router-dom";
import { FilterWrapper } from "./MapFilter";
import GigsList from "./GigsList";
import ListLoader from "../loader/ListLoader";

export default function ListExplorer({ date, setDate, gigs, setGigs }) {
  return (
    <FilterWrapper expanded={true}>
      <Link
        to="/"
        className="btn btn-sm btn-light w-100 text-center border-bottom"
      >
        Close
      </Link>
      <div className="p-3 w-100 border-bottom">
        <GigFilter date={date} setDate={setDate} />
      </div>
      <ListLoader gigs={gigs} setGigs={setGigs} date={date} />
    </FilterWrapper>
  );
}
