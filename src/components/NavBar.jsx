import ListIcon from "../assets/svg/ListIcon.svg?react";
import MapIcon from "../assets/svg/MapIcon.svg?react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import SearchForm from "./SearchForm";

function Navbar() {
  const location = useLocation();

  const pathMatchRoute = (route) => {
    return route === location.pathname;
  };

  const isMapView = pathMatchRoute("/map");

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <SearchForm />
        <div className="navbar-nav"></div>
        <li className="nav-item">
          {isMapView ? (
            <Link className="nav-link" to="/">
              <ListIcon className="icon" alt="List" />
              <span>List</span>
            </Link>
          ) : (
            <Link className="nav-link" to="/map">
              <MapIcon className="icon" alt="Map" />
              <span>Map</span>
            </Link>
          )}
        </li>
      </div>
    </nav>
  );
}

export default Navbar;
