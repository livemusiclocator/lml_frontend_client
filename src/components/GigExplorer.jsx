import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Explorer from "./explorer/Explorer";

// todo: hoist route config up to main.jsx as per v6 config guidelines
// - new routing stuff does not play nice with hooks so likely need to make the dates come from the route params
// and the gigs be useContexted or whatever is cool now
export default function GigExplorer({LayoutComponent}) {

  const [date, setDate] = useState(new Date());
  const [gigs, setGigs] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LayoutComponent/>}>
        <Route
          index
          element={
            <Explorer
              date={date}
              setDate={setDate}
              gigs={gigs}
              setGigs={setGigs}
              listMaximised
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
              listMaximised={false}
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
              listMaximised
              showSingleGig={true}
            />
          }
        ></Route>
    </Route>
      </Routes>
    </Router>
  );
}
