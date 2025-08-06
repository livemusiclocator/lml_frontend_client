import {
  MapPinIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router";
import { filteredGigListPath } from "../../searchParams";

export default function Venue({ venue }) {
  return (
    <div className="flex gap-x-2">
      <MapPinIcon className="size-6 shrink-0" />
      <ul>
        <li aria-label="Venue" className="font-semibold text-lg">
          <Link to={filteredGigListPath({ venueIds: venue.id })}>
            {venue.name}
          </Link>
        </li>
        <li aria-label="Venue address">{venue.address}</li>
        {venue.location_url && (
          <li aria-label="Directions link">
            <a href={venue.location_url} className="external-link">
              Get directions
              <ExternalLinkIcon />
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
