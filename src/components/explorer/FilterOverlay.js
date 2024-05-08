import tw from "tailwind-styled-components";

export const FilterWrapper = tw.div`
  flex flex-col py-2 overflow-hidden group bg-white
  lg:rounded-3xl
  lg:shadow-xl
  ease-in-out
  duration-150
  transition-[flex-basis]
   ${(props) => (props.$listMaximised ? `basis-full` : `is-minimised border rounded-t-3xl basis-32`)}
`;
