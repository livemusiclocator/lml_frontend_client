import styled from "styled-components";

const DateSliderWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export default function DateSlider({ date, onChange }) {
  const handlePreviousDay = () => {
    const newDate = new Date(date.setDate(date.getDate() - 1));
    onChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date.setDate(date.getDate() + 1));
    onChange(newDate);
  };

  const handleDateChange = (e) => {
    onChange(e.target.valueAsDate);
  };

  return (
    <DateSliderWrapper>
      <button onClick={handlePreviousDay} className="btn btn-outline-dark">
        ◀
      </button>
      <input
        className="form-control mx-2"
        type="date"
        onChange={handleDateChange}
        value={date.toISOString().split("T")[0]}
      />
      <button onClick={handleNextDay} className="btn btn-outline-dark">
        ▶
      </button>
    </DateSliderWrapper>
  );
}
