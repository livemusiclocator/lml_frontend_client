import ReactGA from "react-ga4";
// todo:  deprecate DefaultLayout - can just use explorer component
import DefaultLayout from "./layouts/default";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import SingleGigDetails from "./pages/GigDetails/GigDetails";
import Explorer from "./layouts/Explorer/Explorer";
import GigList from "./pages/GigList/GigList";
import getConfig from "./config";
import { SWRConfig } from "swr";
const APP_CONFIG = getConfig();
if (APP_CONFIG.gaProject && !APP_CONFIG.disableAnalytics) {
  ReactGA.initialize(APP_CONFIG.gaProject);
}

const router = createBrowserRouter(
  [
    {
      element: <DefaultLayout />,
      children: [
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
    basename: getConfig().rootPath,
  },
);

const App = () => {
  return (
    <SWRConfig
      value={{
        onError: (error, key) => {
          ReactGA.event({
            category: "api",
            action: "fetch",
            value: key, // optional, must be a number
            transport: "xhr", // optional, beacon/xhr/image
          });
        },
      }}
    >
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
    </SWRConfig>
  );
};

export default App;
