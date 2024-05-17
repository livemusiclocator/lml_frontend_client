import DateSlider from "../DateSlider";
import { useActiveGigFilters } from "../../hooks/filters";

export default function GigFilter({ className }) {
  const [{ customDate = "" }, setActiveGigFilters] = useActiveGigFilters();
  return (
    <DateSlider
      className={className}
      date={customDate}
      onChange={(newValue) => {
        setActiveGigFilters({ customDate: newValue });
      }}
    />
  );
}
