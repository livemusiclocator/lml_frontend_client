import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Explorer from "./explorer/Explorer";

export default function GigExplorer() {
  const [date, setDate] = useState(new Date());
  const [gigs, setGigs] = useState([]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Explorer
              date={date}
              setDate={setDate}
              gigs={gigs}
              setGigs={setGigs}
              listSize="normal"
            />
          }
        />
        <Route
          path="/list"
          element={
            <Explorer
              date={date}
              setDate={setDate}
              gigs={gigs}
              setGigs={setGigs}
              listSize="maximised"
            />
          }
        />
        <Route
          path="/map"
          element={
            <Explorer
              date={date}
              setDate={setDate}
              gigs={gigs}
              setGigs={setGigs}
              listSize="minimised"
            />
          }
        />
        <Route
          path="/gigs/:id"
          element={
            <Explorer
              date={date}
              setDate={setDate}
              gigs={gigs}
              setGigs={setGigs}
              listSize="maximised"
              showSingleGig={true}
            />
          }
        ></Route>
      </Routes>
    </Router>
  );
}
