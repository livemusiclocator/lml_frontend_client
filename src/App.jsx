// todo:  deprecate DefaultLayout - can just use explorer component
import DefaultLayout from "./layouts/default";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import SingleGigDetails from "./pages/GigDetails/GigDetails";
import ActDetails from "./pages/ActDetails/ActDetails";
import Explorer from "./layouts/Explorer/Explorer";
import GigList from "./pages/GigList/GigList";
import getConfig from "./config";
import { SWRConfig } from "swr";

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
              element: <GigList />,
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
            // rails serves an html page at this url too, so a cold load or a
            // shared link lands somewhere real - see Web::ActsController
            {
              path: "acts/:id",
              element: <ActDetails />,
              handle: {
                showBackButton: true,
                datasourceKey: "singleAct",
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
          if (
            typeof window !== "undefined" &&
            typeof window.gtag === "function"
          ) {
            window.gtag("event", "exception", {
              description: `api_error_${key}`,
              fatal: false,
            });
          }
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
