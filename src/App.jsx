import "bootstrap-icons/font/bootstrap-icons.css";
import ReactGA from "react-ga4";
import DefaultLayout from "./layouts/default";
// does this just happen automatically?
import "./index.css";
import { ThemeProvider } from "styled-components";
import { getTheme } from "./getLocation";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SingleGigDetails from "./components/explorer/SingleGigDetails";
import FiltersAndGigs from "./components/explorer/FiltersAndGigs";
import Explorer from "./components/explorer/Explorer";

ReactGA.initialize("G-8TKSCK99CN");

// https://reactrouter.com/en/main/upgrading/v6-data

const router = createBrowserRouter([
  {
    element: <DefaultLayout />,
    children: [
      {
        // work in progress
        path: "alt",
        children: [
          { index: true, element: <FiltersAndGigs /> },
          {
            path: "gigs/:id",
            element: <SingleGigDetails />,
          },
        ],
      },
      {
        element: <Explorer />,
        children: [
          { index: true, element: <FiltersAndGigs /> },
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
