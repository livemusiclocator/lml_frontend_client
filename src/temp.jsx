import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import LogoIcon from "./assets/svg/lml_logo_outline.svg?react";

const Logo = () => (
  <div className="flex-shrink">
    <Link to="/map" className="flex justify-center items-center text-slate-50">
      <LogoIcon className="flex-shrink w-10" width="96" />
      <span className="mx-4 text-xl hidden md:block">Live Music Locator</span>
    </Link>
  </div>
);
const HamburgerMenu = ({ toggleMenu }) => (
  <div className="lg:hidden">
    <button onClick={toggleMenu} className="text-gray-500 focus:outline-none">
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="24"
        height="24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6 h 16 M 4 12 h 16 m -16 6 h 16"
        />
      </svg>
    </button>
  </div>
);

const NavItem = ({ to, children }) => {
  const baseStyles = "py-4 px-2 text-zinc-100";
  const setActiveLinkStyles = ({ isActive }) => {
    return isActive
      ? `${baseStyles} font-semibold`
      : `${baseStyles} font-normal transition duration-200 hover:text-zinc-300`;
  };
  return (
    <li>
      <NavLink to={to} className={setActiveLinkStyles}>
        {children}
      </NavLink>
    </li>
  );
};

const MobileMenu = ({ isMenuOpen }) => (
  <div
    className={`lg:hidden ${
      isMenuOpen ? "block" : "hidden"
    } absolute left-0 shadow-md `}
  >
    <ul className="space-y-6 bg-zinc-950 px-6 pt-4 pb-8 flex items-end flex-col">
      <NavItem to="/map">Home</NavItem>
      <NavItem to="/about">About</NavItem>
    </ul>
  </div>
);

const DesktopMenu = () => (
  <div className="hidden lg:block">
    <ul className="px-2 pt-2 pb-3 flex flex-row sm:px-3">
      <NavItem to="/map">Home</NavItem>
      <NavItem to="/about">About</NavItem>
    </ul>
  </div>
);

const SearchForm = ({ searchQuery, setSearchQuery, handleSearch }) => (
  <div className="flex-grow">
    <form onSubmit={handleSearch} className="flex flex-row max-w-lg mx-auto">
      <label
        htmlFor="default-search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
      >
        Search
      </label>
      <div className="relative flex-grow">
        {/* may want to keep this in but commented for now
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width="24" height="24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
        </div>
          */}
        <input
          type="search"
          value={searchQuery}
          id="default-search"
          onChange={(e) => setSearchQuery(e.target.value)}
          className=" min-w-24 block w-full py-2 pl-4 pr-2 text-slate-900 rounded-sm bg-slate-50 text-md focus-visible:outline focus-visible:outline-red-600"
          placeholder="Search gigs..."
        />

        <button
          type="submit"
          className="text-white h-10 px-2 absolute end-0 bottom-0 bg-red-600 hover:bg-red-500 rounded-r-sm text-lg  accent-red-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-inset focus-visible:ring-white focus-visible:ring-offset-red-600 focus-visible:outline-none"
        >
          <svg
            className="p-1 w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
            width="24"
            height="24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </button>
      </div>
    </form>
  </div>
);

const NavBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(searchQuery);
  };

  return (
    <div className="bg-neutral-800 sticky top-0">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-between items-center py-2 px-2 space-x-1">
          <HamburgerMenu toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
          <Logo />
          <SearchForm
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
          <DesktopMenu />
        </div>
      </div>
      <MobileMenu isMenuOpen={isMenuOpen} />
    </div>
  );
};
const SearchPage = () => {
  useEffect(() => {
    // just for temporary coexistance for now - not something we actually want to live - replace with static imports
    import("./new_app.css");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      {/* Other content */}
      <div className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-semibold text-gray-900">Events</h1>

          {/* Render search results or default content here */}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
