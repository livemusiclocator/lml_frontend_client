import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MapExplorer from "./explorers/MapExplorer";
import ListExplorer from "./explorers/ListExplorer";
import { useState } from "react";
import SingleGigExplorer from "./explorers/SingleGigExplorer";

export default function GigExplorer() {
  const [date, setDate] = useState(new Date());
  const [gigs, setGigs] = useState([]);

  console.log(gigs);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MapExplorer
              date={date}
              setDate={setDate}
              gigs={gigs}
              setGigs={setGigs}
            />
          }
        />
        <Route
          path="/list"
          element={
            <ListExplorer
              date={date}
              setDate={setDate}
              gigs={gigs}
              setGigs={setGigs}
            />
          }
        ></Route>
        <Route
          path="/gigs/:id"
          element={<SingleGigExplorer gigs={gigs} />}
        ></Route>
      </Routes>
    </Router>
  );
}
