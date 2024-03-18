import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const DateSlider = ({ date, onChange }) => {
  const handlePreviousDay = () => {
    const newDate = new Date(date.setDate(date.getDate() - 1));
    onChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(date.setDate(date.getDate() + 1));
    onChange(newDate);
  };

  const handleDateChange = (date) => {
    onChange(date);
  };

  return (
    <div id="root-portal" className="date-slider">
      <button onClick={handlePreviousDay} className="arrow-button">
        ◀
      </button>
      <DatePicker
        selected={date}
        onChange={handleDateChange}
        dateFormat="dd/MM/yyyy"
        wrapperClassName="date-picker-wrapper"
        withPortal
        portalId="root-portal"
      />
      <button onClick={handleNextDay} className="arrow-button">
        ▶
      </button>
    </div>
  );
};

export default DateSlider;
