import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Explore from "./Explore";
import Map from "./Map";
import FetchData from "./FetchData";
import DateSlider from "./DateSlider";

export default function GigsLoader({ searchParams }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const renderExplorerOrMap = ({ gigs }) => {
    return (
      <Routes>
        <Route exact path="/" element={<Explore gigs={gigs} />} />
        <Route path="/map" element={<Map gigs={gigs} />} />
      </Routes>
    );
  };

  return (
    <>
      <DateSlider date={selectedDate} onChange={setSelectedDate} />
      <FetchData
        render={renderExplorerOrMap}
        date={selectedDate}
        searchParams={searchParams}
      />
    </>
  );
}
