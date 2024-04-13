import styled from "styled-components";

export const LoadingSpinner = () => {
  return (
    <div className="d-flex justify-content-center mt-3">
      <div className="spinner-grow text-primary me-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="spinner-grow text-primary me-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="spinner-grow text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

const LoadingOverlayWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 900;
  display: flex;
  justify-content: center;
  padding-top: 30vh;
`;

export default function LoadingOverlay() {
  return (
    <LoadingOverlayWrapper>
      <LoadingSpinner />
    </LoadingOverlayWrapper>
  );
}
