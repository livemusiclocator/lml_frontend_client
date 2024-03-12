import { useState } from "react";
import { useSearch } from "../contexts/SearchContext";

function SearchForm() {
  const { setSearchParams } = useSearch();
  const [postcode, setPostcode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ postcode });
  };

  return (
    <form className="d-flex me-auto" role="search" onSubmit={handleSubmit}>
      <input
        className="form-control me-2"
        type="search"
        placeholder="Search gig, ..."
        aria-label="Search"
        value={postcode}
        onChange={(e) => setPostcode(e.target.value)}
      />
      <button className="btn btn-outline-success" type="submit">
        Search
      </button>
    </form>
  );
}

export default SearchForm;
