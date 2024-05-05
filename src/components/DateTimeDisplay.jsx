// todo: Make a nice current-time aware version of this perhaps?
//
const DateTimeDisplay = ({ value, start, end, type = "date" }) => {
  // just a bit of mistakeproofin. probably a bit silly
  value = value || start;
  // does undefined use the browser default ?
  const formatters = {
    date: new Intl.DateTimeFormat(undefined, {
      dateStyle: "full",
    }),
    briefDate: new Intl.DateTimeFormat(undefined, {
      month: "long",
      day: "numeric",
    }),
    time: new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "numeric",
    }),

    dateAndTime: new Intl.DateTimeFormat(undefined, {
      timeStyle: "short",
      dateStyle: "long",
    }),
  };

  if (!value) {
    return null;
  }
  const formatter = formatters[type];
  const display =
    end && start
      ? formatter.formatRange(new Date(start), new Date(end))
      : formatter.format(new Date(value));
  return <time dateTime={value}>{display}</time>;
};

export default DateTimeDisplay;
