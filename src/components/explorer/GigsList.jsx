import { Link } from "react-router-dom";
import SaveGigButton from "../SaveGigButton";
import DateTimeDisplay from "../DateTimeDisplay";
import styled from "styled-components";

export default function GigsList({ gigs }) {
  return (
    <div className="h-full overflow-auto pb-6 divide-y divide-gray-200">
      {gigs.map((gig) => (
        <Link to={`gigs/${gig.id}`} key={gig.id} className="py-2 px-4 block">
          <div className="flex justify-between mb-2">
            {gig.start_time && (
              <div className="text-nowrap">
                <DateTimeDisplay value={gig.start_time} type="time" />
              </div>
            )}
            <SaveGigButton />
          </div>
          <h4 className="text-xl font-medium leading-8 text-gray-900">
            {gig.name}
          </h4>
          <div className="mb-1">{gig.venue.name} </div>
          <div className="text-gray-600">{gig.venue.address}</div>
        </Link>
      ))}
    </div>
  );
}
