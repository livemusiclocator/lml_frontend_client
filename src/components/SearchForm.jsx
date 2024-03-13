import { useState } from "react";
import { useSearch } from "../contexts/SearchContext";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "react-datepicker/dist/react-datepicker.css";

function SearchForm() {
  const { setSearchParams } = useSearch();
  const [postcode, setPostcode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ postcode });
  };

  return (
    <Form onSubmit={handleSubmit} inline>
      <InputGroup>
        <Form.Control
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Search gig, ..."
        />
      </InputGroup>
    </Form>
  );
}

export default SearchForm;
