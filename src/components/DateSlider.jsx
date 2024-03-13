import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDate } from "../contexts/DateContext";

const DateSlider = () => {
  const { date: selectedDate, setDate: setSelectedDate } = useDate();

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div id="root-portal" className="date-slider">
      <button onClick={handlePreviousDay} className="arrow-button">
        ◀
      </button>
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        dateFormat="MM/dd/yyyy"
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
