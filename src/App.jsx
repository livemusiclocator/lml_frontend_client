import "bootstrap-icons/font/bootstrap-icons.css";
import ReactGA from "react-ga4";
// todo:  deprecate DefaultLayout and the render_app_layout flag
import DefaultLayout from "./layouts/default";
import NoLayout from "./layouts/nolayout";
import "./index.css";
import { ThemeProvider } from "styled-components";
import { getTheme } from "./getLocation";
import { createBrowserRouter, RouterProvider } from "react-router";
import SingleGigDetails from "./components/explorer/SingleGigDetails";
import Explorer from "./components/explorer/Explorer";
import GigList from "./components/GigList";
import About from "./components/About";
import Events from "./components/Events";
import getConfig from "./config";

const APP_CONFIG = getConfig();
if (APP_CONFIG.ga_project) {
  ReactGA.initialize(APP_CONFIG.ga_project);
}

const LayoutComponent = APP_CONFIG.render_app_layout ? DefaultLayout : NoLayout;

const router = createBrowserRouter(
  [
    {
      element: <LayoutComponent />,
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
          element: <Explorer />,
          handle: {
            hello: 1,
          },
          children: [
            {
              index: true,
              element: <GigList newGigFilter={true} />,
              handle: {
                datasourceKey: "gigList",
              },
            },
            {
              path: "gigs/:id",
              element: <SingleGigDetails />,
              handle: {
                showBackButton: true,
                datasourceKey: "singleGig",
              },
            },
          ],
        },
      ],
    },
  ],
  {
    basename: getConfig().root_path,
  },
);

const App = () => {
  return (
    <ThemeProvider theme={getTheme()}>
      <RouterProvider
        router={router}
        future={{
          v7_relativeSplatPath: true,
          v7_partialHydration: true,
          v7_startTransition: true,
          v7_fetcherPersist: true,
          v7_normalizeFormMethod: true,
          v7_skipActionErrorRevalidation: true,
        }}
      />
    </ThemeProvider>
  );
};

export default App;
