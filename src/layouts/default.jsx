import { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/solid'
import { NavLink, Link, Form, useSearchParams, Outlet } from "react-router-dom";
import LogoIcon from "../assets/svg/lml_logo_outline.svg?react";

const Logo = () => (
  <div className="flex-1 pl-2">
    <Link to="/" className="flex justify-start items-center text-slate-50 space-x-2 font-sans">
      <LogoIcon className="flex-shrink w-10" width="96" />
      <span className="text-xl">Live Music Locator</span>
    </Link>
  </div>
);
const HamburgerMenu = ({ toggleMenu }) => (
    <button onClick={toggleMenu} className="text-gray-500 focus:outline-none lg:hidden">
      <Bars3Icon className="h-6"/>
    </button>
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

// todo; delete or keep this - be good to have backup of the styling as it was hard to get it right!

const SearchForm = () => {
 return( <div className="flex-grow">
    <Form method="get" action="/" className="flex flex-row max-w-lg mx-auto">

    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
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
          id="default-search"
          className=" min-w-24 block w-full py-2 pl-4 pr-2 text-slate-900 rounded-sm bg-slate-50 text-md focus-visible:outline focus-visible:outline-red-600"
          placeholder="Search gigs..."
        />
        <input type="search"
          name="q"
          id="default-search"
               className=" min-w-24 block w-full py-2 pl-4 pr-2 text-slate-900 rounded-sm bg-slate-50 text-md focus-visible:outline focus-visible:outline-red-600" placeholder="Search gigs..." />


      <button type="submit" className="text-white h-10 px-2 absolute end-0 bottom-0 bg-red-600 hover:bg-red-500 rounded-r-sm text-lg  accent-red-600 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-inset focus-visible:ring-white focus-visible:ring-offset-red-600 focus-visible:outline-none">

          <svg className="p-1 w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width="24" height="24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
      </button>


    </div>
    </Form>

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
);
}

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-gray-800 text-white p-2 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto">
        <div className="flex justify-start items-center  space-x-1">
          <Logo />
          <HamburgerMenu toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
          <DesktopMenu/>
        </div>
      </div>
      <MobileMenu isMenuOpen={isMenuOpen} />
    </header>
  );
};


const DefaultLayout = () => {
  const [params] = useSearchParams()
  const showHeader = params.get("showHeader")
  // todo : bootstrap->tailwindcss so can delete the hack "revert-tailwind" and friends
return (<div className="flex flex-col h-screen">
          {showHeader && <NavBar /> }
          <div className="relative">
            <div className="gig-explorer revert-tailwind" data-bs-theme="light">
          <Outlet/>
          </div>
          </div>

        </div>)
}



export default DefaultLayout;
