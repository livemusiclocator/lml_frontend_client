import DateTimeDisplay from "@/components/shared/DateTimeDisplay";

// Sticks to the top of the scroller so you always know which night you are
// looking at, however far down a week you have scrolled.
const DateDivider = ({ date, count }) => (
  <div className="sticky top-0 z-10 flex items-center justify-between border-y border-night-line bg-night-raised px-4 py-2">
    <span className="font-mono text-micro font-semibold tracking-[0.12em] uppercase">
      <DateTimeDisplay value={date} type="weekdayDate" />
    </span>
    {count != null && (
      <span className="font-mono text-micro tracking-[0.08em] text-ink-muted">
        {count} {count === 1 ? "gig" : "gigs"}
      </span>
    )}
  </div>
);

export default DateDivider;
