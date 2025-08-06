import DateTimeDisplay from "/src/components/shared/DateTimeDisplay";

import { CalendarIcon } from "@heroicons/react/24/solid";

export default function DateTime({ gig }) {
  return (
    <div className="flex gap-x-2">
      <CalendarIcon className="size-6 shrink-0" />
      <ul className="font-semibold text-lg">
        <li aria-label="Date">
          <DateTimeDisplay value={gig.date} />
        </li>
        <li aria-label="Time">
          <DateTimeDisplay
            start={gig.start_timestamp}
            end={gig.finish_timestamp}
            type="time"
          />
        </li>
      </ul>
    </div>
  );
}
