import styled from "styled-components";

const LoadingSpinnerCircle = () => {
  return (
    <div
      className="w-8 h-8 bg-current rounded-full animate-spinner-grow text-slate-200 opacity-0 scale-0"
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center mt-4 gap-2 delay-500 animate-delayed-entrance">
      <LoadingSpinnerCircle />
      <LoadingSpinnerCircle />
      <LoadingSpinnerCircle />
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
