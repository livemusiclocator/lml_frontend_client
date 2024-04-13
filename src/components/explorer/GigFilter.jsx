import DateSlider from "../DateSlider";

export default function GigFilter({ date, setDate }) {
  return <DateSlider date={date} onChange={setDate} />;
}
