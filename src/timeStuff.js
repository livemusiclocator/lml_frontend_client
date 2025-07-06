import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // For timezone support
import weekOfYear from "dayjs/plugin/weekOfYear"; // For week of year support
import isBetween from "dayjs/plugin/isBetween";
import localizedFormat from "dayjs/plugin/localizedFormat"; //
import localeData from "dayjs/plugin/localeData";
import minMax from "dayjs/plugin/minMax";
import isoWeek from "dayjs/plugin/isoWeek";
// browser locale is not obviously used by dayjs...
import "dayjs/locale/en-au";
// todo: We dont need some of these... not sure which. Should remove them so the bundle size does not get massive
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(minMax);
dayjs.extend(timezone);
dayjs.extend(weekOfYear);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);
dayjs.extend(isoWeek);

dayjs.locale("en-au");

export const todaysDate = () => {
  // HARDCODING TIMEZONE here
  //
  const now = dayjs().tz("Australia/Melbourne");
  return now.startOf("day");
};

export const DATE_RANGES = {
  today: {
    caption: "Today",
    id: "today",
    datesFn: (today) => [today],
  },
  tomorrow: {
    caption: "Tomorrow",
    id: "tomorrow",
    datesFn: (today) => [today.add(1, "day")],
  },
  weekend: {
    caption: "Weekend",
    id: "weekend",
    datesFn: (today) => {
      // todo: we could make this Saturday, Sunday if the current day is saturday etc.
      // todo: Gigs that have a start time of midnight Sunday night should count as weekend - can we just use the start date and assume it's legit?
      const startOfWeekend = today.isoWeekday(5);
      const endOfWeekend = today.isoWeekday(7);
      return [startOfWeekend, endOfWeekend];
    },
  },
  thisWeek: {
    caption: "This Week",
    id: "thisWeek",
    datesFn: (today) => {
      return [today, today.endOf("isoWeek")];
    },
  },
  nextWeek: {
    caption: "Next week",
    id: "nextWeek",
    datesFn: (today) => {
      const nextWeekStart = today.add(1, "week").startOf("isoWeek");
      const nextWeekEnd = nextWeekStart.endOf("isoWeek");
      return [nextWeekStart, nextWeekEnd];
    },
  },
  customDate: {
    caption: "Specific date",
    ui: "datetime",
    id: "customDate",
    datesFn: (today, customDate) => {
      return [dayjs(customDate || today)];
    },
  },
};

/**
 * Calculates the date range for a given date range ID and optional custom date
 * Returns dates as formatted strings in YYYY-MM-DD format
 */
export function datesForDateRange(id, customDate) {
  const dateRange = DATE_RANGES[id] || DATE_RANGES.today;

  const dates = dateRange.datesFn(todaysDate(), customDate);
  return dates.map((d) => {
    return d.format("YYYY-MM-DD");
  });
}
