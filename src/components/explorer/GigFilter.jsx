import DateSlider from "../DateSlider";
import { useActiveGigFilters } from "../../hooks/api";

export default function GigFilter({ className }) {
  const [{ customDate = "" }, setActiveGigFilters] = useActiveGigFilters();

  return (
    <DateSlider
      className={className}
      date={customDate}
      onChange={(newValue) => {
        console.log("hello", customDate);
        setActiveGigFilters({ customDate: newValue });
      }}
    />
  );
}
