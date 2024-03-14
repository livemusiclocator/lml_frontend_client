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

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <Form.Control
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Search gig, ..."
        />
        <Button variant="outline-primary" type="submit">
          Search
        </Button>
      </InputGroup>
    </Form>
  );
}

export default SearchForm;
