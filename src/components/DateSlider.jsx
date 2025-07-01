import styled from "styled-components";
import dayjs from "dayjs";
const DateSliderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export default function DateSlider({ date, onChange, className = "" }) {
  const handlePreviousDay = () => {
    const newDate = date?.subtract(1, "day");
    onChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = date?.add(1, "day");
    onChange(newDate);
  };

  const handleDateChange = (e) => {
    if (e.target.valueAsDate) {
      onChange(dayjs(e.target.valueAsDate));
    } else {
      onChange(null);
    }
  };
  return (
    <DateSliderWrapper className={className}>
      {/**  tailwind and bootstrap csses here! todo- move to just tw */}
      <button onClick={handlePreviousDay} className="btn btn-outline-dark ">
        ◀
      </button>
      <input
        className="form-control mx-2 border border border-gray-400"
        type="date"
        onChange={handleDateChange}
        value={dayjs(date).format("YYYY-MM-DD")}
      />
      <button onClick={handleNextDay} className="btn btn-outline-dark">
        ▶
      </button>
    </DateSliderWrapper>
  );
}
