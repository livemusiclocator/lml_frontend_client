import ListIcon from "../assets/svg/ListIcon.svg?react";
import MapIcon from "../assets/svg/MapIcon.svg?react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const pathMatchRoute = (route) => {
    return route === location.pathname;
  };

  const isMapView = pathMatchRoute("/map");

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {isMapView && (
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <ListIcon className="icon" alt="List" /> <span>List</span>
                </Link>
              </li>
            )}
            {!isMapView && (
              <li className="nav-item">
                <Link className="nav-link" to="/map">
                  <MapIcon className="icon" alt="Map" /> <span>Map</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
