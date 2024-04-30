import DateSlider from "../DateSlider";

import { useGigFilters } from "../../hooks/api";

export default function GigFilter() {
  const [{ dateParsed }, setGigFilters] = useGigFilters();
  return (
    <DateSlider
      date={dateParsed}
      onChange={(newValue) => {
        setGigFilters({ date: newValue });
      }}
    />
  );
}
