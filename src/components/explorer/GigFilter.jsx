import DateSlider from "../DateSlider";

import { useGigFilters } from "../../hooks/api";

export default function GigFilter({ className }) {
  const [{ dates = [] }, setGigFilters] = useGigFilters();
  return (
    <DateSlider
      className={className}
      date={dates[0]}
      onChange={(newValue) => {
        setGigFilters({ date: newValue?.format("YYYY-MM-DD") });
      }}
    />
  );
}
