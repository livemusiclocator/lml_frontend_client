import { useState } from "react";
import { useSearch } from "../contexts/SearchContext";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "react-datepicker/dist/react-datepicker.css";
import Button from "react-bootstrap/Button";

function SearchForm() {
  const { setSearchParams } = useSearch();
  const [postcode, setPostcode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ postcode });
  };

  const handleFilterClick = () => {};

  return (
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
    </Form>
  );
}

export default SearchForm;
