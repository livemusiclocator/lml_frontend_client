import styled from "styled-components";
const LoadingOverlayWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 900;
  display: flex;
  justify-content: center;
  padding-top: 30vh;
`;

export default function LoadingOverlay() {
  return (
    <LoadingOverlayWrapper>
      <div className="spinner-grow text-primary mr-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="spinner-grow text-primary mr-3" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <div className="spinner-grow text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </LoadingOverlayWrapper>
  );
}
