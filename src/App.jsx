import "bootstrap-icons/font/bootstrap-icons.css";
import ReactGA from "react-ga4";
import Explorer from "./components/explorer/Explorer";
import DefaultLayout from "./layouts/default";
import { useState } from "react";
// does this just happen automatically?
import "./index.css";
import { ThemeProvider } from "styled-components";
import { getTheme } from "./getLocation";
import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from "react-router-dom";
import SingleGigDetails from "./components/explorer/SingleGigDetails";

ReactGA.initialize("G-8TKSCK99CN");

// https://reactrouter.com/en/main/upgrading/v6-data
const Root = () => {
  // todo: context/provider for these?

  return (
    <Routes>
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<Explorer listMaximised />} />
        <Route path="/map" element={<Explorer listMaximised={false} />} />
        <Route path="/gigs/:id" element={<SingleGigDetails />}></Route>
      </Route>
    </Routes>
  );
};

const router = createBrowserRouter([{ path: "*", element: <Root /> }]);

const App = () => {
  return (
    <ThemeProvider theme={getTheme()}>
      <RouterProvider router={router} />;
    </ThemeProvider>
  );
};

export default App;
