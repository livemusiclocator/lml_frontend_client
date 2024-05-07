import DateSlider from "../DateSlider";

import { useGigFilters } from "../../hooks/api";

export default function GigFilter({ className }) {
  const [{ dateParsed }, setGigFilters] = useGigFilters();
  return (
    <DateSlider
      className={className}
      date={dateParsed}
      onChange={(newValue) => {
        setGigFilters({ date: newValue?.format("YYYY-MM-DD") });
      }}
    />
  );
}
