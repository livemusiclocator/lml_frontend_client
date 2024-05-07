import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // For timezone support
import weekOfYear from "dayjs/plugin/weekOfYear"; // For week of year support
import isBetween from "dayjs/plugin/isBetween"; //
import localizedFormat from "dayjs/plugin/localizedFormat"; //
import localeData from "dayjs/plugin/localeData";
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(weekOfYear);
dayjs.extend(localeData);
dayjs.extend(localizedFormat);

export function generateTimePeriods() {
  const now = dayjs().tz("Australia/Melbourne").startOf("day"); // HARDCODING TIMEZONE here
  const periods = [];

  // Object 1: Today
  periods.push({
    caption: "Today",
    dateFrom: now,
    dateTo: now.endOf("day"),
    key: `today-${now.format("YYYY-MM-DD")}`,
  });

  // Object 2: Tomorrow
  const tomorrow = now.add(1, "day");
  periods.push({
    caption: "Tomorrow",
    dateFrom: tomorrow.startOf("day"),
    dateTo: tomorrow.endOf("day"),
    key: `tomorrow-${tomorrow.format("YYYY-MM-DD")}`,
  });

  // Object 3: This Week (remaining days if not Saturday or Sunday)
  if (now.day() !== 6 && now.day() !== 0) {
    const endOfWeek = now.endOf("week");
    periods.push({
      caption: "This week",
      dateFrom: now.add(2, "days").startOf("day"),
      dateTo: endOfWeek,
      key: `this-week-${now.format("YYYY-MM-DD")}`,
    });
  }

  // Object 4: Next Week
  const nextWeekStart = now.add(1, "week").startOf("week");
  const nextWeekEnd = nextWeekStart.endOf("week");
  periods.push({
    caption: "Next Week",
    dateFrom: nextWeekStart,
    dateTo: nextWeekEnd,
    key: `next-week-${nextWeekStart.format("YYYY-MM-DD")}`,
  });

  return periods.map(({ dateFrom, dateTo, ...rest }) => ({
    ...rest,
    dateFrom,
    dateTo,
    params: {
      date: dateFrom.format("YYYY-MM-DD"),
    },
  }));
}
