import DateSlider from "../DateSlider";
import { useNavigate, createSearchParams } from "react-router-dom";
import { useGigDateParams } from "../../hooks/api";

export default function GigFilter({ className }) {
  const { dates } = useGigDateParams();

  const navigate = useNavigate();
  return (
    <DateSlider
      className={className}
      date={dates[0]}
      onChange={(newValue) => {
        navigate({
          search: createSearchParams({
            date: newValue?.format("YYYY-MM-DD"),
          }).toString(),
        });
      }}
    />
  );
}
