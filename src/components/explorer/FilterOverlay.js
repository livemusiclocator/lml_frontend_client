import styled from "styled-components";

export const FilterWrapper = styled.div`
  transition:
    flex-basis 0.15s ease-in,
    border-radius 0.15s ease-in;
  ${(props) => {
    switch (props.$listMaximised) {
      case false:
        return `
          border-top-right-radius: 1.5rem;
          border-top-left-radius: 1.5rem;
flex-shrink: 1;
flex-grow: 0;
flex-basis: 95px;
        `;
      case true:
        return ` flex-basis: 100%;
        `;
    }
  }};

  @media (min-width: 1024px) {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
    bottom: 20px;
    left: 20px;
    border-radius: 1.5rem;
  }
`;
