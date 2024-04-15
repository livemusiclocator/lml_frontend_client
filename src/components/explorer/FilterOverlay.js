import styled from "styled-components";

export const FilterWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  background-color: white;
  overflow: hidden;
  transition: height 0.15s ease-in, border-radius 0.15s ease-in;
  width: 100vw;
  bottom: 0;
  ${(props) => {
    switch (props.$listMaximised) {
      case false:
        return `
          border-top-right-radius: 1.5rem;
          border-top-left-radius: 1.5rem;
          height: 95px
        `;
      case true:
        return `
          height: 100dvh
        `;
    }
  }};

  @media (min-width: 1024px) {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    bottom: 20px;
    left: 20px;
    min-width: 300px;
    max-width: 400px;
    border-radius: 1.5rem;

    ${(props) => props.$listMaximised && `height: calc(100vh - 20px - 20px);`};
  }
`;
