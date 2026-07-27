import { Link } from "react-router";

export default function UpcomingGigs({ gigs }) {
  if (!gigs || gigs.length === 0) {
    return null;
  }
  return (
    <div className="px-4 pt-2">
      <h2 className="font-semibold text-sm uppercase text-gray-600 mb-2">
        Upcoming Gigs
      </h2>
      <ul className="flex flex-col gap-2">
        {gigs.map((gig) => (
          <li key={gig.id}>
            <Link
              to={`/gigs/${gig.id}`}
              className="block bg-gray-100 rounded p-3 hover:bg-gray-200 transition"
            >
              <p className="font-medium">
                {gig.name} @ {gig.venue.name}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(gig.date).toLocaleDateString("en-AU", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
