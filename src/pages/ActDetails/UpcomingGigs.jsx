import { Link } from "react-router";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";
import DateTimeDisplay from "@/components/shared/DateTimeDisplay";
import { filteredGigListPath } from "@/searchParams";

// The api renders the act's gigs in date order and only the ones still to come,
// so there is no sorting or filtering to do here.
const UpcomingGig = ({ gig }) => {
  return (
    <li className="py-2" aria-label="Upcoming gig">
      <h3 className="font-bold flex flex-wrap items-center">
        <Link to={`/gigs/${gig.id}`} className="internal-link">
          {gig.name}
        </Link>
        {gig.status === "cancelled" && " (CANCELLED)"}
        {gig.ticket_status === "selling_fast" && (
          <span className="ticket-status">SELLING FAST</span>
        )}
        {gig.ticket_status === "sold_out" && (
          <span className="ticket-status">SOLD OUT</span>
        )}
      </h3>
      <p className="flex gap-x-1 items-center text-sm" aria-label="Time">
        <ClockIcon className="size-4 shrink-0 text-gray-500" />
        <DateTimeDisplay
          value={gig.start_timestamp || gig.date}
          type={gig.start_timestamp ? "dateAndTime" : "date"}
        />
      </p>
      {/* a gig without a venue is unusual but the api does not promise one */}
      {gig.venue && (
        <div className="flex gap-x-1 items-start text-sm" aria-label="Venue">
          <MapPinIcon className="size-4 shrink-0 text-gray-500 mt-1" />
          <div>
            <p className="font-semibold">
              <Link to={filteredGigListPath({ venueIds: [gig.venue.id] })}>
                {gig.venue.name}
              </Link>
            </p>
            <p className="text-gray-500" aria-label="Venue address">
              {gig.venue.address}
            </p>
          </div>
        </div>
      )}
    </li>
  );
};

export default function UpcomingGigs({ gigs = [] }) {
  return (
    <section className="px-4 pt-2" aria-label="Upcoming gigs">
      <h2 className="font-semibold text-lg">Upcoming gigs</h2>
      {gigs.length === 0 ? (
        <p className="text-gray-600">
          We don&apos;t have any gigs listed for this act just now.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {gigs.map((gig) => (
            <UpcomingGig key={gig.id} gig={gig} />
          ))}
        </ul>
      )}
    </section>
  );
}
