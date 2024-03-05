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

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-nav">
          <form
            className="d-flex me-auto"
            role="search"
            onSubmit={handleSubmit}
          >
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search gig, ..."
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
        </div>
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
