import { Modal, Button } from "react-bootstrap";

const FilterModal = ({ showModal, handleClose }) => {
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
        <p>Lot of filtering going on here...</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Apply Filters
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;
