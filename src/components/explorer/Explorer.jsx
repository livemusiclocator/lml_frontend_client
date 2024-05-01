import { FilterWrapper } from "./FilterOverlay";
import { Outlet, Link, useMatches, useLocation } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import "./styles.scss";
import Map from "../Map";

export default function Explorer() {
  const [listMaximised, setListMaximised] = useState(true);
  let location = useLocation();
  const matches = useMatches();
  // todo: better way to do this with react router v6?
  let showBackButton =
    listMaximised &&
    matches.filter((match) => Boolean(match.handle?.showBackButton))[0];
  useEffect(() => {
    // reset the list maximised if we changed location
    setListMaximised(true);
  }, [location]);
  return (
    <>
      <Map />
      {/** todo: clear up the mess I've made here */}
      {/**  overlay to the map - for small screens, just use whole width for big screens (not primary usecase) max out at 2xl, but try and keep to a proportion of the screen so you get a lot of map as well */}
      <div
        className={`flex flex-col justify-end z-20 absolute bottom-0 left-0 w-full max-w-2xl p-2 *:bg-white *:overflow-scroll ${listMaximised ? "h-full" : "h-content"}`}
      >
        <FilterWrapper $listMaximised={listMaximised}>
          <nav
            className={`p-3 w-100 border border-bottom flex ${listMaximised ? "justify-between" : "justify-center"} w-full`}
          >
            <div>
              {/** todo: fix this to do a -1 on a page where it can so search is maintained */}
              {showBackButton && (
                <Link to=".">
                  <ChevronLeftIcon className="size-6" />
                </Link>
              )}
            </div>

            <div className="gig-explorer revert-tailwind" data-bs-theme="light">
              <button
                onClick={() => setListMaximised(!listMaximised)}
                id="overlay-expand-button"
                className="w-100 text-center rounded-0 btn btn-sm btn-light border-0 bg-white text-muted"
                style={{
                  marginBottom: "-10px",
                }}
              >
                {listMaximised ? (
                  <i className="bi bi-pin-map-fill"></i>
                ) : (
                  <i className="bi bi-caret-up-fill"></i>
                )}
              </button>
            </div>
          </nav>
          <Outlet context={{ listMaximised }} />
        </FilterWrapper>
      </div>
    </>
  );
}
