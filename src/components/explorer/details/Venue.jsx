import tw from "tailwind-styled-components";
import {
  MapPinIcon,
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
} from "@heroicons/react/24/solid";

const ExternalLink = tw.a`text-blue-600 hover:underline visited:text-purple-600 inline-flex items-baseline`;

export default function Venue({ venue }) {
  return(
    <div className="flex gap-x-2">
      <MapPinIcon className="size-6 shrink-0" />
      <ul>
        <li aria-label="Venue" className="font-semibold text-lg">
          {venue.name}
        </li>
        <li aria-label="Venue address">{venue.address}</li>
        {venue.location_url && (
          <li aria-label="Directions link">
            <ExternalLink href={venue.location_url}>
              Get directions
              <ExternalLinkIcon className="size-4 self-center mx-1" />
            </ExternalLink>
          </li>
        )}
      </ul>
    </div>
  );
}
