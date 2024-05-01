import { FilterWrapper } from "./FilterOverlay";
import { Outlet, Link, useMatches } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import "./styles.scss";
import Map from "../Map";

export default function Explorer() {
  const [listMaximised, setListMaximised] = useState(true);
  const matches = useMatches();
  // todo: better way to do this with react router v6?
  let showBackButton =
    listMaximised &&
    matches.filter((match) => Boolean(match.handle?.showBackButton))[0];

  return (
    <>
      <Map />
      {/**  overlay to the map - max out at 2xl, but try and keep to a proportion of the screen so you get a lot of map as well */}
      <div className="flex flex-col justify-end z-20 absolute top-0 left-0 w-2/5 h-full min-w-80 max-w-2xl p-2 *:bg-white *:overflow-scroll">
        <FilterWrapper $listMaximised={listMaximised}>
          {/** todo: clear up the mess I've made here */}
          <nav
            className={`p-3 w-100 border border-bottom flex ${listMaximised ? "justify-between" : "justify-center"} w-full`}
          >
            <div>
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
