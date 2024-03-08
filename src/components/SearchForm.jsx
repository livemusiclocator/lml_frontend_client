function SearchForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className="d-flex me-auto" role="search" onSubmit={handleSubmit}>
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
  );
}

export default SearchForm;
