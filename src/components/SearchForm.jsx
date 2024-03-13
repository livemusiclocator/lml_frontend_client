import { useState } from "react";
import { useSearch } from "../contexts/SearchContext";
import Form from "react-bootstrap/Form";
import "react-datepicker/dist/react-datepicker.css";

function SearchForm() {
  const { setSearchParams } = useSearch();
  const [postcode, setPostcode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ postcode });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Control
          type="text"
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Search gig, ..."
        />
      </Form.Group>
      <Form.Group>
        <Form.Control type="submit" value="Search" />
      </Form.Group>
    </Form>
  );
}

export default SearchForm;
