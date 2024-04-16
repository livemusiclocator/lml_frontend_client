import styled from "styled-components";

const LoadingSpinnerCircle = () => {
return(      <div className="w-8 h-8 bg-current rounded-full animate-spinner-grow" role="status">
        <span className="sr-only">Loading...</span>
             </div>);
}
export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center mt-4">
      <LoadingSpinnerCircle/>
      <LoadingSpinnerCircle/>
      <LoadingSpinnerCircle/>
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
