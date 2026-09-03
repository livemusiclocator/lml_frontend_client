import { useState, useEffect } from "react";
import { Outlet, useLocation, useMatches } from "react-router";
import { compact } from "lodash-es";
import Map from "../Explorer/Map";
import Announcements from "../Explorer/Announcements";
import Chrome from "./Chrome";
import BottomSheet from "./BottomSheet";
import FilterDrawer from "./FilterDrawer";
import BackLink from "./BackLink";

const useRouteKind = () => {
  const matches = useMatches();
  return (
    compact(matches.map((match) => match.handle?.datasourceKey))[0] ?? "gigList"
  );
};

/**
 * The redesigned explorer, behind ?newLayout=true.
 *
 * One map for the whole layout: it fills the screen behind the gig list, and
 * shrinks to a hero strip on a gig page rather than being replaced by a
 * placeholder image. The list rides over it in a sheet you can drag.
 */
export default function ExplorerNew() {
  const routeKind = useRouteKind();
  const location = useLocation();
  const [snap, setSnap] = useState("full");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const isList = routeKind === "gigList";
  // the sheet position is the view: dragged all the way up is the list, anything
  // less means you are looking at the map
  const view = snap === "full" ? "list" : "map";

  useEffect(() => {
    setSnap("full");
    setFiltersOpen(false);
  }, [location.pathname]);

  return (
    <main className="explorer-new">
      <Announcements />

      {isList && (
        <Chrome
          view={view}
          onViewChange={(next) => setSnap(next === "map" ? "mid" : "full")}
          onOpenFilters={() => setFiltersOpen(true)}
        />
      )}

      <div className="stage">
        <div
          className={`map-pane ${routeKind === "singleGig" ? "is-hero" : "is-full"}`}
        >
          <Map />
        </div>

        {isList ? (
          <BottomSheet snap={snap} onSnapChange={setSnap}>
            <Outlet context={{ listMaximised: snap === "full" }} />
          </BottomSheet>
        ) : (
          <div
            className={`panel ${routeKind === "singleAct" ? "is-legacy-content" : ""}`}
          >
            {/* act pages are still the legacy component, so they need a back
                control of their own rather than the one a gig page draws */}
            {routeKind === "singleAct" && (
              <div className="sticky top-0 z-10 border-b border-gray-200 bg-white">
                <BackLink className="text-gray-900" />
              </div>
            )}
            <Outlet context={{ listMaximised: true }} />
          </div>
        )}
      </div>

      {filtersOpen && <FilterDrawer onClose={() => setFiltersOpen(false)} />}
    </main>
  );
}
