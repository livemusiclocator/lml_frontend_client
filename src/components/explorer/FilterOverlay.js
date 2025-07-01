import tw from "tailwind-styled-components";

export const FilterWrapper = tw.div`
  z-20 absolute bottom-0 left-0 w-full max-w-2xl p-0 h-full md:max-h-full
  flex flex-col py-2 overflow-hidden group bg-white
  md:rounded-3xl
  md:shadow-xl
  ease-in-out
  duration-150
  transition-[height]
  m-0 md:m-2
   ${(props) =>
     props.$listMaximised
       ? `h-full md:h-220 `
       : `is-minimised border border-gray-200 rounded-t-3xl h-40`}
`;
