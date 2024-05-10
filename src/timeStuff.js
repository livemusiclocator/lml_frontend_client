import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // For timezone support
import weekOfYear from "dayjs/plugin/weekOfYear"; // For week of year support
import isBetween from "dayjs/plugin/isBetween";
import localizedFormat from "dayjs/plugin/localizedFormat"; //
import localeData from "dayjs/plugin/localeData";
import minMax from "dayjs/plugin/minMax";
import isoWeek from "dayjs/plugin/isoWeek";
// todo: We dont need some of these... not sure which. Should remove them so the bundle size does not get massive
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(minMax);
dayjs.extend(timezone);
dayjs.extend(weekOfYear);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);

function generateDateRange(startDate, endDate) {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  const diffDays = end.diff(start, "day");

  const result = Array.from({ length: diffDays + 1 }, (_, i) =>
    start.add(i, "day"),
  );
  return result;
}

export const todaysDate = () => {
  // HARDCODING TIMEZONE here
  //
  const now = dayjs().tz("Australia/Melbourne");
  return now.startOf("day");
};

export function generateTimePeriods() {
  const periods = [];
  const today = todaysDate();
  const tomorrow = today.add(1, "day");
  const endOfWeek = today.endOf("isoWeek");
  // "the weekend starts here" ... or here...
  const startOfWeekend = dayjs().isoWeekday(5);
  const startOfCurrentWeekend = startOfWeekend; //dayjs.max(today, startOfWeekend);
  // todo: Gigs that have a start time of midnight Sunday night should count as weekend - can we just use the start date and assume it's legit?
  const endOfWeekend = dayjs().isoWeekday(7);

  const nextWeekStart = today.add(1, "week").startOf("isoWeek");
  const nextWeekEnd = nextWeekStart.endOf("isoWeek");

  periods.push({
    caption: "Today",
    dates: [today],
    key: "today",
  });

  periods.push({
    caption: "Tomorrow",
    dates: [tomorrow],
    key: "tomorrow",
  });

  periods.push({
    caption: "Weekend",
    dates: generateDateRange(startOfCurrentWeekend, endOfWeekend),
    key: "this-weekend",
  });
  periods.push({
    caption: "This week",
    dates: generateDateRange(today, endOfWeek),
    key: "this-week",
  });

  periods.push({
    caption: "Next week",
    dates: generateDateRange(nextWeekStart, nextWeekEnd),
    key: "next-week",
  });

  return periods.reduce((map, period) => {
    map[period.key] = period;
    return map;
  }, {});
}

export function daysForTimePeriod(key) {
  const timePeriods = generateTimePeriods();
  return timePeriods[key]?.dates;
}
