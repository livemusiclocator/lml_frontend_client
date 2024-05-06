import { FilterWrapper } from "./FilterOverlay";
import {
  Outlet,
  Link,
  useMatches,
  useLocation,
  useNavigationType,
} from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import "./styles.scss";
import Map from "../Map";

export default function Explorer() {
  const [listMaximised, setListMaximised] = useState(true);
  let location = useLocation();
  const matches = useMatches();
  // todo: better way to do this with react router v6?
  const navigationType = useNavigationType();

  const showBackButton = matches.filter((match) =>
    Boolean(match.handle?.showBackButton),
  )[0];
  const backButtonLocation = navigationType === "PUSH" ? -1 : ".";

  useEffect(() => {
    // reset the list maximised if we changed location
    setListMaximised(true);
  }, [location]);
  return (
    <main className="relative z-40 flex-1">
      <Map />
      {/**  overlay to the map - for small screens, just use whole width for big screens (not primary usecase) max out at 2xl, but try and keep to a proportion of the screen so you get a lot of map as well */}
      <div
        className={`flex flex-col justify-end z-20 absolute bottom-0 left-0 w-full max-w-2xl p-2 h-full`}
      >
        <FilterWrapper $listMaximised={listMaximised}>
          <nav className={`grid grid-cols-3 items-center border-b w-full p-2`}>
            {showBackButton && (
              <div>
                <Link to={backButtonLocation}>
                  <ChevronLeftIcon className="size-6" />
                </Link>
              </div>
            )}

            <div className="col-start-2 justify-self-center ">
              <button
                onClick={() => setListMaximised(!listMaximised)}
                id="overlay-expand-button"
              >
                {/**  todo: can we replace with hero icons here? no immediate equivalents as far as i can see (bundle size might reduce then)! */}
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
    </main>
  );
}
