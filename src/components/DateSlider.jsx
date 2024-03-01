import { useState } from "react";

const DateSlider = ({ initialDate, onChange }) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
    setCurrentDate(newDate);
    onChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
    setCurrentDate(newDate);
    onChange(newDate);
  };

  const formatDate = (date) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return date.toLocaleDateString("en-AU", options);
  };

  return (
    <div className="date-slider">
      <button onClick={handlePreviousDay}>◀</button>
      <span>{formatDate(currentDate)}</span>
      <button onClick={handleNextDay}>▶</button>
    </div>
  );
};

export default DateSlider;
