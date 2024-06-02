import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { NavLink, Link, Outlet } from "react-router-dom";
import { getTheme } from "../getLocation";

const Logo = () => (
  <div className="flex-1 pl-2">
    <Link
      to="/"
      className="flex justify-start items-center text-slate-50 space-x-2 font-sans"
    >
      <img src={getTheme().brandmark} className="flex-shrink w-10" />
      <span className="text-xl">{getTheme().title}</span>
    </Link>
  </div>
);
const HamburgerMenu = ({ toggleMenu }) => (
  <button
    onClick={toggleMenu}
    className="text-gray-200 focus:outline-none lg:hidden"
  >
    <Bars3Icon className="h-6" />
  </button>
);

const NavItem = ({ to, children }) => {
  const baseStyles = "py-4 px-2 text-gray-200";
  const setActiveLinkStyles = ({ isActive }) => {
    return isActive
      ? `${baseStyles} font-semibold`
      : `${baseStyles} font-normal transition duration-200 hover:text-gray-300`;
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
      isMenuOpen ? "absolute left-0" : "hidden"
    } shadow-md `}
  >
    <ul className="space-y-6 bg-gray-800 px-6 pt-4 pb-8 flex items-end flex-col">
      <NavItem to="/">Home</NavItem>
      <NavItem to="/about">About</NavItem>
    </ul>
  </div>
);

const DesktopMenu = () => (
  <div className="hidden lg:block">
    <ul className="px-2 pt-2 pb-3 flex flex-row sm:px-3">
      <NavItem to="/">Home</NavItem>
      <NavItem to="/about">About</NavItem>
      <NavItem to="/upcoming">Upcoming</NavItem>
    </ul>
  </div>
);

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-gray-800 text-white px-2 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto py-2">
        <div className="flex justify-start items-center space-x-1">
          <HamburgerMenu toggleMenu={() => setIsMenuOpen(!isMenuOpen)} />
          <Logo />
          <DesktopMenu />
        </div>
      </div>
      <MobileMenu isMenuOpen={isMenuOpen} />
    </header>
  );
};

const DefaultLayout = () => {
  return (
    <div className="flex flex-col h-screen relative">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
