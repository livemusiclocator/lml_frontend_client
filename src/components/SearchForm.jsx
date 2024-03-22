import { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "react-datepicker/dist/react-datepicker.css";
import Button from "react-bootstrap/Button";
import FilterModal from "./FilterModal";

function SearchForm({ setSearchParams }) {
  const [postcode, setPostcode] = useState("");
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ postcode, tags });
  };

  const handleFilterClick = () => setShowModal(true);

  const handleApplyFilters = (newTags) => {
    setSearchParams((prevParams) => ({ ...prevParams, tags: newTags }));
    setShowModal(false);
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Form.Control
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Search gig, ..."
            size="sm"
          />
          <Button variant="danger" type="submit" size="sm">
            Search
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleFilterClick}
          >
            Filters
          </Button>
        </InputGroup>
        <FilterModal
          showModal={showModal}
          handleClose={() => setShowModal(false)}
          setFilterTags={handleApplyFilters}
          tags={tags}
        />
      </Form>
    </>
  );
}

export default SearchForm;
