import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import TagsInput from "./TagsInputs";

const FilterModal = ({ showModal, handleClose, setFilterTags }) => {
  const [tags, setTags] = useState([]);
  const handleApplyFilters = () => {
    setFilterTags(tags);
    handleClose();
  };

  return (
    <Modal
      id="fullScreenModalId"
      show={showModal}
      onHide={handleClose}
      fullscreen={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>Filters</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h2>Filter by postcodes</h2>
        <TagsInput tags={tags} setTags={setTags} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;
