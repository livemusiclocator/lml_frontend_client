import "bootstrap-icons/font/bootstrap-icons.css";
import ReactGA from "react-ga4";
import DefaultLayout from "./layouts/default";
// does this just happen automatically?
import "./index.css";
import { ThemeProvider } from "styled-components";
import { getTheme } from "./getLocation";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SingleGigDetails from "./components/explorer/SingleGigDetails";
import Explorer from "./components/explorer/Explorer";
import GigList from "./components/GigList";
import About from "./components/About";
import Events from "./components/Events";
ReactGA.initialize("G-T8T6NBQH36");

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        path: "about",
        element: <About />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        // work in progress
        path: "alt",
        children: [
          { index: true, element: <GigList /> },
          {
            path: "gigs/:id",
            element: <SingleGigDetails />,
          },
        ],
      },
      {
        element: <Explorer />,
        children: [
          { index: true, element: <GigList newGigFilter={true} /> },
          {
            path: "gigs/:id",
            element: <SingleGigDetails />,
            handle: { showBackButton: true },
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <ThemeProvider theme={getTheme()}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
